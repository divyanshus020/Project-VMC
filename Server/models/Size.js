const db = require('../config/db');

// Create Sizes table WITHOUT productId
async function createSizeTable() {
  const connection = await db();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS sizes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      dieNo INT NOT NULL,
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
  async create(size) {
    const connection = await db();

    // Get the highest dieNo
    const [maxDie] = await connection.execute(
      `SELECT MAX(dieNo) AS maxDie FROM sizes`
    );
    const newDieNo = (maxDie[0].maxDie || 0) + 1;

    const [result] = await connection.execute(
      `INSERT INTO sizes (dieNo, diameter, ballGauge, wireGauge, weight)
       VALUES (?, ?, ?, ?, ?)`,
      [
        newDieNo,
        size.diameter,
        size.ballGauge,
        size.wireGauge,
        size.weight,
      ]
    );

    await connection.end();
    return {
      id: result.insertId,
      dieNo: newDieNo,
      ...size,
    };
  },

  async findAll() {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes ORDER BY dieNo ASC`);
    await connection.end();
    return rows;
  },

  async findById(id) {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes WHERE id = ?`, [id]);
    await connection.end();
    return rows[0] || null;
  },

  async deleteById(id) {
    const connection = await db();
    await connection.execute(`DELETE FROM sizes WHERE id = ?`, [id]);
    await connection.end();
  },

  async findByDieNo(dieNo) {
    const connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes WHERE dieNo = ?`, [dieNo]);
    await connection.end();
    return rows;
  }
};
