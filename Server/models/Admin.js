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

// Initialize table
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

  // Find all admins
  async findAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM admins ORDER BY createdAt DESC`
    );
    await connection.end();
    return rows;
  },

  // Find admin by ID
  async findById(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM admins WHERE id = ? LIMIT 1`,
      [id]
    );
    await connection.end();
    return rows[0] || null;
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

  // Update admin by ID
  async updateById(id, updateData) {
    const connection = await getConnection();
    
    // Build dynamic update query
    const fields = [];
    const values = [];
    
    if (updateData.email !== undefined) {
      fields.push('email = ?');
      values.push(updateData.email);
    }
    
    if (updateData.password !== undefined) {
      fields.push('password = ?');
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      values.push(hashedPassword);
    }
    
    if (updateData.name !== undefined) {
      fields.push('name = ?');
      values.push(updateData.name);
    }
    
    if (updateData.role !== undefined) {
      fields.push('role = ?');
      values.push(updateData.role);
    }
    
    if (updateData.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updateData.isActive);
    }
    
    if (fields.length === 0) {
      await connection.end();
      throw new Error('No fields to update');
    }
    
    values.push(id);
    
    await connection.execute(
      `UPDATE admins SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    // Return updated admin
    const [rows] = await connection.execute(
      `SELECT * FROM admins WHERE id = ? LIMIT 1`,
      [id]
    );
    
    await connection.end();
    return rows[0] || null;
  },

  // Delete admin by ID
  async deleteById(id) {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `DELETE FROM admins WHERE id = ?`,
      [id]
    );
    await connection.end();
    return result.affectedRows > 0;
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
