import React from 'react';

const QuantitySelector = ({
  quantity,
  setQuantity,
  quantityMode,
  setQuantityMode,
  customWeight,
  setCustomWeight,
  selectedSize
}) => {
  // Calculates the number of pieces from a target weight and the weight of a single piece.
  const calculateQuantityFromWeight = (targetWeight, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 1;
    return Math.max(1, Math.round(targetWeight / pieceWeight));
  };

  // Calculates the total weight from a quantity and the weight of a single piece.
  const calculateWeightFromQuantity = (pieceCount, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 0;
    return (pieceCount * pieceWeight).toFixed(3);
  };

  // Handles changes to the quantity input (by pieces).
  const handleQuantityChange = (newQuantity) => {
    const clampedQuantity = Math.max(1, newQuantity);
    setQuantity(clampedQuantity);
    if (selectedSize?.weight) {
      const newWeight = calculateWeightFromQuantity(clampedQuantity, selectedSize.weight);
      setCustomWeight(newWeight);
    }
  };

  // Handles changes to the weight input.
  const handleWeightChange = (newWeight) => {
    const targetWeight = newWeight >= 0 ? newWeight : 0;
    setCustomWeight(targetWeight.toString());
    if (selectedSize?.weight) {
      const newQuantity = calculateQuantityFromWeight(targetWeight, selectedSize.weight);
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main container for the two selection modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

        {/* --- Order by Pieces --- */}
        <div
          className={`p-4 border-2 rounded-xl transition-all duration-300 ${
            quantityMode === 'pieces' ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="mode-pieces"
              name="quantityMode"
              value="pieces"
              checked={quantityMode === 'pieces'}
              onChange={() => setQuantityMode('pieces')}
              className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="mode-pieces" className="ml-3 block text-sm font-semibold text-gray-800 uppercase cursor-pointer">
              By Pieces
            </label>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantityMode !== 'pieces'}
              className="w-12 h-12 border-2 rounded-full flex items-center justify-center text-xl font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-300 hover:border-amber-500"
            >−</button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => handleQuantityChange(parseInt(e.target.value) || 1)}
              disabled={quantityMode !== 'pieces'}
              className="w-20 text-center border-2 rounded-xl py-2 font-bold text-lg transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-200 focus:border-amber-500"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantityMode !== 'pieces'}
              className="w-12 h-12 border-2 rounded-full flex items-center justify-center text-xl font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-300 hover:border-amber-500"
            >+</button>
          </div>
          {selectedSize?.weight > 0 && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Estimated weight: <strong>{calculateWeightFromQuantity(quantity, selectedSize.weight)}g</strong>
            </p>
          )}
        </div>

        {/* --- Order by Weight --- */}
        <div
          className={`p-4 border-2 rounded-xl transition-all duration-300 ${
            quantityMode === 'weight' ? 'border-amber-500 bg-amber-50 shadow-lg' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="mode-weight"
              name="quantityMode"
              value="weight"
              checked={quantityMode === 'weight'}
              onChange={() => setQuantityMode('weight')}
              className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="mode-weight" className="ml-3 block text-sm font-semibold text-gray-800 uppercase cursor-pointer">
              By Weight
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0"
              step="0.1"
              value={customWeight}
              onChange={(e) => handleWeightChange(parseFloat(e.target.value))}
              placeholder="Enter total weight"
              disabled={quantityMode !== 'weight'}
              className="w-full px-4 py-3 border-2 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-200 focus:border-amber-500"
            />
            <span className="text-sm font-semibold text-gray-500">g</span>
          </div>
          {selectedSize?.weight > 0 && (
            <p className="text-sm text-gray-600 mt-3 text-center">
              Calculated pieces: <strong>{quantity}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Information Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">How it works:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Select your preferred ordering method: by piece count or by total weight.</li>
              <li>The other value will be calculated automatically based on the piece weight of <strong>{selectedSize?.weight || '0.000'}g</strong>.</li>
              <li>Weight is rounded to the nearest whole piece. Minimum order is 1 piece.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
