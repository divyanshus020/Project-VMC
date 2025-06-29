import React from 'react';
import QuantitySelector from './QuantitySelector';
import SizeSelector from './SizeSelector';
import WeightSelector from './WeightSelector';

const ProductInfo = ({ product }) => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-slate-800">{product.name}</h1>
    <p className="text-lg text-slate-600">Category: <span className="font-medium">{product.category}</span></p>
    
    <button className="px-6 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition">Enquire</button>
    
    <QuantitySelector quantities={product.quantities || []} />
    <WeightSelector weights={product.weights || []} />
    <SizeSelector sizes={product.sizes || []} />
    
    <div>
      <h2 className="text-xl font-semibold">Product Details</h2>
      <p className="text-md text-slate-700">Available Sizes: {product.sizes?.join(', ')}</p>
      <p className="text-md text-slate-700">Available Weights: {product.weights?.join(', ')}</p>
      <p className="text-md text-slate-700">Available Quantities: {product.quantities?.join(', ')}</p>
      {/* ...other fields as needed... */}
    </div>
  </div>
);

export default ProductInfo;
