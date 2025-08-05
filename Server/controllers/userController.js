const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// In-memory OTP store (Consider Redis/DB in production)
const otpStore = new Map();
const OTP_COOLDOWN_SECONDS = 60; // Cooldown period for resending OTP

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
// 2️⃣ Send OTP - Login (Updated with Cooldown)
// ===============================
exports.sendOTPForLogin = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

    const existingOtp = otpStore.get(phoneNumber);
    if (existingOtp && Date.now() < existingOtp.createdAt + OTP_COOLDOWN_SECONDS * 1000) {
        const timeLeft = Math.ceil((existingOtp.createdAt + OTP_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000);
        return res.status(429).json({ message: `Please wait ${timeLeft} seconds before requesting a new OTP.` });
    }

    const user = await User.findByPhoneNumber(phoneNumber);
    if (!user) return res.status(404).json({ message: 'User not found. Please register first.' });

    const otp = generateOTP();
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000, createdAt: Date.now() });

    try {
        await sendSMS(phoneNumber, otp);
        res.status(200).json({ message: 'OTP sent for login' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to send OTP', error: err.message });
    }
};

// ===============================
// 3️⃣ Send OTP - Registration (Updated with Cooldown)
// ===============================
exports.sendOTPForRegister = async (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required' });

    const existingOtp = otpStore.get(phoneNumber);
    if (existingOtp && Date.now() < existingOtp.createdAt + OTP_COOLDOWN_SECONDS * 1000) {
        const timeLeft = Math.ceil((existingOtp.createdAt + OTP_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000);
        return res.status(429).json({ message: `Please wait ${timeLeft} seconds before requesting a new OTP.` });
    }
    
    const user = await User.findByPhoneNumber(phoneNumber);
    if (user) return res.status(400).json({ message: 'User already exists. Please log in.' });

    const otp = generateOTP();
    otpStore.set(phoneNumber, { otp, expiresAt: Date.now() + 5 * 60 * 1000, createdAt: Date.now() });

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
    
    const { password, ...userProfile } = user; // Exclude password from response

    res.json({
      message: 'Login successful',
      token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// 5️⃣ Verify OTP - Register (Updated for optional fields)
// ===============================
exports.verifyOTPForRegister = async (req, res) => {
  const { phoneNumber, fullName, address, email, otp, password } = req.body;

  if (!phoneNumber || !otp)
    return res.status(400).json({ message: 'Phone number and OTP are required' });

  if (!fullName || !address)
    return res.status(400).json({ message: 'Full name and address are required' });

  const record = otpStore.get(phoneNumber);
  if (!record || record.otp != otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  try {
    let user = await User.findByPhoneNumber(phoneNumber);
    if (user) return res.status(400).json({ message: 'User already exists' });

    if (email) {
        const emailExists = await User.findByEmail(email);
        if (emailExists) return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = {
        fullName,
        address,
        phoneNumber,
        email: email || null,
        password: password || null,
    };

    user = await User.create(newUser);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    otpStore.delete(phoneNumber);
    
    const { password: pw, ...userProfile } = user;

    res.json({
      message: 'Registration successful',
      token,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// 🆕 Login with Password (Updated to use Phone Number)
// ===============================
exports.loginWithPassword = async (req, res) => {
    const { phoneNumber, password } = req.body;
    if (!phoneNumber || !password) {
        return res.status(400).json({ message: 'Phone number and password are required' });
    }

    try {
        const user = await User.findByPhoneNumber(phoneNumber);
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid credentials or user does not have a password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const { password: pw, ...userProfile } = user;

        res.json({
            message: 'Login successful',
            token,
            user: userProfile,
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
    const { password, ...userProfile } = user;
    res.json(userProfile);
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

    const { password, ...userProfile } = await User.findById(req.user.userId);

    res.json({user: userProfile, message: 'Profile updated successfully' });
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
// 9️⃣ Get All Users
// ===============================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    const userCount = await User.getCount();
    
    res.status(200).json({
      success: true,
      data: users,
      count: userCount,
      message: `Found ${users.length} users`
    });
    
  } catch (err) {
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

    const { otpCode, otpExpiresAt, password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser
    });

  } catch (err) {
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
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete user', 
      error: err.message 
    });
  }
};
