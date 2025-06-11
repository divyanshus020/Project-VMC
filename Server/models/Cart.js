const db = require('../Config/db');

class Cart {
    static async getByUserId(userId) {
        const [rows] = await db.query(
            `SELECT c.id as cart_id, p.id as product_id, p.name, p.price, p.image_url, c.quantity 
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );
        return rows;
    }

    static async addItem(userId, productId, quantity = 1) {
        // Check if item already exists in cart
        const [existing] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            // Update quantity if item exists
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
        } else {
            // Add new item to cart
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
        }
    }

    static async updateItem(userId, productId, quantity) {
        await db.query(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );
    }

    static async removeItem(userId, productId) {
        await db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
    }

    static async clearCart(userId) {
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
    }
}

module.exports = Cart;