const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// ==============================
// 📱 OTP AUTH ROUTES (MySQL)
// ==============================

// Check if user exists
router.post('/check-exists', userController.checkUserExists);

// Send OTP routes
router.post('/send-otp-login', userController.sendOTPForLogin);       // Changed
router.post('/send-otp-register', userController.sendOTPForRegister); // Changed

// Verify OTP routes
router.post('/verify-otp-login', userController.verifyOTPForLogin);    // Changed
router.post('/verify-otp-register', userController.verifyOTPForRegister); // Changed

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