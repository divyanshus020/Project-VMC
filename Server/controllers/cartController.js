const Cart = require('../models/Cart');

// Helper to extract user ID safely
const getUserId = (req) => req.user?.userId || req.user?.id;

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity, sizeId, DieNo, weight, tunch } = req.body;
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: User ID missing'
    });
  }

  if (!productId || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Product ID and quantity are required'
    });
  }

  try {
    await Cart.addItem(userId, {
      productId,
      quantity,
      sizeId: sizeId || null,
      DieNo: DieNo || null,
      weight: weight || null,
      tunch: tunch || null
    });

    const cart = await Cart.getDetailedCart(userId);
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('Error adding to cart:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to add to cart'
    });
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
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: User ID missing'
    });
  }

  try {
    const cart = await Cart.getDetailedCart(userId);
    res.status(200).json({
      success: true,
      data: cart || { items: [], totalItems: 0 }
    });
  } catch (err) {
    console.error('Error fetching detailed cart:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch detailed cart'
    });
  }
};

// Update item quantity in cart
exports.updateItemQuantity = async (req, res) => {
  try {
    const userId = getUserId(req);
    const itemId = parseInt(req.params.itemId);
    const { quantity } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID missing'
      });
    }

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and quantity are required'
      });
    }

    await Cart.updateItemQuantity(userId, itemId, quantity);
    const updatedCart = await Cart.getDetailedCart(userId);

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    console.error('Error updating quantity:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update quantity'
    });
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

// Update item tunch in cart - FIXED
exports.updateItemTunch = async (req, res) => {
  try {
    const userId = getUserId(req); // Fixed: Use getUserId instead of req.user.id
    const itemId = parseInt(req.params.itemId);
    const { tunch } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID missing'
      });
    }

    if (!itemId || tunch === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and tunch value are required'
      });
    }

    await Cart.updateItemTunch(userId, itemId, tunch);
    const updatedCart = await Cart.getDetailedCart(userId);

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    console.error('Error updating tunch:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update tunch'
    });
  }
};

// Update item DieNo in cart
exports.updateItemDieNo = async (req, res) => {
  try {
    const userId = getUserId(req);
    const itemId = parseInt(req.params.itemId);
    const { DieNo } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User ID missing'
      });
    }

    if (!itemId || DieNo === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and DieNo are required'
      });
    }

    await Cart.updateItemDieNo(userId, itemId, DieNo);
    const updatedCart = await Cart.getDetailedCart(userId);

    res.json({
      success: true,
      data: updatedCart
    });
  } catch (err) {
    console.error('Error updating DieNo:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to update DieNo'
    });
  }
};
