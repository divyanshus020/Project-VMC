const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeItem,
  clearCart
} = require('../controllers/cartController');

// 🔐 Require login middleware (ensure req.user.userId is available)
const { protect } = require('../middleware/auth');

router.use(protect); // Apply auth to all routes

router.post('/add', addToCart);
router.get('/', getCart);
// Remove by cart item ID (not productId, for SQL)
router.delete('/remove/:itemId', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
