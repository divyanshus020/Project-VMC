import React from 'react';

const QuantitySelector = ({ quantities = [] }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
      <select className="w-full px-4 py-2 border rounded-md">
        {quantities.map(q => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
    </div>
  );
};

export default QuantitySelector;
