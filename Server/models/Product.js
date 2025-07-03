const db = require('../config/db');

// ENUMS (for dropdowns and validation)
const CAP_SIZE_ENUM = [
  "43 No CAP MALA", "42 No CAP MALA", "22 No CAP MALA", "21 No CAP MALA", "19 No CAP MALA", "17 No CAP MALA",
  "15 No CAP MALA", "12 No CAP MALA", "11 No CAP MALA", "10 No CAP MALA", "8 No CAP MALA", "5 No CAP MALA"
];
const WEIGHT_ENUM = [
  "8 - 9 gm", "9 - 10 gm", "10 - 11 gm", "12 - 13 gm", "14 - 15 gm", "16 - 17 gm", "18 - 19 gm", "20 gm",
  "21 - 22 gm", "24 - 25 gm", "28 - 29 gm", "31 - 32 gm"
];
const TULSI_RUDRAKSH_MM_ENUM = [
  "3 mm", "3 mm", "3.5 mm", "3.5 mm", "4 mm", "4.5 mm", "5 mm", "5 mm", "5.5 mm", "6 mm", "7 mm", "7.5 mm"
];
const TULSI_RUDRAKSH_ESTPCS_ENUM = [
  "80 - 85 Pcs", "75 - 80 Pcs", "75 - 80 Pcs", "75 - 80 Pcs", "65 - 70 Pcs", "65 - 70 Pcs",
  "57 - 62 Pcs", "54 - 60 Pcs", "54 - 58 Pcs", "50 - 52 Pcs", "45 - 48 Pcs", "40 - 45 Pcs"
];
const DIAMETER_ENUM = [
  "11 MM", "9 MM", "8.25 MM", "7.5 MM", "7 MM", "6.4 MM", "6 MM", "5.6 MM", "5.2 MM", "4.7 MM",
  "4.4 MM", "4 MM", "3.6 MM", "3.25 MM", "3 MM", "2.8 MM", "2.5 MM"
];
const BALL_GAUGE_ENUM = [
  "-", "-", "-", "-", "38", "34", "33", "31", "30", "25", "22", "20", "17", "15", "13", "12", "10"
];
const WIRE_GAUGE_ENUM = [
  "-", "-", "0", "-", "1.5", "3", "3.5", "4", "5", "6", "7", "8", "9", "10", "-", "11", "12"
];
const OTHER_WEIGHT_ENUM = [
  "1.2", "1", "0.85", "0.65", "0.5", "0.4", "0.35", "0.3", "0.25", "0.2", "0.175", "0.15", "0.125", "0.1", "0.09", "0.075", "0.055"
];

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create Product table if not exists (run once at server start)
async function createProductTable() {
  const connection = await getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(500) DEFAULT '',
      category VARCHAR(50) NOT NULL,
      images JSON DEFAULT NULL,

      -- Mala fields
      capSize VARCHAR(50) DEFAULT '',
      weight VARCHAR(50) DEFAULT '',
      tulsiRudrakshMM VARCHAR(50) DEFAULT '',
      estPCS VARCHAR(50) DEFAULT '',

      -- Non-mala fields
      diameter VARCHAR(50) DEFAULT '',
      ballGauge VARCHAR(50) DEFAULT '',
      wireGauge VARCHAR(50) DEFAULT '',
      otherWeight VARCHAR(50) DEFAULT '',

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await connection.end();
}
createProductTable();

// Product Model Methods
module.exports = {
  // Create a new product
  async create(product) {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `INSERT INTO products
        (name, imageUrl, category, images, capSize, weight, tulsiRudrakshMM, estPCS, diameter, ballGauge, wireGauge, otherWeight)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

      [
        product.name,
        product.imageUrl || '',
        product.category,
        JSON.stringify(product.images || []),
        product.capSize || '',
        product.weight || '',
        product.tulsiRudrakshMM || '',
        product.estPCS || '',
        product.diameter || '',
        product.ballGauge || '',
        product.wireGauge || '',
        product.otherWeight || ''
      ]
    );
    await connection.end();
    return { id: result.insertId, ...product };
  },

  // Get all products
  async findAll() {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM products`);
    await connection.end();
    // Parse images JSON
    return rows.map(row => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : []
    }));
  },

  // Get product by ID
  async findById(id) {
    const connection = await getConnection();
    const [rows] = await connection.execute(`SELECT * FROM products WHERE id = ? LIMIT 1`, [id]);
    await connection.end();
    if (!rows[0]) return null;
    return {
      ...rows[0],
      images: rows[0].images ? JSON.parse(rows[0].images) : []
    };
  },

  // Update product by ID
  async updateById(id, data) {
    const connection = await getConnection();
    await connection.execute(
      `UPDATE products SET
        name = ?, imageUrl = ?, category = ?, images = ?, capSize = ?, weight = ?, tulsiRudrakshMM = ?, estPCS = ?,
        diameter = ?, ballGauge = ?, wireGauge = ?, otherWeight = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        data.name,
        data.imageUrl || '',
        data.category,
        JSON.stringify(data.images || []),
        data.capSize || '',
        data.weight || '',
        data.tulsiRudrakshMM || '',
        data.estPCS || '',
        data.diameter || '',
        data.ballGauge || '',
        data.wireGauge || '',
        data.otherWeight || '',
        id
      ]
    );
    await connection.end();
  },

  // Delete product by ID
  async deleteById(id) {
    const connection = await getConnection();
    await connection.execute(`DELETE FROM products WHERE id = ?`, [id]);
    await connection.end();
  },

  // Get all enums for dropdowns
  getEnums() {
    return {
      capSizes: CAP_SIZE_ENUM,
      malaWeights: WEIGHT_ENUM,
      tulsiRudrakshMM: TULSI_RUDRAKSH_MM_ENUM,
      tulsiRudrakshEstPcs: TULSI_RUDRAKSH_ESTPCS_ENUM,
      diameters: DIAMETER_ENUM,
      ballGauges: BALL_GAUGE_ENUM,
      wireGauges: WIRE_GAUGE_ENUM,
      otherWeights: OTHER_WEIGHT_ENUM
    };
  }
};
