import React from 'react';

const WeightSelector = ({ weights }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
      <select className="w-full px-4 py-2 border rounded-md">
        {weights.map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>
    </div>
  );
};

export default WeightSelector;
