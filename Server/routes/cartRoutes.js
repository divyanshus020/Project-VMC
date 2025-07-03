const express = require('express');
const router = express.Router();
const {
  addToCart,
  getCart,
  removeItem,
  clearCart
} = require('../controllers/cartController');

// 🔐 Require login middleware (ensure req.user._id is available)
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth); // Apply auth to all

router.post('/add', addToCart);
router.get('/', getCart);
router.delete('/remove/:productId', removeItem);
router.delete('/clear', clearCart);

module.exports = router;
