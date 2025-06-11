const db = require('../Config/db');

class Product {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ name, description, price, stock, image_url }) {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, stock, image_url]
        );
        return result.insertId;
    }

    static async update(id, { name, description, price, stock, image_url }) {
        await db.query(
            'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
            [name, description, price, stock, image_url, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;