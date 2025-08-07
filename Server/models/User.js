const db = require('../config/db');
const bcrypt = require('bcryptjs'); // Added for password hashing

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create User table if not exists
async function createUserTable() {
  const connection = await getConnection();
  await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        address VARCHAR(255),
        phoneNumber VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NULL, -- Added password field
        otpCode VARCHAR(10),
        otpExpiresAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
  `);
  await connection.end();
}

// Call this function once at server start to ensure table exists
createUserTable();

module.exports = {
  // Create a new user (Updated to handle password)
  async create(user) {
    const connection = await getConnection();
    
    let hashedPassword = null;
    // Only hash password if it's provided
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(user.password, salt);
    }

    const [result] = await connection.execute(
      `INSERT INTO users (fullName, email, address, phoneNumber, password, otpCode, otpExpiresAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        user.fullName || null,
        user.email || null, // Handles optional email
        user.address || null,
        user.phoneNumber,
        hashedPassword, // Handles optional password
        user.otpCode || null,
        user.otpExpiresAt || null
      ]
    );
    await connection.end();
    const newUser = { ...user };
    delete newUser.password; // Do not return password
    return { id: result.insertId, ...newUser };
  },

  // Find user by phone number
  async findByPhoneNumber(phoneNumber) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE phoneNumber = ? LIMIT 1`,
      [phoneNumber]
    );
    await connection.end();
    return rows[0] || null;
  },

  // Find user by email
  async findByEmail(email) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
    await connection.end();
    return rows[0] || null;
  },

  // Update user OTP
  async updateOtp(phoneNumber, otpCode, otpExpiresAt) {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE users SET otpCode = ?, otpExpiresAt = ?, updatedAt = CURRENT_TIMESTAMP WHERE phoneNumber = ?`,
      [otpCode, otpExpiresAt, phoneNumber]
    );
    await connection.end();
  },

  // Verify OTP
  async verifyOtp(phoneNumber, otpCode) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE phoneNumber = ? AND otpCode = ? AND otpExpiresAt > NOW() LIMIT 1`,
      [phoneNumber, otpCode]
    );
    await connection.end();
    return rows[0] || null;
  },

  // Update user profile
  async updateProfile(id, data) {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE users SET email = ?, address = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      [data.email, data.address, id]
    );
    await connection.end();
  },

  // Get user by ID
  async findById(id) {
    console.log("mmmmmmmmmmm",id)
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    await connection.end();
    console.log(rows)
    return rows[0] || null;
  },

  // ✅ NEW: Get all users
  async findAll() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, fullName, email, address, phoneNumber, createdAt, updatedAt 
         FROM users 
         ORDER BY createdAt DESC`
      );
      return rows;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // ✅ NEW: Get users count
  async getCount() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT COUNT(*) as count FROM users`
      );
      return rows[0].count;
    } catch (error) {
      console.error('Error getting users count:', error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // ✅ NEW: Delete user by ID
  async deleteById(id) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `DELETE FROM users WHERE id = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
};
