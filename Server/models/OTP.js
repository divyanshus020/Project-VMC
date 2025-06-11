const db = require('../Config/db');

class OTP {
    static async create({ email, otp, expires_at }) {
        await db.query(
            'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
            [email, otp, expires_at]
        );
    }

    static async findValidOTP(email, otp) {
        const [rows] = await db.query(
            'SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW()',
            [email, otp]
        );
        return rows[0];
    }

    static async deleteOTP(email) {
        await db.query('DELETE FROM otps WHERE email = ?', [email]);
    }
}

module.exports = OTP;