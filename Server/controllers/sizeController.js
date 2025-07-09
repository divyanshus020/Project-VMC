const db = require('../config/db');

// Auto-increment Die No. from '01', ensuring numeric sort
async function getNextDieNo(connection) {
  const [rows] = await connection.execute(`SELECT dieNo FROM sizes ORDER BY id DESC LIMIT 1`);
  if (!rows.length) return '01';

  const last = parseInt(rows[0].dieNo, 10);
  const next = (last + 1).toString().padStart(2, '0');
  return next;
}

// ✅ CREATE Size
exports.createSize = async (req, res) => {
  let connection;
  try {
    connection = await db();
    const dieNo = await getNextDieNo(connection);
    const { diameter, ballGauge, wireGauge, weight } = req.body;

    const [result] = await connection.execute(
      `INSERT INTO sizes (dieNo, diameter, ballGauge, wireGauge, weight)
       VALUES (?, ?, ?, ?, ?)`,
      [dieNo, diameter, ballGauge, wireGauge, weight]
    );

    res.status(201).json({
      id: result.insertId,
      dieNo,
      diameter,
      ballGauge,
      wireGauge,
      weight,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) await connection.end();
  }
};

// ✅ GET All Sizes
exports.getAllSizes = async (_req, res) => {
  let connection;
  try {
    connection = await db();
    const [rows] = await connection.execute(
      `SELECT * FROM sizes ORDER BY dieNo ASC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) await connection.end();
  }
};

// ✅ GET Size by ID
exports.getSizeById = async (req, res) => {
  let connection;
  try {
    connection = await db();
    const [rows] = await connection.execute(`SELECT * FROM sizes WHERE id = ?`, [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Size not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) await connection.end();
  }
};

// ✅ UPDATE Size by ID
exports.updateSize = async (req, res) => {
  let connection;
  try {
    const { diameter, ballGauge, wireGauge, weight } = req.body;
    connection = await db();

    const [result] = await connection.execute(
      `UPDATE sizes SET diameter = ?, ballGauge = ?, wireGauge = ?, weight = ?
       WHERE id = ?`,
      [diameter, ballGauge, wireGauge, weight, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Size not found' });
    }

    const [updated] = await connection.execute(`SELECT * FROM sizes WHERE id = ?`, [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) await connection.end();
  }
};

// ✅ DELETE Size by ID
exports.deleteSize = async (req, res) => {
  let connection;
  try {
    connection = await db();
    const [result] = await connection.execute(`DELETE FROM sizes WHERE id = ?`, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Size not found' });
    }

    res.json({ message: 'Size deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  } finally {
    if (connection) await connection.end();
  }
};

