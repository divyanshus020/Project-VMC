const OTP = require('../models/OTP');
const { sendOTPEmail } = require('./emailService');
const generateOTP = require('../utils/generateOTP');
const config = require('../Config/config');

const generateAndSendOTP = async (email) => {
    // Delete any existing OTPs for this email
    await OTP.deleteOTP(email);
    
    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + config.OTP_EXPIRY_MINUTES);
    
    // Save OTP to database
    await OTP.create({ email, otp, expires_at: expiresAt });
    
    // Send OTP via email
    await sendOTPEmail(email, otp);
    
    return otp;
};

const verifyOTP = async (email, otp) => {
    const validOTP = await OTP.findValidOTP(email, otp);
    if (!validOTP) {
        throw new Error('Invalid or expired OTP');
    }
    
    // Delete the OTP after successful verification
    await OTP.deleteOTP(email);
    
    return true;
};

module.exports = { generateAndSendOTP, verifyOTP };