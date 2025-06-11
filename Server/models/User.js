const db = require('../Config/db');

class User {
    static async create({ name, email, password, phone }) {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
            [name, email, password, phone]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, phone, is_verified FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async updateVerification(email) {
        await db.query('UPDATE users SET is_verified = TRUE WHERE email = ?', [email]);
    }

    static async updatePassword(email, newPassword) {
        await db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
    }
}

module.exports = User;