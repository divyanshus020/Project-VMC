import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, ShoppingBag } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  getDetailedCart, 
  updateCartItemQuantity, 
  removeCartItem, 
  clearCart, 
  createEnquiry,
  updateCartItemTunch
  // Removed updateCartItemDieNo import
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
  const navigate = useNavigate();

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

  // Handles updating tunch of a cart item
  const handleUpdateTunch = async (itemId, tunch) => {
    const token = getValidToken();
    if (!token) return;

    try {
      const response = await updateCartItemTunch(itemId, tunch, token);
      if (response.data?.success) {
        fetchCartData();
        toast.success('Tunch updated successfully');
      } else {
        throw new Error(response.data?.message || 'Failed to update tunch');
      }
    } catch (err) {
      const errorMessage = 'Failed to update tunch. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      fetchCartData(); // Refetch to reset to original state
    }
  };

  // Removed handleUpdateDieNo function

  // Handles removing an item from the cart with loading toast
  const handleRemoveItem = async (itemId) => {
    const token = getValidToken();
    if (!token) return;

    const toastId = toast.loading("Removing item...");

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
    navigate('/products');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCartData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <button
            onClick={handleContinueShopping}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Main cart view
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your items before submitting your enquiry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  onUpdateTunch={handleUpdateTunch}
                  // Removed onUpdateDieNo prop
                  customQuantity={customQuantity}
                  setCustomQuantity={setCustomQuantity}
                  customWeight={customWeight}
                  setCustomWeight={setCustomWeight}
                />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              cartData={cartData}
              cartItems={cartItems}
              onEnquiryCart={handleEnquiryCart}
              isEnquiring={isEnquiring}
              onContinueShopping={handleContinueShopping}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
