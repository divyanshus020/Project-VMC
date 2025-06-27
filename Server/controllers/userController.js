const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// In-memory OTP store (use Redis or DB in production)
const otpStore = new Map();

// ===============================
// 📌 Check if user exists (for login screen)
// ===============================
exports.checkUserExists = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// ===============================
// 📤 Send OTP to existing user's phone
// ===============================
exports.sendOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    const smsText = `Dear User, ${otp} is the verification code for your interaction with Vimla Jewellers, Jodhpur.`;

    await axios.get('https://msg.smsguruonline.com/fe/api/v1/send', {
      params: {
        username: 'vimlajewellers.trans',
        password: '0RvS8',
        unicode: false,
        from: 'VIMLAJ',
        to: phoneNumber,
        dltprincipalEntityId: '1201159680625344081',
        dltContentId: '1707175093772914727',
        text: smsText,
      },
    });

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// ===============================
// ✅ Verify OTP & Register or Login
// ===============================
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
    let user = await User.findOne({ phoneNumber });

    // Register if user doesn't exist
    if (!user) {
      if (!fullName || !address) {
        return res.status(400).json({ message: 'Full name and address are required for registration' });
      }

      user = new User({ fullName, address, phoneNumber });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    otpStore.delete(phoneNumber); // Cleanup OTP

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 👤 Get user profile (requires auth middleware)
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user._id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// ✏️ Update profile (requires auth middleware)
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { address, fullName } = req.body;

    if (fullName) user.fullName = fullName;
    if (address) user.address = address;

    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
