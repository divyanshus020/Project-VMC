import React, { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove, isLast }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.maxQuantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.id);
      setShowRemoveConfirm(false);
      setIsRemoving(false);
    }, 300);
  };

  const cancelRemove = () => {
    setShowRemoveConfirm(false);
  };

  const discountPercentage = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <>
      <div className={`p-6 transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl border border-gray-200"
              />
              {!item.inStock && (
                <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              {discountPercentage > 0 && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium">
                    {item.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                    {item.weight}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                    Size: {item.size}
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Remove item"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            {/* Price and Quantity Row */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                {item.originalPrice > item.price && (
                  <span className="text-lg text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.maxQuantity}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 text-center py-2 border-0 focus:ring-0 focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  Max: {item.maxQuantity}
                </span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>

            {/* Stock Status */}
            {!item.inStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">
                    This item is currently out of stock and will be removed during checkout.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Item</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove "{item.name}" from your cart?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelRemove}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      {!isLast && <div className="border-b border-gray-200"></div>}
    </>
  );
};

export default CartItem;
