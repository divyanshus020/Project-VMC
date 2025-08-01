const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// ==============================
// 📱 OTP & Password AUTH ROUTES (MySQL)
// ==============================

// Check if user exists
router.post('/check-exists', userController.checkUserExists);

// Send OTP routes
router.post('/send-otp-login', userController.sendOTPForLogin);
router.post('/send-otp-register', userController.sendOTPForRegister);

// Verify OTP routes
router.post('/verify-otp-login', userController.verifyOTPForLogin);
router.post('/verify-otp-register', userController.verifyOTPForRegister);

// 🆕 Password-based login route
router.post('/login-password', userController.loginWithPassword);


// ==============================
// 👤 USER PROFILE ROUTES (MySQL)
// ==============================

// 👉 Get user profile (requires token)
router.get('/profile', protect, userController.getProfile);

// 👉 Update user profile (requires token)
router.put('/profile', protect, userController.updateProfile);

// 👉 Delete user profile (requires token)
router.delete('/profile', protect, userController.deleteProfile);

// ==============================
// 👥 USER MANAGEMENT ROUTES
// ==============================

// 👉 Get all users (public route, but you might want to add admin auth)
router.get('/', userController.getAllUsers);

// 👉 Get user by ID
router.get('/:id', userController.getUserById);

// 👉 Delete user by ID (admin only - add admin auth middleware as needed)
router.delete('/:id', userController.deleteUser);

module.exports = router;