import React, { useState } from 'react';
import SizeSelector from './SizeSelector';
import WeightSelector from './WeightSelector';

// Static options for different categories
const OTHER_SIZES = ['Small', 'Medium', 'Large'];
const OTHER_WEIGHTS = ['5g', '10g', '15g'];

// Cap size options for Mala
const CAP_SIZE_OPTIONS = [
  '43 No CAP MALA',
  '42 No CAP MALA',
  '22 No CAP MALA',
  '21 No CAP MALA',
  '19 No CAP MALA',
  '17 No CAP MALA',
  '15 No CAP MALA',
  '12 No CAP MALA',
  '11 No CAP MALA',
  '10 No CAP MALA',
  '8 No CAP MALA',
  '5 No CAP MALA',
];

// Mala-specific weight/mm/pcs options
const MALA_WEIGHT_OPTIONS = [
  { weight: '8 - 9 gm', mm: '3 mm', pcs: '80 - 85 Pcs' },
  { weight: '9 - 10 gm', mm: '3 mm', pcs: '75 - 80 Pcs' },
  { weight: '10 - 11 gm', mm: '3.5 mm', pcs: '75 - 80 Pcs' },
  { weight: '12 - 13 gm', mm: '3.5 mm', pcs: '75 - 80 Pcs' },
  { weight: '14 - 15 gm', mm: '4 mm', pcs: '65 - 70 Pcs' },
  { weight: '16 - 17 gm', mm: '4.5 mm', pcs: '65 - 70 Pcs' },
  { weight: '18 - 19 gm', mm: '5 mm', pcs: '57 - 62 Pcs' },
  { weight: '20 gm', mm: '5 mm', pcs: '54 - 60 Pcs' },
  { weight: '21 - 22 gm', mm: '5.5 mm', pcs: '54 - 58 Pcs' },
  { weight: '24 - 25 gm', mm: '6 mm', pcs: '50 - 52 Pcs' },
  { weight: '28 - 29 gm', mm: '7 mm', pcs: '45 - 48 Pcs' },
  { weight: '31 - 32 gm', mm: '7.5 mm', pcs: '40 - 45 Pcs' },
];

const ProductInfo = ({ product }) => {
  const isMala = product.category?.toLowerCase() === 'mala';
  const [selectedWeightIdx, setSelectedWeightIdx] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
      <p className="text-lg text-slate-600">
        Category: <span className="font-medium">{product.category}</span>
      </p>

      <button className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">Enquire</button>

      {isMala ? (
        <div className="space-y-4">
          {/* Cap Size Selector */}
          <div>
            <label className="block font-medium mb-1">Cap Size</label>
            <select className="border rounded px-3 py-2 w-full">
              <option value="">Select Cap Size</option>
              {CAP_SIZE_OPTIONS.map((size, idx) => (
                <option key={idx} value={size}>{size}</option>
              ))}
            </select>
          </div>
          {/* Weight Selector */}
          <div>
            <label className="block font-medium mb-1">Weight</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedWeightIdx}
              onChange={e => setSelectedWeightIdx(e.target.value)}
            >
              <option value="">Select Weight</option>
              {MALA_WEIGHT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx}>{opt.weight}</option>
              ))}
            </select>
          </div>
          {/* Tulsi/Rudraksh mm Selector */}
          <div>
            <label className="block font-medium mb-1">Tulsi / Rudraksh mm</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedWeightIdx}
              onChange={e => setSelectedWeightIdx(e.target.value)}
            >
              <option value="">Select mm</option>
              {MALA_WEIGHT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx}>{opt.mm}</option>
              ))}
            </select>
          </div>
          {/* Est. Pcs Selector */}
          <div>
            <label className="block font-medium mb-1">Est. Pcs</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={selectedWeightIdx}
              onChange={e => setSelectedWeightIdx(e.target.value)}
            >
              <option value="">Select Est. Pcs</option>
              {MALA_WEIGHT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx}>{opt.pcs}</option>
              ))}
            </select>
          </div>
          {/* Quantity Input */}
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter quantity"
            />
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block font-medium mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              className="border rounded px-3 py-2 w-full"
              placeholder="Enter quantity"
            />
          </div>
          <WeightSelector weights={OTHER_WEIGHTS} />
          <SizeSelector sizes={OTHER_SIZES} />
        </>
      )}
    </div>
  );
};

export default ProductInfo;
