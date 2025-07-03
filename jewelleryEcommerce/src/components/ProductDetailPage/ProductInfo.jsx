import React, { useState, useEffect } from 'react';
import { getProductOptions } from '../../lib/api';

const ProductInfo = ({ product }) => {
  const isMala = product.category?.toLowerCase() === 'mala';
  const [capSizeOptions, setCapSizeOptions] = useState([]);
  const [malaWeightOptions, setMalaWeightOptions] = useState([]);
  const [mmOptions, setMmOptions] = useState([]);
  const [pcsOptions, setPcsOptions] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedCapSize, setSelectedCapSize] = useState('');
  const [selectedMm, setSelectedMm] = useState('');
  const [selectedPcs, setSelectedPcs] = useState('');
  const [quantity, setQuantity] = useState(1);

  // For non-mala
  const [diameterOptions, setDiameterOptions] = useState([]);
  const [ballGaugeOptions, setBallGaugeOptions] = useState([]);
  const [wireGaugeOptions, setWireGaugeOptions] = useState([]);
  const [otherWeightOptions, setOtherWeightOptions] = useState([]);
  const [selectedDiameter, setSelectedDiameter] = useState('');
  const [selectedBallGauge, setSelectedBallGauge] = useState('');
  const [selectedWireGauge, setSelectedWireGauge] = useState('');
  const [selectedOtherWeight, setSelectedOtherWeight] = useState('');

  useEffect(() => {
    // Fetch options from API
    const fetchOptions = async () => {
      try {
        const res = await getProductOptions();
        setCapSizeOptions(res.data.capSizes || []);
        setMalaWeightOptions(res.data.malaWeights || []);
        setMmOptions(res.data.tulsiRudrakshMM || []);
        setPcsOptions(res.data.tulsiRudrakshEstPcs || []);
        setDiameterOptions(res.data.diameters || []);
        setBallGaugeOptions(res.data.ballGauges || []);
        setWireGaugeOptions(res.data.wireGauges || []);
        setOtherWeightOptions(res.data.otherWeights || []);
      } catch (err) {
        setCapSizeOptions([]);
        setMalaWeightOptions([]);
        setMmOptions([]);
        setPcsOptions([]);
        setDiameterOptions([]);
        setBallGaugeOptions([]);
        setWireGaugeOptions([]);
        setOtherWeightOptions([]);
      }
    };
    fetchOptions();
  }, []);

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { product, quantity, selectedWeight, selectedCapSize });
  };

  const handleEnquire = () => {
    // Enquire logic here
    console.log('Enquire about:', product);
  };

  const selectStyles = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 bg-white text-gray-800 font-medium appearance-none cursor-pointer max-h-48 overflow-y-auto";

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
      {/* Product Header */}
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category:</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Options */}
      {isMala ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Customize Your Mala</h3>
          
          {/* Cap Size Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Cap Size
            </label>
            <div className="relative">
              <select 
                className={selectStyles}
                value={selectedCapSize}
                onChange={e => setSelectedCapSize(e.target.value)}
                size="1"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Cap Size</option>
                {capSizeOptions.map((size, idx) => (
                  <option key={idx} value={size} className="py-2 px-4 hover:bg-amber-50">
                    {size}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Weight Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Weight
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedWeight}
                onChange={e => setSelectedWeight(e.target.value)}
                size="1"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Weight</option>
                {malaWeightOptions.map((weight, idx) => (
                  <option key={idx} value={weight} className="py-2 px-4 hover:bg-amber-50">
                  {weight}
                  </option>
                ))} 
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tulsi/Rudraksh mm Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Tulsi / Rudraksh Size (mm)
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedMm}
                onChange={e => setSelectedMm(e.target.value)}
                size="1"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Size</option>
                {mmOptions.map((mm, idx) => (
                  <option key={idx} value={mm} className="py-2 px-4 hover:bg-amber-50">
                    {mm}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Est. Pcs Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Estimated Pieces
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedPcs}
                onChange={e => setSelectedPcs(e.target.value)}
                size="1"
                style={{ 
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Pieces</option>
                {pcsOptions.map((pcs, idx) => (
                  <option key={idx} value={pcs} className="py-2 px-4 hover:bg-amber-50">
                    {pcs}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Options</h3>
          {/* Diameter Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Diameter
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedDiameter}
                onChange={e => setSelectedDiameter(e.target.value)}
                size="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Diameter</option>
                {diameterOptions.map((diameter, idx) => (
                  <option key={idx} value={diameter} className="py-2 px-4 hover:bg-amber-50">
                    {diameter}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Ball Gauge Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Ball Gauge
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedBallGauge}
                onChange={e => setSelectedBallGauge(e.target.value)}
                size="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Ball Gauge</option>
                {ballGaugeOptions.map((gauge, idx) => (
                  <option key={idx} value={gauge} className="py-2 px-4 hover:bg-amber-50">
                    {gauge}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Wire Gauge Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Wire Gauge
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedWireGauge}
                onChange={e => setSelectedWireGauge(e.target.value)}
                size="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Wire Gauge</option>
                {wireGaugeOptions.map((gauge, idx) => (
                  <option key={idx} value={gauge} className="py-2 px-4 hover:bg-amber-50">
                    {gauge}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Other Weight Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Other Weight
            </label>
            <div className="relative">
              <select
                className={selectStyles}
                value={selectedOtherWeight}
                onChange={e => setSelectedOtherWeight(e.target.value)}
                size="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#D97706 #F3F4F6'
                }}
              >
                <option value="">Choose Weight</option>
                {otherWeightOptions.map((weight, idx) => (
                  <option key={idx} value={weight} className="py-2 px-4 hover:bg-amber-50">
                    {weight}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Quantity
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all duration-200"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 px-4 py-3 border-2 border-gray-200 rounded-xl text-center font-bold text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-200 "
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-600 hover:border-amber-500 hover:text-amber-600 transition-all duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 group relative overflow-hidden bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h7a2 2 0 002-2v-0" />
            </svg>
            <span>Add to Cart</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
        
        <button
          onClick={handleEnquire}
          className="flex-1 group relative overflow-hidden bg-white border-2 border-amber-600 text-amber-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Enquire Now</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          <span className="absolute inset-0 flex items-center justify-center space-x-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Enquire Now</span>
          </span>
        </button>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800 mb-1">
              Premium Quality Guarantee
            </p>
            <p className="text-xs text-amber-700">
              All our jewelry pieces are crafted with authentic materials and come with quality assurance. 
              Free customization available for bulk orders.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Authentic</span>
        </div>
        
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Handcrafted</span>
        </div>
      </div>

      {/* Custom CSS for better scrollbar styling */}
      <style jsx>{`
        select::-webkit-scrollbar {
          width: 8px;
        }
        
        select::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        
        select::-webkit-scrollbar-thumb {
          background: #d97706;
          border-radius: 4px;
        }
        
        select::-webkit-scrollbar-thumb:hover {
          background: #b45309;
        }
        
        select option {
          padding: 8px 12px;
          background-color: white;
          color: #374151;
        }
        
        select option:hover {
          background-color: #fef3c7;
        }
        
        select option:checked {
          background-color: #d97706;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default ProductInfo;

