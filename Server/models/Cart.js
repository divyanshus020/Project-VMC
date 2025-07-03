const db = require('../config/db');

// Helper to get a MySQL connection
async function getConnection() {
  return db();
}

// Create Cart and CartItem tables if not exist
async function createCartTables() {
  const connection = await getConnection();
  // Cart table (one per user)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  // Cart items table (many per cart)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cartId INT NOT NULL,
      productId INT NOT NULL,
      quantity INT NOT NULL,

      -- Mala fields
      capSize VARCHAR(50),
      weight VARCHAR(50),
      tulsiRudrakshMM VARCHAR(50),
      estPCS VARCHAR(50),

      -- Non-mala fields
      diameter VARCHAR(50),
      ballGauge VARCHAR(50),
      wireGauge VARCHAR(50),
      otherWeight VARCHAR(50),

      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE
    )
  `);
  await connection.end();
}
createCartTables();

module.exports = {
  // Find or create a cart for a user
  async findOrCreateCart(userId) {
    const connection = await getConnection();
    let [rows] = await connection.execute(
      `SELECT * FROM carts WHERE userId = ? LIMIT 1`,
      [userId]
    );
    let cart;
    if (rows.length === 0) {
      const [result] = await connection.execute(
        `INSERT INTO carts (userId) VALUES (?)`,
        [userId]
      );
      cart = { id: result.insertId, userId };
    } else {
      cart = rows[0];
    }
    await connection.end();
    return cart;
  },

  // Add item to cart
  async addItem(userId, item) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();
    // Check if item with same productId and options exists
    const [rows] = await connection.execute(
      `SELECT * FROM cart_items WHERE cartId = ? AND productId = ? 
        AND capSize = ? AND weight = ? AND tulsiRudrakshMM = ? AND estPCS = ?
        AND diameter = ? AND ballGauge = ? AND wireGauge = ? AND otherWeight = ? LIMIT 1`,
      [
        cart.id,
        item.productId,
        item.capSize || null,
        item.weight || null,
        item.tulsiRudrakshMM || null,
        item.estPCS || null,
        item.diameter || null,
        item.ballGauge || null,
        item.wireGauge || null,
        item.otherWeight || null,
      ]
    );
    if (rows.length > 0) {
      // Update quantity if item exists
      await connection.execute(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [item.quantity, rows[0].id]
      );
    } else {
      // Insert new item
      await connection.execute(
        `INSERT INTO cart_items 
          (cartId, productId, quantity, capSize, weight, tulsiRudrakshMM, estPCS, diameter, ballGauge, wireGauge, otherWeight)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cart.id,
          item.productId,
          item.quantity,
          item.capSize || null,
          item.weight || null,
          item.tulsiRudrakshMM || null,
          item.estPCS || null,
          item.diameter || null,
          item.ballGauge || null,
          item.wireGauge || null,
          item.otherWeight || null,
        ]
      );
    }
    await connection.end();
    return true;
  },

  // Get cart with items for a user
  async getCart(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();
    const [items] = await connection.execute(
      `SELECT * FROM cart_items WHERE cartId = ?`,
      [cart.id]
    );
    await connection.end();
    return { cartId: cart.id, userId: cart.userId, items };
  },

  // Remove item from cart
  async removeItem(userId, itemId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM cart_items WHERE cartId = ? AND id = ?`,
      [cart.id, itemId]
    );
    await connection.end();
    return true;
  },

  // Clear cart
  async clearCart(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();
    await connection.execute(
      `DELETE FROM cart_items WHERE cartId = ?`,
      [cart.id]
    );
    await connection.end();
    return true;
  },
};