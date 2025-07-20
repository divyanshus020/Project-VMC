const db = require('../config/db');

// Helper to get a MySQL connection from the pool
async function getConnection() {
  return db(); // Assumes db() returns a promise that resolves to a connection
}

// Create Enquiry table if not exists, now with a 'status' column
async function createEnquiryTable() {
  const connection = await getConnection();
  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        enquiryID INT AUTO_INCREMENT PRIMARY KEY,
        productID INT,
        userID INT,
        quantity INT NOT NULL,
        sizeID INT,
        tunch VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productID) REFERENCES products(id) ON DELETE SET NULL,
        FOREIGN KEY (userID) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (sizeID) REFERENCES sizes(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ 'enquiries' table checked/created successfully.");
  } catch (error) {
    console.error("❌ Error creating 'enquiries' table:", error);
  } finally {
    await connection.end();
  }
}
// Run this once on application startup
createEnquiryTable();

module.exports = {
  // Create a new enquiry
  async create({ productID, userID, quantity, sizeID, tunch }) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO enquiries (productID, userID, quantity, sizeID, tunch) VALUES (?, ?, ?, ?, ?)`,
        [productID, userID, quantity, sizeID, tunch]
      );
      return { enquiryID: result.insertId, productID, userID, quantity, sizeID, tunch };
    } finally {
      await connection.end();
    }
  },

  // Get all enquiries with full details (for Admin)
  async findAllWithDetails() {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(`
        SELECT 
          e.*, 
          p.name as productName, p.category, 
          s.dieNo, s.diameter, s.ballGauge, s.wireGauge, s.weight,
          u.fullName, u.email, u.phoneNumber
        FROM enquiries e
        LEFT JOIN products p ON e.productID = p.id
        LEFT JOIN sizes s ON e.sizeID = s.id
        LEFT JOIN users u ON e.userID = u.id
        ORDER BY e.createdAt DESC
      `);
      return rows;
    } finally {
      await connection.end();
    }
  },

  // Get a single enquiry with full details by its ID
  async findWithDetailsById(enquiryID) {
    const connection = await getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT 
              e.*, 
              p.name as productName, p.category, 
              s.dieNo, s.diameter, s.ballGauge, s.wireGauge, s.weight,
              u.fullName, u.email, u.phoneNumber
            FROM enquiries e
            LEFT JOIN products p ON e.productID = p.id
            LEFT JOIN sizes s ON e.sizeID = s.id
            LEFT JOIN users u ON e.userID = u.id
            WHERE e.enquiryID = ?
        `, [enquiryID]);
        return rows[0] || null;
    } finally {
        await connection.end();
    }
  },

  // Dynamic and robust update function
  async update(enquiryID, updateData) {
    const connection = await getConnection();
    try {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            throw new Error("No fields to update.");
        }

        const setClause = fields.map(field => `\`${field}\` = ?`).join(', ');
        
        const sql = `UPDATE enquiries SET ${setClause} WHERE enquiryID = ?`;
        
        const [result] = await connection.execute(sql, [...values, enquiryID]);
        return result;
    } finally {
        await connection.end();
    }
  },

  // Delete enquiry
  async delete(enquiryID) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(`DELETE FROM enquiries WHERE enquiryID = ?`, [enquiryID]);
      return result;
    } finally {
      await connection.end();
    }
  },

  // Get all enquiries for a specific user with product and size details
  async findDetailedByUser(userID) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT 
            e.*, 
            p.name as productName, p.category, 
            s.dieNo, s.diameter, s.ballGauge, s.wireGauge, s.weight
         FROM enquiries e
         LEFT JOIN products p ON e.productID = p.id
         LEFT JOIN sizes s ON e.sizeID = s.id
         WHERE e.userID = ?
         ORDER BY e.createdAt DESC`,
        [userID]
      );
      return rows;
    } finally {
      await connection.end();
    }
  }
};
