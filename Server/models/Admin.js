const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create Admin table if not exists
async function createAdminTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT '',
        role ENUM('admin', 'superadmin') DEFAULT 'admin',
        isActive BOOLEAN DEFAULT TRUE,
        resetToken VARCHAR(255) DEFAULT NULL,
        resetTokenExpiry DATETIME DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admin table created/verified successfully');
  } catch (error) {
    console.error('❌ Error creating admin table:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Initialize table
createAdminTable();

module.exports = {
  // Create a new admin (hashes password)
  async create({ email, password, name = '', role = 'admin', isActive = true }) {
    const connection = await getConnection();
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        `INSERT INTO admins (email, password, name, role, isActive) VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, name, role, isActive]
      );
      
      console.log(`✅ Admin created with ID: ${result.insertId}, Role: ${role}`);
      return { id: result.insertId, email, name, role, isActive };
    } catch (error) {
      console.error('❌ Error creating admin:', error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Find all admins
  async findAll() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT id, email, name, role, isActive, createdAt FROM admins ORDER BY createdAt DESC`
      );
      return rows;
    } catch (error) {
      console.error('❌ Error finding all admins:', error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Find admin by ID
  async findById(id) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM admins WHERE id = ? LIMIT 1`,
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`❌ Error finding admin by ID ${id}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Find admin by email
  async findByEmail(email) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM admins WHERE email = ? LIMIT 1`,
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`❌ Error finding admin by email ${email}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Find admin by reset token
  async findByResetToken(token) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM admins WHERE resetToken = ? AND resetTokenExpiry > NOW() LIMIT 1`,
        [token]
      );
      return rows[0] || null;
    } catch (error) {
      console.error(`❌ Error finding admin by reset token:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Save reset token for password reset
  async saveResetToken(adminId, token, expiry) {
    const connection = await getConnection();
    try {
      await connection.execute(
        `UPDATE admins SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?`,
        [token, expiry, adminId]
      );
      console.log(`✅ Reset token saved for admin ID: ${adminId}`);
    } catch (error) {
      console.error(`❌ Error saving reset token for admin ID ${adminId}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Update password and clear reset token
  async updatePasswordAndClearToken(adminId, newPassword) {
    const connection = await getConnection();
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await connection.execute(
        `UPDATE admins SET password = ?, resetToken = NULL, resetTokenExpiry = NULL, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        [hashedPassword, adminId]
      );
      console.log(`✅ Password updated and reset token cleared for admin ID: ${adminId}`);
    } catch (error) {
      console.error(`❌ Error updating password for admin ID ${adminId}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },
  
  // Finds all active admins and returns their email addresses for notifications.
  async findAllAdminEmails() {
    const connection = await getConnection();
    try {
      // Selects emails only from admins who are currently active.
      const [rows] = await connection.execute(
        `SELECT email FROM admins WHERE isActive = TRUE`
      );
      // Returns a simple array of email strings, e.g., ['admin1@test.com', 'admin2@test.com']
      return rows.map(admin => admin.email);
    } catch (error) {
        console.error("❌ Error fetching admin emails:", error);
        return []; // Return an empty array on error to prevent crashes
    } finally {
      await connection.end();
    }
  },

  // Update admin by ID
  async updateById(id, updateData) {
    const connection = await getConnection();
    
    try {
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
        // Validate role against ENUM values
        if (!['admin', 'superadmin'].includes(updateData.role)) {
          throw new Error('Invalid role. Must be "admin" or "superadmin"');
        }
        fields.push('role = ?');
        values.push(updateData.role);
      }
      
      if (updateData.isActive !== undefined) {
        fields.push('isActive = ?');
        values.push(updateData.isActive);
      }
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(id);
      
      const query = `UPDATE admins SET ${fields.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
      console.log(`🔄 Updating admin ID ${id} with query:`, query);
      console.log(`🔄 Values:`, values.slice(0, -1)); // Don't log the ID at the end
      
      await connection.execute(query, values);
      
      const [rows] = await connection.execute(
        `SELECT * FROM admins WHERE id = ? LIMIT 1`,
        [id]
      );
      
      const updatedAdmin = rows[0] || null;
      if (updatedAdmin) {
        console.log(`✅ Admin updated successfully. New role: ${updatedAdmin.role}, Active: ${updatedAdmin.isActive}`);
      }
      
      return updatedAdmin;
    } catch (error) {
      console.error(`❌ Error updating admin ID ${id}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Delete admin by ID
  async deleteById(id) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `DELETE FROM admins WHERE id = ?`,
        [id]
      );
      const deleted = result.affectedRows > 0;
      if (deleted) {
        console.log(`✅ Admin ID ${id} deleted successfully`);
      }
      return deleted;
    } catch (error) {
      console.error(`❌ Error deleting admin ID ${id}:`, error);
      throw error;
    } finally {
      await connection.end();
    }
  },

  // Compare password
  async comparePassword(enteredPassword, hashedPassword) {
    try {
      return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
      console.error('❌ Error comparing password:', error);
      throw error;
    }
  },

  // Remove password from admin object
  sanitize(admin) {
    if (!admin) return null;
    const { password, resetToken, resetTokenExpiry, ...rest } = admin;
    return rest;
  },

  // Get admin statistics
  async getStats() {
    const connection = await getConnection();
    try {
      const [stats] = await connection.execute(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN role = 'superadmin' THEN 1 ELSE 0 END) as superadmins,
          SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins
        FROM admins
      `);
      return stats[0];
    } catch (error) {
      console.error('❌ Error getting admin statistics:', error);
      throw error;
    } finally {
      await connection.end();
    }
  }
};