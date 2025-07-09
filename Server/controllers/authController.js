const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendSMS = require('../utils/sendSMS');

// In-memory OTP store (recommend Redis or DB in production)
const otpStore = new Map();

// 🔐 Generate a 6-digit numeric OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// 📤 Send OTP
exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min

    otpStore.set(phoneNumber, { otp, expiresAt });

    const smsText = `Dear User, ${otp} is the verification code for your interaction with Vimla Jewellers, Jodhpur.`;

    const SMS_TIMEOUT = 10000;
    const smsPromise = sendSMS(phoneNumber, smsText);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMS sending timeout')), SMS_TIMEOUT)
    );

    await Promise.race([smsPromise, timeoutPromise]);

    console.log(`✅ OTP sent to ${phoneNumber}`);
    return res.status(200).json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('❌ Error sending OTP:', {
      phoneNumber,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    otpStore.delete(phoneNumber);

    if (error.message.includes('timeout')) {
      return res.status(503).json({ message: 'SMS service timeout', error: 'SERVICE_TIMEOUT' });
    }

    if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
      return res.status(503).json({ message: 'Network error. Try again.', error: 'NETWORK_ERROR' });
    }

    return res.status(500).json({ message: 'Failed to send OTP', error: 'SMS_SEND_FAILED' });
  }
};

// ✅ Verify OTP and log in/register user
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, fullName = '', address = '', otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const record = otpStore.get(phoneNumber);

  if (!record) {
    return res.status(400).json({ message: 'OTP not found. Please request a new one.', error: 'OTP_NOT_FOUND' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phoneNumber);
    return res.status(400).json({ message: 'OTP expired. Request again.', error: 'OTP_EXPIRED' });
  }

  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ message: 'Invalid OTP.', error: 'OTP_INVALID' });
  }

  try {
    let user = await User.findByPhoneNumber(phoneNumber);

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

      console.log(`👤 Registered new user: ${phoneNumber}`);
    } else {
      console.log(`🔓 Logged in existing user: ${phoneNumber}`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    otpStore.delete(phoneNumber);

    return res.status(200).json({
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
    console.error('❌ Error verifying OTP:', {
      phoneNumber,
      error: error.message,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({ message: 'OTP verification failed', error: 'VERIFICATION_ERROR' });
  }
};

// 🧹 Clear expired OTPs (optional cron task)
exports.cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [phoneNumber, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(phoneNumber);
    }
  }
};

// 🔍 Debug OTPs (optional admin/debug route)
exports.getOTPStats = () => {
  return {
    totalOTPs: otpStore.size,
    otps: Array.from(otpStore.entries()).map(([phone, data]) => ({
      phone: phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'),
      expiresIn: Math.max(0, data.expiresAt - Date.now()),
      expired: Date.now() > data.expiresAt
    }))
  };
};
