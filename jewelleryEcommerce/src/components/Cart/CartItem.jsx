import React, { useState } from 'react';
import { Minus, Plus, Trash2, Package, Ruler, Weight, Hash, Percent, Edit3, Check, X } from 'lucide-react';

const CartItem = ({ 
  item, 
  onQuantityChange, 
  onRemove,
  onUpdateTunch,
  customQuantity, 
  setCustomQuantity, 
  customWeight, 
  setCustomWeight 
}) => {
  const [isEditingTunch, setIsEditingTunch] = useState(false);
  const [editTunch, setEditTunch] = useState(item.tunch || '');
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveTunch = () => {
    if (editTunch !== item.tunch) {
      onUpdateTunch(item.id, editTunch);
    }
    setIsEditingTunch(false);
  };

  const handleCancelTunch = () => {
    setEditTunch(item.tunch || '');
    setIsEditingTunch(false);
  };

  const incrementQuantity = () => {
    onQuantityChange(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.quantity - 1);
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 transition-all duration-300 hover:shadow-xl hover:border-blue-200 ${
        isHovered ? 'transform -translate-y-1' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with gradient background */}
      <div className="flex justify-between items-start mb-6 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {item.productName || 'Product'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Hash className="w-4 h-4" />
              <span className="font-medium">ID: {item.productId}</span>
            </div>
          </div>
        </div>
        
        {/* Remove button with hover effect */}
        <button
          onClick={() => onRemove(item.id)}
          className="group p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
          title="Remove Item"
        >
          <Trash2 className="w-5 h-5 group-hover:animate-pulse" />
        </button>
      </div>

      {/* Specifications Grid with modern cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Die Number Card */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-4 h-4 text-gray-600" />
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Die No</span>
          </div>
          <div className="text-sm font-bold text-gray-800">{item.DieNo || 'N/A'}</div>
        </div>

        {/* Diameter Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600"></div>
            <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">Diameter</span>
          </div>
          <div className="text-sm font-bold text-blue-800">{item.diameter || 0}mm</div>
        </div>

        {/* Ball Gauge Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-xs font-medium text-green-700 uppercase tracking-wide">Ball Gauge</span>
          </div>
          <div className="text-sm font-bold text-green-800">{item.ballGauge || 0} BG</div>
        </div>

        {/* Wire Gauge Card */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-1 bg-purple-600 rounded-full"></div>
            <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Wire Gauge</span>
          </div>
          <div className="text-sm font-bold text-purple-800">{item.wireGauge || 0} WG</div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quantity Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700">Quantity</span>
          </div>
          <div className="flex items-center bg-gray-50 rounded-xl p-1">
            <button
              onClick={decrementQuantity}
              disabled={item.quantity <= 1}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="flex-1 text-center font-bold text-lg text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tunch Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-gray-700">Tunch</span>
          </div>
          <div className="relative">
            {isEditingTunch ? (
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                <select
                  value={editTunch}
                  onChange={(e) => setEditTunch(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border-0 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Tunch</option>
                  <option value="92.5">92.5%</option>
                  <option value="90">90%</option>
                  <option value="88.5">88.5%</option>
                  <option value="84.5">84.5%</option>
                </select>
                <button
                  onClick={handleSaveTunch}
                  className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-all duration-200"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelTunch}
                  className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <span className="font-bold text-amber-700">
                  {item.tunch ? `${item.tunch}%` : 'N/A'}
                </span>
                <button
                  onClick={() => setIsEditingTunch(true)}
                  className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200 group"
                  title="Edit Tunch"
                >
                  <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Weight Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Weight className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-700">Unit Weight</span>
            {item.isCustomWeight && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Custom
              </span>
            )}
          </div>
          <div className={`rounded-xl p-3 border ${
            item.isCustomWeight 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <span className={`font-bold ${
              item.isCustomWeight ? 'text-blue-800' : 'text-emerald-800'
            }`}>
              {item.weight ? `${item.weight} g` : 'N/A'}
            </span>
            {item.isCustomWeight && (
              <div className="text-xs text-blue-600 mt-1 font-medium">
                User Selected Weight
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Total Weight Section with emphasis */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Weight className="w-5 h-5 text-blue-200" />
              <span className="font-semibold">Total Weight</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold">
                {item.isCustomWeight && item.totalWeight 
                  ? `${parseFloat(item.totalWeight).toFixed(3)}g` 
                  : item.weight 
                    ? `${(item.weight * item.quantity).toFixed(3)}g` 
                    : 'N/A'
                }
              </span>
              {item.isCustomWeight && (
                <div className="text-xs text-blue-200 mt-1">
                  (user choice)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover overlay effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl pointer-events-none transition-opacity duration-300" />
      )}
    </div>
  );
};

export default CartItem;
