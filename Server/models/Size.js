// models/Size.js
const db = require('../config/db');

// Create Sizes table WITHOUT productId
async function createSizeTable() {
  const connection = await db();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS sizes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dieNo VARCHAR(255) NOT NULL,
      diameter VARCHAR(50) DEFAULT '',
      ballGauge VARCHAR(50) DEFAULT '',
      wireGauge VARCHAR(50) DEFAULT '',
      weight VARCHAR(50) DEFAULT '',
      UNIQUE KEY unique_die (dieNo)
    )
  `);
  await connection.end();
}
createSizeTable();

module.exports = {
  // ✅ Create new size (caller must supply dieNo)
  async create(size) {
    const connection = await db();

    // Basic required-field check
    if (size.dieNo === undefined || size.dieNo === null) {
      throw new Error('dieNo is required');
    }

    const [result] = await connection.execute(
      `INSERT INTO sizes (dieNo, diameter, ballGauge, wireGauge, weight)
       VALUES (?, ?, ?, ?, ?)`,
      [
        size.dieNo,
        size.diameter,
        size.ballGauge,
        size.wireGauge,
        size.weight,
      ]
    );

    await connection.end();
    return {
      id: result.insertId,
      dieNo: size.dieNo,
      diameter: size.diameter,
      ballGauge: size.ballGauge,
      wireGauge: size.wireGauge,
      weight: size.weight,
    };
  },

  // ✅ Get all sizes (sorted lexicographically)
  async findAll() {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes ORDER BY dieNo ASC`);
    await connection.end();
    return rows;
  },

  // ✅ Get single size by id
  async findById(id) {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes WHERE id = ?`, [id]);
    await connection.end();
    return rows[0] || null;
  },

  // ✅ Delete size by id
  async deleteById(id) {
    const connection = await db();
    await connection.execute(`DELETE FROM sizes WHERE id = ?`, [id]);
    await connection.end();
  },

  // ✅ Find size(s) by dieNo (string or number)
  async findByDieNo(dieNo) {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes WHERE dieNo = ?`, [dieNo]);
    await connection.end();
    return rows;
  },
};