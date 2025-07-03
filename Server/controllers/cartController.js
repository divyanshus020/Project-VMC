const Cart = require('../models/Cart');

// Add to cart (MySQL)
exports.addToCart = async (req, res) => {
  const {
    productId,
    quantity,
    capSize,
    weight,
    tulsiRudrakshMM,
    estPCS,
    diameter,
    ballGauge,
    wireGauge,
    otherWeight
  } = req.body;
  const userId = req.user.userId || req.user.id; // Use userId from JWT

  try {
    await Cart.addItem(userId, {
      productId,
      quantity,
      capSize,
      weight,
      tulsiRudrakshMM,
      estPCS,
      diameter,
      ballGauge,
      wireGauge,
      otherWeight
    });
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's cart (MySQL)
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from cart (MySQL)
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { itemId } = req.params;
    await Cart.removeItem(userId, itemId);
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear cart (MySQL)
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    await Cart.clearCart(userId);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
