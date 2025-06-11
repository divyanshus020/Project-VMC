const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAndSendOTP, verifyOTP } = require('../services/otpService');
const config = require('../Config/config');
const { 
    validateRegistration, 
    validateLogin, 
    validateOTP,
    validateRequest 
} = require('../utils/validators');

exports.register = [
    ...validateRegistration,
    validateRequest,
    async (req, res) => {
        try {
            const { name, email, password, phone } = req.body;
            
            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create user (not verified yet)
            await User.create({ name, email, password: hashedPassword, phone });
            
            // Generate and send OTP
            await generateAndSendOTP(email);
            
            res.status(201).json({ 
                message: 'OTP sent to your email. Please verify to complete registration.',
                email
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

exports.verifyOTP = [
    ...validateOTP,
    validateRequest,
    async (req, res) => {
        try {
            const { email, otp } = req.body;
            
            // Verify OTP
            await verifyOTP(email, otp);
            
            // Mark user as verified
            await User.updateVerification(email);
            
            res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

exports.login = [
    ...validateLogin,
    validateRequest,
    async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Check if user is verified
            if (!user.is_verified) {
                return res.status(401).json({ message: 'Please verify your email first' });
            }
            
            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                config.JWT.SECRET,
                { expiresIn: config.JWT.EXPIRES_IN }
            );
            
            // Get user details without password
            const userDetails = await User.findById(user.id);
            
            res.status(200).json({ 
                token, 
                user: userDetails 
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

exports.resendOTP = [
    body('email').isEmail().withMessage('Valid email is required'),
    validateRequest,
    async (req, res) => {
        try {
            const { email } = req.body;
            
            // Check if user exists
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (user.is_verified) {
                return res.status(400).json({ message: 'Email is already verified' });
            }
            
            // Generate and send new OTP
            await generateAndSendOTP(email);
            
            res.status(200).json({ 
                message: 'New OTP sent to your email',
                email
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];