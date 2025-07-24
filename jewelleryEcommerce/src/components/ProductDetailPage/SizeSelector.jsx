import React from 'react'

const SizeSelector = ({ 
  displayProduct, 
  selectedSize, 
  onSizeChange,
  tunchValue,
  customTunch 
}) => {
  /**
   * Handles changes to any size attribute dropdown.
   * It finds the best matching size configuration based on the user's selection.
   * @param {string} attribute - The attribute that was changed (e.g., 'dieNo', 'diameter').
   * @param {string} value - The new value of the attribute.
   */
  const handleAttributeChange = (attribute, value) => {
    // Find all sizes that match the newly selected attribute value
    const matches = displayProduct.sizes.filter(s => s[attribute] == value)

    // Case 1: Exactly one match is found. This is the ideal scenario.
    if (matches.length === 1) {
      onSizeChange(matches[0])
    } 
    // Case 2: Multiple matches found. We need to find the "best" one.
    else if (matches.length > 1) {
      let bestMatch = matches[0];
      // Define all attributes that can be used for matching
      const allAttributes = ['dieNo', 'diameter', 'ballGauge', 'wireGauge', 'weight'];
      const otherAttrs = allAttributes.filter(a => a !== attribute);
      let maxMatchScore = -1;

      // Score each match based on how many of its other attributes align with the currently selected size
      matches.forEach(match => {
        let currentScore = 0;
        otherAttrs.forEach(attr => {
          if (selectedSize?.[attr] && match[attr] === selectedSize[attr]) {
            currentScore++;
          }
        });

        if (currentScore > maxMatchScore) {
          maxMatchScore = currentScore;
          bestMatch = match;
        }
      });
      onSizeChange(bestMatch);
    } 
    // Case 3: No matches found (e.g., user selected "Select...").
    else {
      onSizeChange(null);
    }
  }

  // Handle cases where a product has no sizes defined
  if (!displayProduct.sizes || displayProduct.sizes.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">No sizes available for this product.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 border-b border-gray-100 pb-6">
      <h3 className="text-xl font-bold text-gray-800">
        Select Configuration
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Die No Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase">Die No</label>
          <select
            value={selectedSize?.dieNo || ''}
            onChange={e => handleAttributeChange('dieNo', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          >
            <option value="">Select Die No</option>
            {[...new Set(displayProduct.sizes.map(s => s.dieNo))].sort().map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Diameter Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase">Diameter</label>
          <select
            value={selectedSize?.diameter || ''}
            onChange={e => handleAttributeChange('diameter', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          >
            <option value="">Select Diameter</option>
            {[...new Set(displayProduct.sizes.map(s => s.diameter))].sort((a, b) => a - b).map(d => (
              <option key={d} value={d}>{d}mm</option>
            ))}
          </select>
        </div>

        {/* Ball Gauge Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase">Ball Gauge</label>
          <select
            value={selectedSize?.ballGauge || ''}
            onChange={e => handleAttributeChange('ballGauge', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          >
            <option value="">Select Ball Gauge</option>
            {[...new Set(displayProduct.sizes.map(s => s.ballGauge))].sort((a, b) => a - b).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Wire Gauge Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase">Wire Gauge</label>
          <select
            value={selectedSize?.wireGauge || ''}
            onChange={e => handleAttributeChange('wireGauge', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          >
            <option value="">Select Wire Gauge</option>
            {[...new Set(displayProduct.sizes.map(s => s.wireGauge))].sort((a, b) => a - b).map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Weight Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 uppercase">Weight</label>
          <select
            value={selectedSize?.weight || ''}
            onChange={e => handleAttributeChange('weight', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          >
            <option value="">Select Weight</option>
            {[...new Set(displayProduct.sizes.map(s => s.weight))].sort((a, b) => a - b).map(wt => (
              <option key={wt} value={wt}>{wt}g</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Configuration Summary */}
      {selectedSize && (
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 mt-4">
          <div className="flex items-center mb-2 text-amber-800 font-semibold">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Selected Configuration
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs text-amber-700">
            <div><strong>Size ID:</strong> {selectedSize.id || selectedSize.sizeId || 'N/A'}</div>
            <div><strong>Die:</strong> {selectedSize.dieNo}</div>
            <div><strong>Diameter:</strong> {selectedSize.diameter}mm</div>
            <div><strong>Ball:</strong> {selectedSize.ballGauge}</div>
            <div><strong>Tunch:</strong> {(customTunch || tunchValue)}%</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeSelector
