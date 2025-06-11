const nodemailer = require('nodemailer');
const config = require('../Config/config');

const transporter = nodemailer.createTransport({
    service: config.EMAIL.SERVICE,
    auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASSWORD
    }
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `E-commerce App <${config.EMAIL.USER}>`,
        to: email,
        subject: 'Your OTP for E-commerce Registration',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4a4a4a;">E-commerce App Verification</h2>
                <p>Your OTP code is:</p>
                <h1 style="background: #f5f5f5; padding: 15px; text-align: center; letter-spacing: 5px;">
                    ${otp}
                </h1>
                <p>This code will expire in ${config.OTP_EXPIRY_MINUTES} minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };