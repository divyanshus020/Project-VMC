import React from 'react'

const QuantitySelector = ({
  quantity,
  setQuantity,
  quantityMode,
  setQuantityMode,
  customWeight,
  setCustomWeight,
  selectedSize
}) => {
  const calculateQuantityFromWeight = (targetWeight, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 1;
    return Math.max(1, Math.round(targetWeight / pieceWeight));
  };

  const handleQuantityModeChange = (mode) => {
    setQuantityMode(mode);
    setCustomWeight('');
  };

  const handleWeightChange = (targetWeight) => {
    setCustomWeight(targetWeight);
    if (selectedSize?.weight) {
      const calculatedQuantity = calculateQuantityFromWeight(targetWeight, selectedSize.weight);
      setQuantity(calculatedQuantity);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700 uppercase">
          Order By
        </label>
        <select
          value={quantityMode}
          onChange={(e) => handleQuantityModeChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1"
        >
          <option value="pieces">Pieces</option>
          <option value="weight">Weight</option>
        </select>
      </div>

      {quantityMode === 'pieces' ? (
        // Pieces Quantity Selector
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center text-xl"
            >−</button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center border-2 border-gray-200 rounded-xl py-2"
            />
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center text-xl"
            >+</button>
          </div>
          {selectedSize?.weight && (
            <p className="text-sm text-gray-600">
              Total weight: {(selectedSize.weight * quantity).toFixed(3)}g
            </p>
          )}
        </div>
      ) : (
        // Weight-based Quantity Selector
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={customWeight}
              onChange={(e) => {
                const targetWeight = parseFloat(e.target.value) || 0;
                handleWeightChange(targetWeight);
              }}
              placeholder="Enter total weight in grams"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
            />
            <span className="text-sm text-gray-500">g</span>
          </div>
          {selectedSize?.weight && (
            <p className="text-sm text-gray-600">
              Calculated pieces: {quantity} ({selectedSize.weight}g each)
            </p>
          )}
        </div>
      )}

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex space-x-2">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">How it works:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>By Pieces:</strong> Directly specify the number of items you want</li>
              <li><strong>By Weight:</strong> Enter your desired total weight, and we'll calculate the appropriate number of pieces</li>
              <li>Each piece weighs {selectedSize?.weight || '0.000'}g</li>
              <li>Minimum order: 1 piece</li>
              <li>Weight will be automatically rounded to the nearest whole piece</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuantitySelector