const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

// Add item to cart (requires auth)
router.post('/add', protect, cartController.addToCart);

// Get user's cart (requires auth)
router.get('/', protect, cartController.getCart);

// Get detailed cart with product info (requires auth)
router.get('/detailed', protect, cartController.getDetailedCart);

// Get cart total (number of items)
router.get('/total', protect, cartController.getCartTotal);

// Update item quantity (requires auth)
router.patch('/item/:itemId', protect, cartController.updateItemQuantity);

// Remove item by itemId (requires auth)
router.delete('/item/:itemId', protect, cartController.removeItem);

// Clear entire cart (requires auth)
router.delete('/clear', protect, cartController.clearCart);

module.exports = router;
