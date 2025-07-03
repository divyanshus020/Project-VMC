const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// ==============================
// 📱 OTP AUTH ROUTES (MySQL)
// ==============================

// 👉 Send OTP for login
router.post('/send-otp-login', userController.sendOTPForLogin);

// 👉 Send OTP for registration
router.post('/send-otp-register', userController.sendOTPForRegister);

// 👉 Verify OTP for login
router.post('/verify-otp-login', userController.verifyOTPForLogin);

// 👉 Verify OTP for registration
router.post('/verify-otp-register', userController.verifyOTPForRegister);

// 👉 Check if user exists
router.post('/check-exists', userController.checkUserExists);

// ==============================
// 👤 USER PROFILE ROUTES (MySQL)
// ==============================

// 👉 Get user profile (requires token)
router.get('/profile', protect, userController.getProfile);

// 👉 Update user profile (requires token)
router.put('/profile', protect, userController.updateProfile);

// 👉 Delete user profile (requires token)
router.delete('/profile', protect, userController.deleteProfile);

// 👉 Get all users (admin only, add auth middleware as needed)
router.get('/', userController.getAllUsers);

module.exports = router;