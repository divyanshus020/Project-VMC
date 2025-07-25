const db = require('../config/db');

async function getConnection() {
  return db();
}

async function createCartTables() {
  const connection = await getConnection();

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      cartId INT NOT NULL,
      productId INT NOT NULL,
      sizeId INT DEFAULT NULL,
      DieNo VARCHAR(50) DEFAULT NULL,
      weight VARCHAR(50) DEFAULT NULL,
      tunch DECIMAL(5,2) DEFAULT NULL,
      quantity INT NOT NULL DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (cartId) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (sizeId) REFERENCES sizes(id) ON DELETE SET NULL
    )
  `);

  await connection.end();
}
createCartTables();

module.exports = {
  async findOrCreateCart(userId) {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        `SELECT * FROM carts WHERE userId = ? LIMIT 1`,
        [userId]
      );

      if (rows.length === 0) {
        const [result] = await connection.execute(
          `INSERT INTO carts (userId) VALUES (?)`,
          [userId]
        );
        return { id: result.insertId, userId };
      }

      return rows[0];
    } finally {
      await connection.end();
    }
  },

  async addItem(userId, item) {
    const { productId, quantity, sizeId = null, DieNo = null, weight = null, tunch = null } = item;
    if (!productId || quantity <= 0) throw new Error('Invalid item data');

    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT * FROM cart_items 
         WHERE cartId = ? AND productId = ? AND sizeId <=> ? 
         AND DieNo <=> ? AND weight <=> ? AND tunch <=> ? LIMIT 1`,
        [cart.id, productId, sizeId, DieNo, weight, tunch]
      );

      if (rows.length > 0) {
        await connection.execute(
          `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
          [quantity, rows[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO cart_items (cartId, productId, sizeId, DieNo, weight, tunch, quantity) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [cart.id, productId, sizeId, DieNo, weight, tunch, quantity]
        );
      }

      return true;
    } finally {
      await connection.end();
    }
  },

  async getCart(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      const [items] = await connection.execute(
        `SELECT id, productId, DieNo, weight, quantity 
         FROM cart_items WHERE cartId = ?`,
        [cart.id]
      );

      return { cartId: cart.id, userId: cart.userId, items };
    } finally {
      await connection.end();
    }
  },

  async getDetailedCart(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      const [items] = await connection.execute(
        `SELECT 
          ci.id, 
          ci.productId, 
          ci.sizeId,
          ci.DieNo, 
          ci.weight, 
          ci.tunch,
          ci.quantity,
          ci.createdAt,
          p.name AS productName, 
          p.imageUrl AS productImage,
          s.diameter,
          s.ballGauge,
          s.wireGauge
         FROM cart_items ci
         JOIN products p ON ci.productId = p.id
         LEFT JOIN sizes s ON ci.sizeId = s.id
         WHERE ci.cartId = ?`,
        [cart.id]
      );

      return { 
        cartId: cart.id, 
        userId: cart.userId, 
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
      };
    } finally {
      await connection.end();
    }
  },

  async updateItemQuantity(userId, itemId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(userId, itemId);
    }

    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      const [rows] = await connection.execute(
        `SELECT * FROM cart_items WHERE cartId = ? AND id = ? LIMIT 1`,
        [cart.id, itemId]
      );

      if (rows.length === 0) {
        throw new Error('Item not found in cart');
      }

      await connection.execute(
        `UPDATE cart_items SET quantity = ? WHERE id = ?`,
        [quantity, itemId]
      );

      return true;
    } finally {
      await connection.end();
    }
  },

  async removeItem(userId, itemId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      await connection.execute(
        `DELETE FROM cart_items WHERE cartId = ? AND id = ?`,
        [cart.id, itemId]
      );
      return true;
    } finally {
      await connection.end();
    }
  },

  async clearCart(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      await connection.execute(
        `DELETE FROM cart_items WHERE cartId = ?`,
        [cart.id]
      );
      return true;
    } finally {
      await connection.end();
    }
  },

  async getCartTotal(userId) {
    const cart = await this.findOrCreateCart(userId);
    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        `SELECT SUM(quantity) AS totalItems FROM cart_items WHERE cartId = ?`,
        [cart.id]
      );

      return result[0].totalItems || 0;
    } finally {
      await connection.end();
    }
  },

  async updateItemTunch(userId, itemId, tunch) {
    const connection = await getConnection();
    
    try {
      // First verify the item belongs to user's cart
      const [cartItems] = await connection.execute(`
        SELECT ci.* FROM cart_items ci
        JOIN carts c ON ci.cartId = c.id
        WHERE c.userId = ? AND ci.id = ?
      `, [userId, itemId]);

      if (cartItems.length === 0) {
        throw new Error('Item not found in user\'s cart');
      }

      // Update the tunch value
      await connection.execute(
        'UPDATE cart_items SET tunch = ? WHERE id = ?',
        [tunch, itemId]
      );

      // Return updated cart
      return await this.getDetailedCart(userId);
    } finally {
      await connection.end();
    }
  },

  /**
   * NEW: Updates the DieNo for a specific item in the cart.
   */
  async updateItemDieNo(userId, itemId, DieNo) {
    const connection = await getConnection();
    
    try {
      // First, verify the item belongs to the user's cart
      const [cartItems] = await connection.execute(`
        SELECT ci.* FROM cart_items ci
        JOIN carts c ON ci.cartId = c.id
        WHERE c.userId = ? AND ci.id = ?
      `, [userId, itemId]);

      if (cartItems.length === 0) {
        throw new Error('Item not found in user\'s cart');
      }

      // Update the DieNo value
      await connection.execute(
        'UPDATE cart_items SET DieNo = ? WHERE id = ?',
        [DieNo, itemId]
      );

      return true; // Indicate success
    } finally {
      await connection.end();
    }
  }
};
