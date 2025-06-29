import React from 'react';

const SizeSelector = ({ sizes }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
      <select className="w-full px-4 py-2 border rounded-md">
        {sizes.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    </div>
  );
};

export default SizeSelector;
