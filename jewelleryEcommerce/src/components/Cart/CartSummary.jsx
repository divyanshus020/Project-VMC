import React from 'react';
import { Send } from 'lucide-react';

const CartSummary = ({ 
  cartData, 
  cartItems, 
  onEnquiryCart, 
  isEnquiring,
  onContinueShopping 
}) => {
  const totalWeight = cartItems.reduce(
    (total, item) => total + (item.weight ? item.weight * item.quantity : 0), 
    0
  ).toFixed(2);

  return (
    <>
      {/* Cart Summary Section */}
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
                {totalWeight} g
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Continue Shopping
        </button>
        <button
          onClick={onEnquiryCart}
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
    </>
  );
};

export default CartSummary;