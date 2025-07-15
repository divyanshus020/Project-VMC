const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// In-memory OTP store (Consider Redis/DB in production)
const otpStore = new Map();

// 🔐 Utility: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// 🔐 Utility: Send SMS via provider
const sendSMS = async (phoneNumber, otp) => {
  const text = `Dear User, ${otp} is the verification code for your interaction with Vimla Jewellers, Jodhpur.`;

  return axios.get('https://msg.smsguruonline.com/fe/api/v1/send', {
    params: {
      username: 'vimlajewellers.trans',
      password: '0RvS8',
      unicode: false,
      from: 'VIMLAJ',
      to: phoneNumber,
      dltprincipalEntityId: '1201159680625344081',
      dltContentId: '1707175093772914727',
      text,
    },
  });
};

// ===============================
// 1️⃣ Check if user exists
// ===============================
exports.checkUserExists = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const user = await User.findByPhoneNumber(phoneNumber);
    res.status(200).json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// ===============================
// 2️⃣ Send OTP - Login
// ===============================
exports.sendOTPForLogin = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

  const user = await User.findByPhoneNumber(phoneNumber);
  if (!user) return res.status(404).json({ message: 'User not found. Please register first.' });

  const otp = generateOTP();
  otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await sendSMS(phoneNumber, otp);
    res.status(200).json({ message: 'OTP sent for login' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// ===============================
// 3️⃣ Send OTP - Registration
// ===============================
exports.sendOTPForRegister = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

  const user = await User.findByPhoneNumber(phoneNumber);
  if (user) return res.status(400).json({ message: 'User already exists. Please log in.' });

  const otp = generateOTP();
  otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await sendSMS(phoneNumber, otp);
    res.status(200).json({ message: 'OTP sent for registration' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

// ===============================
// 4️⃣ Verify OTP - Login
// ===============================
exports.verifyOTPForLogin = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp)
    return res.status(400).json({ message: 'Phone number and OTP are required' });

  const record = otpStore.get(phoneNumber);
  if (!record || record.otp != otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    const user = await User.findByPhoneNumber(phoneNumber);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    otpStore.delete(phoneNumber);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 5️⃣ Verify OTP - Register
// ===============================
exports.verifyOTPForRegister = async (req, res) => {
  const { phoneNumber, fullName, address, email, otp } = req.body;

  if (!phoneNumber || !otp)
    return res.status(400).json({ message: 'Phone number and OTP are required' });

  if (!fullName || !address || !email)
    return res.status(400).json({ message: 'Full name, address, and email are required' });

  const record = otpStore.get(phoneNumber);
  if (!record || record.otp != otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    let user = await User.findByPhoneNumber(phoneNumber);

    if (user) return res.status(400).json({ message: 'User already exists' });

    // Check for duplicate email
    const emailExists = await User.findByEmail(email);
    if (emailExists) return res.status(400).json({ message: 'Email already in use' });

    user = await User.create({ fullName, address, phoneNumber, email });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    otpStore.delete(phoneNumber);

    res.json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 6️⃣ Get Profile
// ===============================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 7️⃣ Update Profile
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { address, fullName, email } = req.body;
    await User.updateProfile(user.id, { fullName, address, email });

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 8️⃣ Delete Profile
// ===============================
exports.deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const deleted = await User.deleteById(user.id);
    if (deleted) {
      res.json({ message: 'Profile deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found or already deleted' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 9️⃣ Get All Users - ✅ FIXED
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    console.log('📋 Fetching all users from database...');
    
    const users = await User.findAll();
    const userCount = await User.getCount();
    
    console.log(`✅ Found ${users.length} users in database`);
    
    // Return users with additional metadata
    res.status(200).json({
      success: true,
      data: users,
      count: userCount,
      message: `Found ${users.length} users`
    });
    
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users', 
      error: err.message 
    });
  }
};

// ===============================
// 🔟 Get User by ID
// ===============================
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Remove sensitive data
    const { otpCode, otpExpiresAt, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser
    });

  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch user', 
      error: err.message 
    });
  }
};

// ===============================
// 1️⃣1️⃣ Delete User by ID (Admin)
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const deleted = await User.deleteById(id);
    
    if (deleted) {
      res.status(200).json({ 
        success: true, 
        message: 'User deleted successfully' 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to delete user' 
      });
    }

  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: err.message 
    });
  }
};
