const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/authController');

// These controller functions should use MySQL logic in your authController.js
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
