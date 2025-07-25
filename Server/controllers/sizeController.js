// controllers/sizeController.js
const db = require('../config/db');

// ✅ CREATE Size
exports.createSize = async (req, res) => {
  let connection;
  try {
    connection = await db();
    const { dieNo, diameter, ballGauge, wireGauge, weight } = req.body;

    // basic required-field check
    if (!dieNo && dieNo !== 0) {
      return res.status(400).json({ message: 'dieNo is required' });
    }

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
    const { dieNo, diameter, ballGauge, wireGauge, weight } = req.body;
    connection = await db();

    // build dynamic SET clause
    const fields = [];
    const values = [];

    if (dieNo !== undefined) {
      fields.push('dieNo = ?');
      values.push(dieNo);
    }
    if (diameter !== undefined) {
      fields.push('diameter = ?');
      values.push(diameter);
    }
    if (ballGauge !== undefined) {
      fields.push('ballGauge = ?');
      values.push(ballGauge);
    }
    if (wireGauge !== undefined) {
      fields.push('wireGauge = ?');
      values.push(wireGauge);
    }
    if (weight !== undefined) {
      fields.push('weight = ?');
      values.push(weight);
    }

    if (!fields.length) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    values.push(req.params.id);

    const [result] = await connection.execute(
      `UPDATE sizes SET ${fields.join(', ')} WHERE id = ?`,
      values
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