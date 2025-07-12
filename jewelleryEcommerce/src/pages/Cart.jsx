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
  ShoppingBag
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
    if (!token) return;

    setLoading(true);
    setError(null);
    
    try {
      // Fetch detailed cart data
      const detailedCartResponse = await getDetailedCart(token);
      const cartResponseData = detailedCartResponse.data || detailedCartResponse;
      
      // Handle the API response structure: {cartId, userId, items: [], totalItems}
      if (cartResponseData && cartResponseData.items) {
        setCartData({
          cartId: cartResponseData.cartId,
          userId: cartResponseData.userId,
          totalItems: cartResponseData.totalItems
        });

        // Process the items array
        const items = cartResponseData.items || [];
        
        // Enhance items with additional data if needed
        const enhancedItems = await Promise.all(
          items.map(async (cartItem) => {
            try {
              let additionalData = {};

              // Fetch die and size details if DieNo exists
              if (cartItem.DieNo && cartItem.DieNo !== "null") {
                try {
                  // First, fetch die information to get the size ID
                  const dieResponse = await getDieById(cartItem.DieNo);
                  const dieData = dieResponse.data || {};
                  
                  // If die has a size ID, fetch the size details
                  if (dieData.sizeId) {
                    const sizeResponse = await getSizeById(dieData.sizeId);
                    const sizeData = sizeResponse.data || {};
                    
                    // Extract size-specific data
                    additionalData.diameter = sizeData.diameter || null;
                    additionalData.ballGauge = sizeData.ballGauge || sizeData.ball_gauge || null;
                    additionalData.wireGauge = sizeData.wireGauge || sizeData.wire_gauge || null;
                    
                    // Use API weight if size data has different weight
                    if (sizeData.weight && sizeData.weight !== cartItem.weight) {
                      additionalData.sizeWeight = sizeData.weight;
                    }
                  }
                } catch (dieError) {
                  console.warn(`Failed to fetch die ${cartItem.DieNo}:`, dieError);
                  
                  // Fallback: If getDieById fails, try direct size fetch (in case DieNo is actually a size ID)
                  try {
                    const sizeResponse = await getSizeById(cartItem.DieNo);
                    const sizeData = sizeResponse.data || {};
                    
                    additionalData.diameter = sizeData.diameter || null;
                    additionalData.ballGauge = sizeData.ballGauge || sizeData.ball_gauge || null;
                    additionalData.wireGauge = sizeData.wireGauge || sizeData.wire_gauge || null;
                    
                    if (sizeData.weight && sizeData.weight !== cartItem.weight) {
                      additionalData.sizeWeight = sizeData.weight;
                    }
                  } catch (sizeError) {
                    console.warn(`Failed to fetch size for DieNo ${cartItem.DieNo}:`, sizeError);
                  }
                }
              }

              return {
                id: cartItem.id,
                productId: cartItem.productId,
                productName: cartItem.productName,
                dieNo: cartItem.DieNo && cartItem.DieNo !== "null" ? cartItem.DieNo : 'N/A',
                quantity: cartItem.quantity,
                weight: cartItem.weight && cartItem.weight !== "null" ? parseFloat(cartItem.weight) : null,
                diameter: additionalData.diameter || cartItem.diameter || null,
                ballGauge: additionalData.ballGauge || cartItem.ballGauge || null,
                wireGauge: additionalData.wireGauge || cartItem.wireGauge || null,
                productImage: cartItem.productImage || null,
                createdAt: cartItem.createdAt || new Date().toISOString(),
                ...additionalData
              };
            } catch (itemError) {
              console.error(`Error processing cart item:`, itemError);
              return {
                id: cartItem.id,
                productId: cartItem.productId,
                productName: cartItem.productName || 'Unknown Product',
                dieNo: cartItem.DieNo && cartItem.DieNo !== "null" ? cartItem.DieNo : 'N/A',
                quantity: cartItem.quantity || 1,
                weight: cartItem.weight && cartItem.weight !== "null" ? parseFloat(cartItem.weight) : null,
                diameter: cartItem.diameter || null,
                ballGauge: cartItem.ballGauge || null,
                wireGauge: cartItem.wireGauge || null,
                productImage: cartItem.productImage || null,
                createdAt: cartItem.createdAt || new Date().toISOString()
              };
            }
          })
        );

        setCartItems(enhancedItems);
      } else {
        // Handle case where no items or different structure
        setCartItems([]);
        setCartData({ cartId: null, userId: null, totalItems: 0 });
      }
    } catch (err) {
      console.error('Cart fetch error:', err);
      setError(err.message || 'Failed to load cart data');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        setError('Session expired. Please log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const token = getValidToken();
    if (!token) return;

    try {
      await updateCartItemQuantity(itemId, newQuantity, token);
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Update total items count
      if (cartData) {
        const newTotal = cartItems.reduce((sum, item) => {
          return sum + (item.id === itemId ? newQuantity : item.quantity);
        }, 0);
        setCartData(prev => ({ ...prev, totalItems: newTotal }));
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
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
    fetchCartData();
  }, []);

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
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Hash className="h-4 w-4" />
                              <span className="text-sm font-medium">Die No</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{item.dieNo}</p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Ruler className="h-4 w-4" />
                              <span className="text-sm font-medium">Diameter</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.diameter ? `${item.diameter} mm` : 'N/A'}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Package className="h-4 w-4" />
                              <span className="text-sm font-medium">Ball Gauge</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.ballGauge || 'N/A'}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Ruler className="h-4 w-4" />
                              <span className="text-sm font-medium">Wire Gauge</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.wireGauge || 'N/A'}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Weight className="h-4 w-4" />
                              <span className="text-sm font-medium">Weight</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.weight ? `${item.weight} kg` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Added on</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(item.createdAt).toLocaleDateString()}
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
                  }, 0).toFixed(2)} kg
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