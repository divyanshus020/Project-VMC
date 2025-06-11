const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration with OTP
router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);

// Login
router.post('/login', authController.login);

module.exports = router;