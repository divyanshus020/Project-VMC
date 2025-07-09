const Cart = require('../models/Cart');

// Helper to extract user ID safely
const getUserId = (req) => req.user?.userId || req.user?.id;

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, DieNo, weight } = req.body;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Product ID and quantity are required' });
  }

  try {
    await Cart.addItem(userId, {
      productId,
      quantity,
      DieNo: DieNo || null,
      weight: weight || null
    });

    const cart = await Cart.getCart(userId);
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to add to cart' });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch cart' });
  }
};

// Get detailed cart with product information
exports.getDetailedCart = async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    const cart = await Cart.getDetailedCart(userId);
    res.status(200).json(cart || { items: [], totalItems: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch detailed cart' });
  }
};

// Update item quantity in cart
exports.updateItemQuantity = async (req, res) => {
  const userId = getUserId(req);
  const itemId = parseInt(req.params.itemId, 10);
  const { quantity } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  if (!itemId || !quantity) {
    return res.status(400).json({ message: 'Item ID and quantity are required' });
  }

  try {
    await Cart.updateItemQuantity(userId, itemId, quantity);
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update item quantity' });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  const userId = getUserId(req);
  const itemId = parseInt(req.params.itemId, 10);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  if (!itemId) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    await Cart.removeItem(userId, itemId);
    const cart = await Cart.getCart(userId);
    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to remove item' });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    await Cart.clearCart(userId);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to clear cart' });
  }
};

// Get cart total (number of items)
exports.getCartTotal = async (req, res) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    const totalItems = await Cart.getCartTotal(userId);
    res.status(200).json({ totalItems });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to get cart total' });
  }
};
