const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { validateCartItem, validateRequest } = require('../utils/validators');

exports.getCart = async (req, res) => {
    try {
        const cartItems = await Cart.getByUserId(req.user.userId);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = [
    ...validateCartItem,
    validateRequest,
    async (req, res) => {
        try {
            const { productId, quantity = 1 } = req.body;
            
            // Check if product exists
            const product = await Product.getById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            // Add to cart
            await Cart.addItem(req.user.userId, productId, quantity);
            
            // Return updated cart
            const cartItems = await Cart.getByUserId(req.user.userId);
            res.status(200).json(cartItems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

exports.updateCartItem = [
    ...validateCartItem,
    validateRequest,
    async (req, res) => {
        try {
            const { quantity } = req.body;
            const { productId } = req.params;
            
            // Check if product exists
            const product = await Product.getById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            // Update cart item
            await Cart.updateItem(req.user.userId, productId, quantity);
            
            // Return updated cart
            const cartItems = await Cart.getByUserId(req.user.userId);
            res.status(200).json(cartItems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        
        // Check if product exists
        const product = await Product.getById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Remove from cart
        await Cart.removeItem(req.user.userId, productId);
        
        // Return updated cart
        const cartItems = await Cart.getByUserId(req.user.userId);
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        await Cart.clearCart(req.user.userId);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};