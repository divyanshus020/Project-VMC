// models/Product.js
const db = require('../config/db');

// Helper: open DB connection
async function getConnection() {
  return db();
}

// Create Product table if it doesn't exist
async function createProductTable() {
  const connection = await getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      imageUrl VARCHAR(500) DEFAULT '',
      category VARCHAR(50) NOT NULL,
      images JSON DEFAULT NULL,
      dieIds JSON DEFAULT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await connection.end();
}
createProductTable();

module.exports = {
  // ✅ Create new product
  async create(product) {
    const connection = await getConnection();

    const name = product.name ?? '';
    const imageUrl = product.imageUrl ?? '';
    const category = product.category ?? '';
    const images = Array.isArray(product.images) ? product.images : [];
    const dieIds = Array.isArray(product.dieIds) ? product.dieIds : [];

    const [result] = await connection.execute(
      `INSERT INTO products (name, imageUrl, category, images, dieIds)
       VALUES (?, ?, ?, ?, ?)`,
      [name, imageUrl, category, JSON.stringify(images), JSON.stringify(dieIds)]
    );

    await connection.end();
    return { id: result.insertId, name, imageUrl, category, images, dieIds };
  },

  // ✅ Get all products with their sizes
  async findAll() {
    const connection = await getConnection();

    const [products] = await connection.execute(`SELECT * FROM products ORDER BY id DESC`);
    const [sizes] = await connection.execute(`SELECT * FROM sizes`);

    await connection.end();

    return products.map(product => {
      const dieIds = product.dieIds ? JSON.parse(product.dieIds) : [];
      const productSizes = sizes.filter(size => dieIds.includes(size.id));

      return {
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
        dieIds,
        sizes: productSizes
      };
    });
  },

  // ✅ Get product by ID with sizes
  async findById(id) {
    const connection = await getConnection();

    const [rows] = await connection.execute(`SELECT * FROM products WHERE id = ? LIMIT 1`, [id]);
    if (!rows[0]) {
      await connection.end();
      return null;
    }

    const product = rows[0];
    const dieIds = product.dieIds ? JSON.parse(product.dieIds) : [];

    let sizes = [];
    if (dieIds.length > 0) {
      const placeholders = dieIds.map(() => '?').join(',');
      const [sizeRows] = await connection.execute(
        `SELECT * FROM sizes WHERE id IN (${placeholders})`,
        dieIds
      );
      sizes = sizeRows;
    }

    await connection.end();

    return {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      dieIds,
      sizes
    };
  },

  // ✅ Update product
   async updateById(id, data) {
    const connection = await getConnection();

    const name = data.name ?? '';
    const imageUrl = data.imageUrl ?? '';
    const category = data.category ?? '';
    const images = Array.isArray(data.images) ? data.images : [];
    const dieIds = Array.isArray(data.dieIds) ? data.dieIds : [];

    await connection.execute(
      `UPDATE products SET
        name = ?, imageUrl = ?, category = ?, images = ?, dieIds = ?, updatedAt = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, imageUrl, category, JSON.stringify(images), JSON.stringify(dieIds), id]
    );

    await connection.end();
  },

  // ✅ Delete product
  async deleteById(id) {
    const connection = await getConnection();
    await connection.execute(`DELETE FROM products WHERE id = ?`, [id]);
    await connection.end();
  },

  // ✅ Filter products by dieNo (string or number)
  async filterByDieNo(dieNo) {
    const connection = await getConnection();

    const [products] = await connection.execute(`SELECT * FROM products ORDER BY id DESC`);
    const [matchingSizes] = await connection.execute(
      `SELECT * FROM sizes WHERE dieNo = ?`,
      [dieNo] // pass as-is (string or number)
    );

    const sizeMap = new Map(matchingSizes.map(size => [size.id, size]));

    const filteredProducts = products
      .filter(product => {
        const dieIds = product.dieIds ? JSON.parse(product.dieIds) : [];
        return dieIds.some(id => sizeMap.has(id));
      })
      .map(product => {
        const dieIds = product.dieIds ? JSON.parse(product.dieIds) : [];
        const relatedSizes = dieIds.map(id => sizeMap.get(id)).filter(Boolean);

        return {
          ...product,
          images: product.images ? JSON.parse(product.images) : [],
          dieIds,
          sizes: relatedSizes
        };
      });

    await connection.end();
    return filteredProducts;
  }
};