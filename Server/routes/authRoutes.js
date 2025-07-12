const express = require('express');
const router = express.Router();

// Import controller functions
const userController = require('../controllers/userController');

// Validate handlers before attaching routes
function validateHandler(name) {
    const handler = userController[name];
    if (typeof handler !== 'function') {
        console.error(`Handler "${name}" is not a function or is missing from userController.`);
        // Optional: throw error or skip the route
        return (req, res) => res.status(500).json({ error: `Handler "${name}" is not available.` });
    }
    return handler;
}

// --- User Authentication Routes ---

router.post('/check-exists', validateHandler('checkUserExists'));
router.post('/send-otp-login', validateHandler('sendOTPForLogin'));      // Updated handler name
router.post('/verify-otp-login', validateHandler('verifyOTPForLogin'));  // Updated handler name

// --- User Registration Routes ---

router.post('/send-otp-register', validateHandler('sendOTPForRegister'));    // Updated handler name
router.post('/verify-otp-register', validateHandler('verifyOTPForRegister')); // Updated handler name

module.exports = router;
