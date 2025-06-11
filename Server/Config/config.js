require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    DB: {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME
    },
    JWT: {
        SECRET: process.env.JWT_SECRET,
        EXPIRES_IN: process.env.JWT_EXPIRES_IN
    },
    EMAIL: {
        SERVICE: process.env.EMAIL_SERVICE,
        USER: process.env.EMAIL_USER,
        PASSWORD: process.env.EMAIL_PASSWORD
    },
    OTP_EXPIRY_MINUTES: parseInt(process.env.OTP_EXPIRY_MINUTES) || 10,
    NODE_ENV: process.env.NODE_ENV || 'development'
};