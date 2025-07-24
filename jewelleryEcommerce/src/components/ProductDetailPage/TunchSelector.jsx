import React from 'react'

const TunchSelector = ({
  tunchValue,
  setTunchValue,
  customTunch,
  setCustomTunch
}) => {
  // Fixed tunch values
  const FIXED_TUNCH_VALUES = ['92.5', '90', '88.5', '84.5'];

  const handleFixedTunchSelect = (value) => {
    setTunchValue(value);
    setCustomTunch('');
  };

  const handleCustomTunchChange = (value) => {
    setCustomTunch(value);
    setTunchValue('');
  };

  return (
    <div className="space-y-4 border-t border-gray-100 pt-6">
      <label className="block text-sm font-semibold text-gray-700 uppercase">
        Tunch Value
      </label>
      
      {/* Fixed Tunch Values */}
      <div className="flex flex-wrap gap-3">
        {FIXED_TUNCH_VALUES.map((value) => (
          <button
            key={value}
            onClick={() => handleFixedTunchSelect(value)}
            className={`px-4 py-2 rounded-lg border-2 ${
              tunchValue === value && !customTunch
                ? 'border-amber-500 bg-amber-50 text-amber-700'
                : 'border-gray-200 hover:border-amber-300'
            } transition-colors`}
          >
            {value}%
          </button>
        ))}
      </div>

      {/* Custom Tunch Input */}
      <div className="mt-4">
        <label className="block text-sm text-gray-600 mb-2">
          Or enter custom value:
        </label>
        <input
          type="number"
          value={customTunch}
          onChange={(e) => handleCustomTunchChange(e.target.value)}
          placeholder="Enter custom tunch value"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
          min="0"
          max="100"
          step="0.1"
        />
      </div>
    </div>
  )
}

export default TunchSelector