const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendSMS = require('../utils/sendSMS');

// Temporary OTP store (For production: use Redis or DB with expiry)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Send OTP
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
    await sendSMS(phoneNumber, smsText);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// Verify OTP and register/login user
exports.verifyOTP = async (req, res) => {
  const { phoneNumber, fullName = '', address = '', otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  const record = otpStore.get(phoneNumber);

  if (
    !record ||
    String(record.otp) !== String(otp) || // strict comparison
    Date.now() > record.expiresAt
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    let user = await User.findOne({ phoneNumber });

    // Register new user if not found
    if (!user) {
      if (!fullName.trim() || !address.trim()) {
        return res.status(400).json({
          message: 'Full name and address are required for registration',
        });
      }

      user = new User({
        phoneNumber,
        fullName: fullName.trim(),
        address: address.trim(),
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Clear OTP from memory
    otpStore.delete(phoneNumber);

    return res.json({
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
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Server error during OTP verification' });
  }
};
