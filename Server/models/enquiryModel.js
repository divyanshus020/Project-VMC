const db = require('../config/db');

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create Enquiry table if not exists
async function createEnquiryTable() {
  const connection = await getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS enquiries (
      enquiryID INT AUTO_INCREMENT PRIMARY KEY,
      productID INT NOT NULL,
      userID INT NOT NULL,
      quantity INT NOT NULL,
      sizeID INT NOT NULL,
      tunch VARCHAR(255),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await connection.end();
}
createEnquiryTable();

module.exports = {
  // Create a new enquiry
  async create({ productID, userID, quantity, sizeID, tunch }) {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO enquiries (productID, userID, quantity, sizeID, tunch) VALUES (?, ?, ?, ?, ?)`,
      [productID, userID, quantity, sizeID, tunch]
    );
    await connection.end();
    return { enquiryID: result.insertId, productID, userID, quantity, sizeID, tunch };
  },

  // Get all enquiries
  async findAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM enquiries ORDER BY createdAt DESC`);
    await connection.end();
    return rows;
  },

  // Get enquiry by ID
  async findById(enquiryID) {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM enquiries WHERE enquiryID = ?`, [enquiryID]);
    await connection.end();
    return rows[0] || null;
  },

  // Update enquiry
  async update(enquiryID, { productID, userID, quantity, sizeID, tunch }) {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE enquiries SET productID = ?, userID = ?, quantity = ?, sizeID = ?, tunch = ? WHERE enquiryID = ?`,
      [productID, userID, quantity, sizeID, tunch, enquiryID]
    );
    await connection.end();
    return { enquiryID, productID, userID, quantity, sizeID, tunch };
  },

  // Delete enquiry
  async delete(enquiryID) {
    const connection = await getConnection();
    await connection.execute(`DELETE FROM enquiries WHERE enquiryID = ?`, [enquiryID]);
    await connection.end();
    return { message: "Enquiry deleted" };
  },

  // Get all enquiries by user ID
  async findByUser(userID) {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM enquiries WHERE userID = ?`, [userID]);
    await connection.end();
    return rows;
  }
};
