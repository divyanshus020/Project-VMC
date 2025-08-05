const db = require('../config/db');

// Helper to get a MySQL connection from the pool
async function getConnection() {
  // Your database connection logic might be different.
  // This assumes db() returns a promise that resolves to a connection.
  return db(); 
}

// **FIXED**: This function now includes the 'cartId' column in the table schema.
// It will automatically add the column to your existing table when the server starts.
async function createEnquiryTable() {
  const connection = await getConnection();
  try {
    // First, check if the cartId column exists
    const [columns] = await connection.execute(
      `SHOW COLUMNS FROM enquiries LIKE 'cartId'`
    );

    // If the column does not exist, add it
    if (columns.length === 0) {
        await connection.execute(
            `ALTER TABLE enquiries ADD COLUMN cartId VARCHAR(255) NULL DEFAULT NULL AFTER status`
        );
        console.log("✅ 'cartId' column added to 'enquiries' table.");
    }

    // The rest of the table creation logic remains for initial setup
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        enquiryID INT AUTO_INCREMENT PRIMARY KEY,
        productID INT,
        userID INT,
        quantity INT NOT NULL,
        sizeID INT,
        tunch VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        cartId VARCHAR(255) NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (productID) REFERENCES products(id) ON DELETE SET NULL,
        FOREIGN KEY (userID) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (sizeID) REFERENCES sizes(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ 'enquiries' table checked/created successfully.");
  } catch (error) {
    console.error("❌ Error updating 'enquiries' table:", error);
  } finally {
    if (connection && connection.end) {
        await connection.end();
    }
  }
}
// Run this once on application startup
createEnquiryTable();

module.exports = {
  // Create a new enquiry, now including cartId
  async create({ productID, userID, quantity, sizeID, tunch, cartId = null }) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(
        `INSERT INTO enquiries (productID, userID, quantity, sizeID, tunch, cartId) VALUES (?, ?, ?, ?, ?, ?)`,
        [productID, userID, quantity, sizeID, tunch, cartId]
      );
      return { enquiryID: result.insertId, productID, userID, quantity, sizeID, tunch, cartId };
    } finally {
      if (connection && connection.end) {
        await connection.end();
      }
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
      if (connection && connection.end) {
        await connection.end();
      }
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
        if (connection && connection.end) {
            await connection.end();
        }
    }
  },

  // Finds multiple enquiries by their IDs and joins with related tables for full details.
  async findMultipleByIds(ids) {
    if (!ids || ids.length === 0) {
      return [];
    }
    const connection = await getConnection();
    try {
      const query = `
        SELECT
          e.enquiryID, e.productID, e.userID, e.quantity, e.sizeID, e.tunch, e.status, e.createdAt, e.updatedAt, e.cartId,
          p.name as productName, p.category,
          s.dieNo, s.diameter, s.ballGauge, s.wireGauge, s.weight,
          u.fullName, u.email, u.phoneNumber
        FROM enquiries e
        LEFT JOIN products p ON e.productID = p.id
        LEFT JOIN sizes s ON e.sizeID = s.id
        LEFT JOIN users u ON e.userID = u.id
        WHERE e.enquiryID IN (?)
        ORDER BY e.createdAt DESC;
      `;
      const [rows] = await connection.query(query, [ids]);
      return rows;
    } finally {
      if (connection && connection.end) {
        await connection.end();
      }
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
        if (connection && connection.end) {
            await connection.end();
        }
    }
  },

  // Delete enquiry
  async delete(enquiryID) {
    const connection = await getConnection();
    try {
      const [result] = await connection.execute(`DELETE FROM enquiries WHERE enquiryID = ?`, [enquiryID]);
      return result;
    } finally {
      if (connection && connection.end) {
        await connection.end();
      }
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
      if (connection && connection.end) {
        await connection.end();
      }
    }
  }
};
