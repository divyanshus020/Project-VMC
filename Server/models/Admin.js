const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create Admin table if not exists
async function createAdminTable() {
  const connection = await getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) DEFAULT '',
      role ENUM('admin', 'superadmin') DEFAULT 'admin',
      isActive BOOLEAN DEFAULT TRUE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await connection.end();
}
createAdminTable();

module.exports = {
  // Create a new admin (hashes password)
  async create({ email, password, name = '', role = 'admin', isActive = true }) {
    const connection = await getConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      `INSERT INTO admins (email, password, name, role, isActive) VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, name, role, isActive]
    );
    await connection.end();
    return { id: result.insertId, email, name, role, isActive };
  },

  // Find admin by email
  async findByEmail(email) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM admins WHERE email = ? LIMIT 1`,
      [email]
    );
    await connection.end();
    return rows[0] || null;
  },

  // Compare password
  async comparePassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  },

  // Remove password from admin object
  sanitize(admin) {
    if (!admin) return null;
    const { password, ...rest } = admin;
    return rest;
  }
};
