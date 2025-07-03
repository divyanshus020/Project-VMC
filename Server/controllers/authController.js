const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendSMS = require('../utils/sendSMS');

// Temporary OTP store (For production: use Redis or DB with expiry)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP with improved error handling
exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const otp = generateOTP();

    // Store OTP with 5-minute expiration
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    const smsText = `Dear User, ${otp} is the verification code for your interaction with Vimla Jewellers, Jodhpur.`;
    
    // Add timeout wrapper for SMS sending
    const SMS_TIMEOUT = 10000; // 10 seconds timeout
    
    const smsPromise = sendSMS(phoneNumber, smsText);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMS sending timeout')), SMS_TIMEOUT)
    );

    await Promise.race([smsPromise, timeoutPromise]);

    console.log(`OTP sent successfully to ${phoneNumber}`);
    return res.status(200).json({ message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error('Error sending OTP:', {
      phoneNumber,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Clean up stored OTP if SMS failed
    otpStore.delete(phoneNumber);

    // Provide more specific error messages
    if (error.message.includes('timeout') || error.message.includes('Socket connection timeout')) {
      return res.status(503).json({ 
        message: 'SMS service is temporarily unavailable. Please try again in a few moments.',
        error: 'SERVICE_TIMEOUT'
      });
    }

    if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      return res.status(503).json({ 
        message: 'Network connectivity issue. Please check your connection and try again.',
        error: 'NETWORK_ERROR'
      });
    }

    return res.status(500).json({ 
      message: 'Failed to send OTP. Please try again.',
      error: 'SMS_SEND_FAILED'
    });
  }
};

// Verify OTP and register/login user (MySQL version)
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, fullName = '', address = '', otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const record = otpStore.get(phoneNumber);

  if (!record) {
    return res.status(400).json({ 
      message: 'OTP not found. Please request a new OTP.',
      error: 'OTP_NOT_FOUND'
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phoneNumber); // Clean up expired OTP
    return res.status(400).json({ 
      message: 'OTP has expired. Please request a new OTP.',
      error: 'OTP_EXPIRED'
    });
  }

  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ 
      message: 'Invalid OTP. Please check and try again.',
      error: 'OTP_INVALID'
    });
  }

  try {
    // Find user by phone number (MySQL)
    let user = await User.findByPhoneNumber(phoneNumber);

    // Register new user if not found
    if (!user) {
      if (!fullName.trim() || !address.trim()) {
        return res.status(400).json({
          message: 'Full name and address are required for registration',
          error: 'MISSING_USER_DATA'
        });
      }

      user = await User.create({
        phoneNumber,
        fullName: fullName.trim(),
        address: address.trim(),
      });
      console.log(`New user registered: ${phoneNumber}`);
    } else {
      console.log(`Existing user logged in: ${phoneNumber}`);
    }

    // Generate JWT token (MySQL: use user.id)
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Clear OTP from memory
    otpStore.delete(phoneNumber);

    return res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', {
      phoneNumber,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    return res.status(500).json({ 
      message: 'Server error during OTP verification',
      error: 'VERIFICATION_ERROR'
    });
  }
};

// Optional: Add cleanup function for expired OTPs
exports.cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [phoneNumber, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
};

// Optional: Get OTP store stats for debugging
exports.getOTPStats = () => {
  return {
    totalOTPs: otpStore.size,
    otps: Array.from(otpStore.entries()).map(([phone, data]) => ({
      phone: phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'), // Mask phone number
      expiresIn: Math.max(0, data.expiresAt - Date.now()),
      expired: Date.now() > data.expiresAt
    }))
  };
};
