const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendSMS = require('../utils/sendSMS');

// In-memory store for OTPs (for demo purposes — use Redis or DB for production)
const otpStore = new Map();

// Send OTP
exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    // Store OTP (for 5 minutes)
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    // Send SMS via SMSGuru API
    const smsText = `Dear User, ${otp} is the verification code for your interaction with Vimla Jewellers, Jodhpur.`;
    await sendSMS(phoneNumber, smsText);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('SMS sending failed:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP & register/login user
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, fullName, address, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const record = otpStore.get(phoneNumber);
  if (!record || record.otp != otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    // Check if user exists
    let user = await User.findOne({ phoneNumber });

    if (!user) {
      if (!fullName || !address) {
        return res.status(400).json({ message: 'Name and address are required for registration' });
      }

      user = new User({ phoneNumber, fullName, address });
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Clear OTP
    otpStore.delete(phoneNumber);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        address: user.address,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
