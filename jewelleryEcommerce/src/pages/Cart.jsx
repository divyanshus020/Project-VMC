import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { 
  ShoppingCart, 
  AlertCircle,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getDetailedCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  createEnquiry
} from '../lib/api';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantityMode, setQuantityMode] = useState('pieces');
  const [customQuantity, setCustomQuantity] = useState({});
  const [customWeight, setCustomWeight] = useState({});
  const [isEnquiring, setIsEnquiring] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to get a valid token from localStorage
  const getValidToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to access your cart');
      toast.error('Please log in to access your cart');
      return null;
    }
    return token;
  };

  // Fetches the detailed cart data from the API
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
      const errorMessage = err.message || 'Failed to load cart data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData();
  }, []);

  // Handles changing the quantity of a cart item
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const token = getValidToken();
    if (!token) return;

    try {
      const response = await updateCartItemQuantity(itemId, newQuantity, token);
      if (response.data?.success) {
        fetchCartData();
        toast.success('Quantity updated successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to update quantity');
      }
    } catch (err) {
      const errorMessage = 'Failed to update quantity. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      fetchCartData(); // Refetch to reset to original state
    }
  };

  // Handles removing an item from the cart with loading toast
  const handleRemoveItem = async (itemId) => {
    const token = getValidToken();
    if (!token) return;

    const toastId = toast.loading("Removing item..."); // Show loading toast

    try {
      await removeCartItem(itemId, token);
      fetchCartData();
      toast.update(toastId, { 
        render: "Item removed from cart", 
        type: "success", 
        isLoading: false, 
        autoClose: 2000 
      });
    } catch (err) {
      const errorMessage = 'Failed to remove item';
      setError(errorMessage);
      toast.update(toastId, { 
        render: errorMessage, 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  // Handles clearing the entire cart with loading toast
  // Allows disabling toast for internal calls (e.g., after enquiry)
  const handleClearCart = async (showToast = true) => { 
    const token = getValidToken();
    if (!token) return;

    const toastId = showToast ? toast.loading("Clearing cart...") : null;

    try {
      await clearCart(token);
      setCartItems([]);
      setCartData(prev => ({ ...prev, totalItems: 0 }));
      if (toastId) {
        toast.update(toastId, { 
          render: "Cart cleared successfully", 
          type: "success", 
          isLoading: false, 
          autoClose: 2000 
        });
      }
    } catch (err) {
      const errorMessage = 'Failed to clear cart';
      setError(errorMessage);
      if (toastId) {
        toast.update(toastId, { 
          render: errorMessage, 
          type: "error", 
          isLoading: false, 
          autoClose: 3000 
        });
      }
    }
  };

  // Handles submitting the cart as an enquiry
  const handleEnquiryCart = async () => {
  const token = getValidToken();
  if (!token || !cartData?.userId || cartItems.length === 0) {
    toast.error("Cannot submit enquiry. Cart is empty or user is not identified.");
    return;
  }

  setIsEnquiring(true);
  const toastId = toast.loading("Submitting your enquiry...");

  try {
    const enquiries = cartItems.map(item => ({
      productID: item.productId,
      userID: cartData.userId,
      quantity: item.quantity,
      sizeID: item.sizeId,
      tunch: item.tunch
    }));

    // ✅ Send all enquiries together
    const result = await createEnquiry({ enquiries }, token);

    if (!result.success) {
      throw new Error(result.message || "Some enquiries failed.");
    }

    toast.update(toastId, {
      render: 'Enquiry submitted successfully!',
      type: 'success',
      isLoading: false,
      autoClose: 4000
    });

    await handleClearCart(false);
    navigate('/orders');

  } catch (err) {
    const errorMessage = err.message || "An unexpected error occurred.";
    setError(errorMessage);
    toast.update(toastId, {
      render: errorMessage,
      type: 'error',
      isLoading: false,
      autoClose: 4000
    });
  } finally {
    setIsEnquiring(false);
  }
};


  // Handles navigation to the products page
  const handleContinueShopping = () => {
    navigate('/products'); // Use navigate for SPA-friendly routing
  };

  // --- JSX (Render logic) ---

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

  if (error && cartItems.length === 0) {
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
              onClick={handleContinueShopping}
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
                {cartData?.totalItems || 0} {cartData?.totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={() => handleClearCart(true)} // Pass true to show toast
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cart Items */}
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              quantityMode={quantityMode}
              setQuantityMode={setQuantityMode}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              customQuantity={customQuantity}
              setCustomQuantity={setCustomQuantity}
              customWeight={customWeight}
              setCustomWeight={setCustomWeight}
            />
          ))}
        </div>

        {/* Cart Summary and Actions */}
        <CartSummary
          cartData={cartData}
          cartItems={cartItems}
          onEnquiryCart={handleEnquiryCart}
          isEnquiring={isEnquiring}
          onContinueShopping={handleContinueShopping}
        />
      </div>
    </div>
  );
};

export default Cart;
