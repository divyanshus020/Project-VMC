const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const cartController = require('../controllers/cartController');

// Base cart routes
router.get('/detailed', protect, cartController.getDetailedCart);
router.post('/add', protect, cartController.addToCart);
router.delete('/clear', protect, cartController.clearCart);

// Item specific routes
router.patch('/item/:itemId/quantity', protect, cartController.updateItemQuantity);
router.patch('/item/:itemId/tunch', protect, cartController.updateItemTunch);
router.delete('/item/:itemId', protect, cartController.removeItem);

// NEW: Route to update the DieNo of a specific cart item
router.patch('/item/:itemId/dieno', protect, cartController.updateItemDieNo);


module.exports = router;
