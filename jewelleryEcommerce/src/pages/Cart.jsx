import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';
import EmptyCart from '../components/Cart/EmptyCart';
import CartHeader from '../components/Cart/CartHeader';

// Simple localStorage cart utility
const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const setCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  // Remove item from cart
  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    setCart(updated);
  };

  // Update quantity
  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: qty } : item
    );
    setCartItems(updated);
    setCart(updated);
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setIsPromoApplied(false);
    setPromoCode('');
  };

  const applyPromoCode = () => {
    const code = promoCodes[promoCode.toUpperCase()];
    const subtotal = calculateSubtotal();
    
    if (code && subtotal >= code.minAmount) {
      const discountAmount = code.type === 'percentage' 
        ? (subtotal * code.discount) / 100
        : code.discount;
      
      setDiscount(discountAmount);
      setIsPromoApplied(true);
    } else {
      setDiscount(0);
      setIsPromoApplied(false);
      // You could show an error message here
    }
  };

  const removePromoCode = () => {
    setDiscount(0);
    setIsPromoApplied(false);
    setPromoCode('');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((total, item) => {
      const itemSavings = (item.originalPrice - item.price) * item.quantity;
      return total + itemSavings;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 999 ? 0 : 99;
    return subtotal + shipping - discount;
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart onContinueShopping={handleContinueShopping} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CartHeader 
          itemCount={cartItems.length}
          onClearCart={clearCart}
          onContinueShopping={handleContinueShopping}
        />

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Shopping Cart ({cartItems.length} items)
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    isLast={index === cartItems.length - 1}
                  />
                ))}
              </div>

              {/* Promo Code Section */}
              <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      disabled={isPromoApplied}
                    />
                  </div>
                  <div className="flex gap-2">
                    {!isPromoApplied ? (
                      <button
                        onClick={applyPromoCode}
                        className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Apply
                      </button>
                    ) : (
                      <button
                        onClick={removePromoCode}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                {isPromoApplied && (
                  <div className="mt-2 text-green-600 text-sm font-medium">
                    ✓ Promo code applied successfully!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Summary Section */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <CartSummary
              subtotal={calculateSubtotal()}
              savings={calculateSavings()}
              discount={discount}
              total={calculateTotal()}
              itemCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
              onCheckout={handleCheckout}
              isPromoApplied={isPromoApplied}
              promoCode={promoCode}
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Checkout</h3>
            <p className="text-gray-600 text-sm">256-bit SSL encryption</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">30-day return policy</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders over ₹999</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;