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
  Percent,
  Send // Icon for the new enquiry button
} from 'lucide-react';
import {
  getDetailedCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  createEnquiry // Ensure this is imported from your api.js
} from '../lib/api';

const CartPage = () => {
  const [cartData, setCartData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityMode, setQuantityMode] = useState('pieces');
  const [customQuantity, setCustomQuantity] = useState({});
  const [customWeight, setCustomWeight] = useState({});
  const [isEnquiring, setIsEnquiring] = useState(false); // Loading state for the enquiry button

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
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getDetailedCart(token);
      if (!response.success) {
        throw new Error(response.error || 'Failed to load cart');
      }

      const cartResponseData = response.data;
      const items = cartResponseData.items || [];

      setCartData({
        cartId: cartResponseData.cartId,
        userId: cartResponseData.userId,
        totalItems: items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)
      });

      const processedItems = items.map(item => ({
        id: item.id || `temp-${Math.random()}`,
        productId: item.productId,
        productName: item.productName || 'Unknown Product',
        quantity: Math.max(1, parseInt(item.quantity) || 1),
        weight: item.weight ? parseFloat(item.weight) : null,
        tunch: item.tunch ? parseFloat(item.tunch) : null,
        DieNo: item.DieNo || null,
        sizeId: item.sizeId || null,
        diameter: item.diameter || null,
        ballGauge: item.ballGauge || null,
        wireGauge: item.wireGauge || null,
        productImage: item.productImage || null,
        createdAt: item.createdAt || new Date().toISOString()
      })).filter(Boolean);

      setCartItems(processedItems);

    } catch (err) {
      setError(err.message || 'Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCartData();
  }, []);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = getValidToken();
    if (!token) return;

    try {
      const response = await updateCartItemQuantity(itemId, newQuantity, token);
      if (response.data?.success) {
        fetchCartData(); // Re-fetch for consistency
      } else {
        throw new Error(response.data?.message || 'Failed to update quantity');
      }
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
      fetchCartData();
    }
  };

  const handleRemoveItem = async (itemId) => {
    const token = getValidToken();
    if (!token) return;

    try {
      await removeCartItem(itemId, token);
      fetchCartData();
    } catch (err) {
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
      setError('Failed to clear cart');
    }
  };

  const handleEnquiryCart = async () => {
    const token = getValidToken();
    if (!token || !cartData?.userId || cartItems.length === 0) {
        setError("Cannot submit enquiry. Cart is empty or user is not identified.");
        return;
    }

    setIsEnquiring(true);
    setError(null);

    try {
        const enquiryPromises = cartItems.map(item => {
            const enquiryData = {
                productID: item.productId,
                userID: cartData.userId,
                quantity: item.quantity,
                sizeID: item.sizeId,
                tunch: item.tunch
            };
            return createEnquiry(enquiryData, token);
        });

        const results = await Promise.all(enquiryPromises);

        const failedEnquiries = results.filter(res => !res.success);
        if (failedEnquiries.length > 0) {
            throw new Error(`Could not submit ${failedEnquiries.length} item(s). Please try again.`);
        }

        alert('All items have been successfully submitted as enquiries!');
        await handleClearCart();
        window.location.href = '/orders';

    } catch (err) {
        setError(err.message || "An unexpected error occurred while submitting your enquiry.");
    } finally {
        setIsEnquiring(false);
    }
  };
  
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">An Error Occurred</h3>
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
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {cartData?.totalItems || 0} {cartData?.totalItems === 1 ? 'item' : 'items'}
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
                          {item.DieNo && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Hash className="h-4 w-4" />
                                <span className="text-sm font-medium">Die No</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{item.DieNo}</p>
                            </div>
                          )}
                          {item.diameter && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Ruler className="h-4 w-4" />
                                <span className="text-sm font-medium">Diameter</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{item.diameter}mm</p>
                            </div>
                          )}
                          {item.ballGauge && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Package className="h-4 w-4" />
                                <span className="text-sm font-medium">Ball Gauge</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{item.ballGauge} BG</p>
                            </div>
                          )}
                          {item.wireGauge && (
                             <div className="bg-gray-50 rounded-lg p-3">
                               <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                 <Ruler className="h-4 w-4" />
                                 <span className="text-sm font-medium">Wire Gauge</span>
                               </div>
                               <p className="text-sm font-semibold text-gray-900">{item.wireGauge} WG</p>
                             </div>
                          )}
                          {item.tunch && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                                <Percent className="h-4 w-4" />
                                <span className="text-sm font-medium">Tunch</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">{item.tunch}%</p>
                            </div>
                          )}
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 text-gray-600 mb-1">
                              <Weight className="h-4 w-4" />
                              <span className="text-sm font-medium">Weight</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{item.weight ? `${item.weight} g` : 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity/Weight Controls */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
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
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Quantity:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 disabled:opacity-50"
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
                                  className="w-16 text-center border-x border-gray-300 py-2 font-medium"
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-700">Weight (g):</span>
                              <input
                                type="number"
                                min="0.001"
                                step="0.001"
                                value={customWeight[item.id] || (item.weight * item.quantity).toFixed(3)}
                                onChange={(e) => {
                                  const targetWeight = parseFloat(e.target.value) || 0;
                                  setCustomWeight(prev => ({ ...prev, [item.id]: targetWeight }));
                                  if (item.weight) {
                                    const newQty = calculateQuantityFromWeight(targetWeight, item.weight);
                                    handleQuantityChange(item.id, newQty);
                                  }
                                }}
                                className="w-24 text-center border border-gray-300 rounded-lg py-2 px-3"
                              />
                            </div>
                          )}
                        </div>
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
                  {cartItems.reduce((total, item) => total + (item.weight ? item.weight * item.quantity : 0), 0).toFixed(2)} g
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = '/products'}
            className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          <button
            onClick={handleEnquiryCart}
            disabled={isEnquiring}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isEnquiring ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting Enquiries...</span>
                </>
            ) : (
                <>
                    <Send className="h-5 w-5" />
                    <span>Enquiry My Cart</span>
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
