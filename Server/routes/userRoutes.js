const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// 👉 Send OTP to user's phone
router.post('/send-otp', userController.sendOTP);

// 👉 Verify OTP and register/login user
router.post('/verify-otp-login', userController.verifyOTP);
// ✅ Protected routes
router.post('/check-exists', userController.checkUserExists);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
