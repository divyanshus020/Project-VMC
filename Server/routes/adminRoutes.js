const express = require('express');
const router = express.Router();

const {
  sendOTPForLogin,
  verifyOTPForLogin,
  sendOTPForRegister,
  verifyOTPForRegister,
  checkUserExists,
} = require('../controllers/userController');

// --- User Authentication Routes ---

router.post('/check-exists', checkUserExists);
router.post('/send-otp-login', sendOTPForLogin);
router.post('/verify-otp-login', verifyOTPForLogin);

// --- User Registration Routes ---

router.post('/send-otp-register', sendOTPForRegister);
router.post('/verify-otp-register', verifyOTPForRegister);

module.exports = router;
