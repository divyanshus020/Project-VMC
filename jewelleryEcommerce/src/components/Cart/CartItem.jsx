import React, { useState } from 'react';
import { 
  Minus, 
  Plus, 
  Trash2, 
  Package,
  Ruler,
  Weight,
  Hash,
  Percent
} from 'lucide-react';

const CartItem = ({ 
  item, 
  quantityMode, 
  setQuantityMode, 
  onQuantityChange, 
  onRemove,
  customQuantity,
  setCustomQuantity,
  customWeight,
  setCustomWeight
}) => {
  const calculateQuantityFromWeight = (targetWeight, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 1;
    return Math.max(1, Math.round(targetWeight / pieceWeight));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                    onClick={() => onRemove(item.id)}
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
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
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
                            onQuantityChange(item.id, val);
                          }}
                          className="w-16 text-center border-x border-gray-300 py-2 font-medium"
                        />
                        <button
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
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
                            onQuantityChange(item.id, newQty);
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
  );
};

export default CartItem;