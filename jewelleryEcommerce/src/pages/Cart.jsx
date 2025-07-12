import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  Package,
  Ruler,
  Weight,
  Hash,
  AlertCircle,
  ShoppingBag,
  Percent
} from 'lucide-react';
import {
  getDetailedCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getProductById,
  getSizeById,
  getDieById // Add this import - you'll need to create this API function
} from '../lib/api';

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityMode, setQuantityMode] = useState('pieces'); // 'pieces' or 'weight'
  const [customQuantity, setCustomQuantity] = useState({});
  const [customWeight, setCustomWeight] = useState({});

  const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access your cart');
      return null;
    }
    return token;
  };

  const fetchCartData = async () => {
    const token = getValidToken();
    if (!token) {
      setError('Please log in to access your cart');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Add debug log
      console.log('Fetching cart with token:', token);
      
      const response = await getDetailedCart(token);
      console.log('Cart Response:', response); // Debug log
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to load cart');
      }

      // Log the cart response data
      console.log('Cart Response Data:', response.data);

      const cartResponseData = response.data;
      const items = cartResponseData.items || [];

      // Debug log for items
      console.log('Processed Items:', items);

      setCartData({
        cartId: cartResponseData.cartId,
        userId: cartResponseData.userId,
        totalItems: items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
      });

      // Process items with better error handling
      const processedItems = items.map(item => {
        try {
          return {
            id: item.id || `temp-${Math.random()}`,
            productId: item.productId,
            productName: item.productName || 'Unknown Product',
            quantity: Math.max(1, parseInt(item.quantity) || 1),
            // Convert weight to grams if it comes in kg
            weight: item.weight ? parseFloat(item.weight) : null,
            tunch: item.tunch ? parseFloat(item.tunch) : null,
            DieNo: item.DieNo || null,
            sizeId: item.sizeId || null,
            diameter: item.diameter || null,
            ballGauge: item.ballGauge || null,
            wireGauge: item.wireGauge || null,
            productImage: item.productImage || null,
            createdAt: item.createdAt || new Date().toISOString()
          };
        } catch (err) {
          console.error('Error processing item:', item, err);
          return null;
        }
      }).filter(Boolean); // Remove any null items

      console.log('Setting cart items:', processedItems); // Debug log
      setCartItems(processedItems);

    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err.message || 'Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity, isFromWeight = false) => {
    if (newQuantity < 1) return;
    
    const token = getValidToken();
    if (!token) return;

    try {
      const response = await updateCartItemQuantity(itemId, newQuantity, token);
      
      if (response.data?.success) {
        setCartItems(prev => 
          prev.map(item => {
            if (item.id === itemId) {
              // Update custom weight if change was from quantity
              if (!isFromWeight && item.weight) {
                setCustomWeight(prev => ({
                  ...prev,
                  [itemId]: (newQuantity * item.weight).toFixed(3)
                }));
              }
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );
        
        // Update total items count
        if (cartData) {
          const newTotal = cartItems.reduce((sum, item) => {
            return sum + (item.id === itemId ? newQuantity : item.quantity);
          }, 0);
          setCartData(prev => ({ ...prev, totalItems: newTotal }));
        }
      } else {
        throw new Error(response.data?.message || 'Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
      fetchCartData();
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = getValidToken();
    if (!token) return;

    try {
      await removeCartItem(itemId, token);
      const removedItem = cartItems.find(item => item.id === itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Update total items count
      if (cartData && removedItem) {
        setCartData(prev => ({ 
          ...prev, 
          totalItems: prev.totalItems - removedItem.quantity 
        }));
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    const token = getValidToken();
    if (!token) return;

    try {
      await clearCart(token);
      setCartItems([]);
      setCartData(prev => ({ ...prev, totalItems: 0 }));
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      if (!mounted) return;
      await fetchCartData();
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, []);

  // Add this check at the start of your CartPage component
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      console.log('Token available:', !!token); // Debug log
      if (!token) {
        setCartItems([]);
        setCartData(null);
        setError('Please log in to access your cart');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add this helper function inside CartPage component
  const calculateQuantityFromWeight = (targetWeight, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 1;
    return Math.max(1, Math.round(targetWeight / pieceWeight));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Cart</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCartData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <button
              onClick={() => window.location.href = '/products'}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {cartData?.totalItems || cartItems.length} {(cartData?.totalItems || cartItems.length) === 1 ? 'item' : 'items'}
              </span>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full lg:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                      {item.productImage ? (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {item.productName}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Product ID: {item.productId}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
                          {/* Die Number */}
                          {item.DieNo && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Hash className="h-4 w-4" />
                                <span className="text-sm font-medium">Die No</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.DieNo}
                              </p>
                            </div>
                          )}

                          {/* Diameter */}
                          {item.diameter && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm font-medium">Diameter</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.diameter}mm
                              </p>
                            </div>
                          )}

                          {/* Ball Gauge */}
                          {item.ballGauge && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Package className="h-4 w-4" />
                                <span className="text-sm font-medium">Ball Gauge</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.ballGauge} BG
                              </p>
                            </div>
                          )}

                          {/* Wire Gauge */}
                          {item.wireGauge && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm font-medium">Wire Gauge</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.wireGauge} WG
                              </p>
                            </div>
                          )}

                          {/* Tunch */}
                          {item.tunch && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Percent className="h-4 w-4" />
                                <span className="text-sm font-medium">Tunch</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                {item.tunch}%
                              </p>
                            </div>
                          )}

                          {/* Weight */}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Weight className="h-4 w-4" />
                              <span className="text-sm font-medium">Weight</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.weight ? `${item.weight} g` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity/Weight Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          {/* Mode Switch */}
                          <div className="flex items-center space-x-2">
                            <select
                              value={quantityMode}
                              onChange={(e) => setQuantityMode(e.target.value)}
                              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                            >
                              <option value="pieces">By Pieces</option>
                              <option value="weight">By Weight</option>
                            </select>
                          </div>

                          {quantityMode === 'pieces' ? (
                            // Pieces Quantity Selector
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Quantity:</span>
                              <div className="flex items-center">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={customQuantity[item.id] || item.quantity}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      setCustomQuantity(prev => ({ ...prev, [item.id]: val }));
                                      handleQuantityChange(item.id, val);
                                    }}
                                    className="w-16 text-center border-x border-gray-300 py-2 font-medium text-gray-900"
                                  />
                                  <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Weight-based Quantity Selector
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Weight (g):</span>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  min="0.001"
                                  step="0.001"
                                  value={customWeight[item.id] || (item.weight * item.quantity).toFixed(3)}
                                  onChange={(e) => {
                                    const targetWeight = parseFloat(e.target.value) || 0;
                                    setCustomWeight(prev => ({ ...prev, [item.id]: targetWeight }));
                                    // Calculate quantity based on per-piece weight
                                    if (item.weight) {
                                      const calculatedQuantity = calculateQuantityFromWeight(targetWeight, item.weight);
                                      handleQuantityChange(item.id, calculatedQuantity);
                                    }
                                  }}
                                  className="w-24 text-center border border-gray-300 rounded-lg py-2 px-3 font-medium text-gray-900"
                                />
                                <span className="text-sm text-gray-500">
                                  ({(item.weight || 0).toFixed(3)}g/piece)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Total Weight Display */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Weight</p>
                          <p className="text-sm font-medium text-gray-900">
                            {(item.weight * item.quantity).toFixed(3)}g
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cartData && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cart Summary</h3>
                <p className="text-sm text-gray-600">
                  Total Items: {cartData.totalItems} | Unique Products: {cartItems.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Weight</p>
                <p className="text-xl font-bold text-gray-900">
                  {cartItems.reduce((total, item) => {
                    return total + (item.weight ? item.weight * item.quantity : 0);
                  }, 0).toFixed(2)} g
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;