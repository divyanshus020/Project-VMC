import React, { useState } from 'react'
import { addToCart, createEnquiry } from '../../lib/api'
import { jwtDecode } from 'jwt-decode'

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isEnquiring, setIsEnquiring] = useState(false)
  const [tunchValue, setTunchValue] = useState('92.5'); // Default to 92.5
  const [customTunch, setCustomTunch] = useState('');
  const [quantityMode, setQuantityMode] = useState('pieces'); // 'pieces' or 'weight'
  const [customWeight, setCustomWeight] = useState('');

  // Add the fixed tunch values
  const FIXED_TUNCH_VALUES = ['92.5', '90', '88.5', '84.5'];

  // Updated getUserIdFromToken function
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken')
      if (!token) {
        console.error('No token found in localStorage');
        return null;
      }

      // Try to decode JWT token
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        // Try different possible user ID fields in the token
        const userId = decoded.userId || decoded.id || decoded.user_id || decoded.sub;
        if (userId) {
          console.log('Found user ID in token:', userId);
          return userId;
        }
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
      }

      // Fallback: Try to get user data from localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          const userId = user.id || user.userId || user.user_id;
          if (userId) {
            console.log('Found user ID in userData:', userId);
            return userId;
          }
        } catch (parseError) {
          console.error('Error parsing userData:', parseError);
        }
      }
      
      // Try to get user info from another storage key
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          const userId = user.id || user.userId || user.user_id;
          if (userId) {
            console.log('Found user ID in userInfo:', userId);
            return userId;
          }
        } catch (parseError) {
          console.error('Error parsing userInfo:', parseError);
        }
      }

      // Debug: Log all localStorage keys to help identify where user data might be stored
      console.log('Available localStorage keys:', Object.keys(localStorage));
      
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken')
    if (!token) {
      alert('Please login to add items to cart')
      return
    }
    if (!product?.id) {
      alert('Product information is missing')
      return
    }
    if (!selectedSize) {
      alert('Please select a size before adding to cart')
      return
    }

    // Get the final tunch value (either fixed or custom)
    const finalTunch = customTunch || tunchValue;
    
    // Validate tunch value
    const tunchNum = parseFloat(finalTunch);
    if (isNaN(tunchNum) || tunchNum <= 0 || tunchNum > 100) {
      alert('Please enter a valid tunch value between 0 and 100');
      return;
    }

    // pick the correct keys for DieNo and weight
    const dieNo =
      selectedSize.dieNo ||
      selectedSize.DieNo ||
      selectedSize.die_no ||
      null
    const weight =
      selectedSize.weight ||
      selectedSize.Weight ||
      selectedSize.weight_g ||
      null

    if (!dieNo) {
      console.warn('⚠️ missing dieNo on selectedSize:', selectedSize)
      alert('Could not read Die Number from configuration')
      return
    }
    if (!weight) {
      console.warn('⚠️ missing weight on selectedSize:', selectedSize)
      alert('Could not read Weight from configuration')
      return
    }

    const cartData = {
      productId: product.id,
      sizeId: selectedSize.id || selectedSize.sizeId,
      quantity: Number(quantity),
      DieNo: dieNo,
      weight: weight,
      tunch: tunchNum,
      totalWeight: quantityMode === 'weight' ? parseFloat(customWeight) : weight * quantity
    }

    setIsAddingToCart(true)
    try {
      console.debug('Adding to cart:', cartData)
      const response = await addToCart(cartData, token)
      if (response.success) {
        alert('Product added to cart successfully!')
      } else {
        console.error('Unexpected response:', response)
        alert('Failed to add product to cart')
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      if (err.response?.status === 401) {
        alert('Session expired. Please login again.')
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || 'Invalid request')
      } else {
        alert('Failed to add product to cart. Please try again.')
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleEnquire = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken')
    if (!token) {
      alert('Please login to make an enquiry')
      return
    }
    if (!product?.id) {
      alert('Product information is missing')
      return
    }
    if (!selectedSize) {
      alert('Please select a size configuration before making an enquiry')
      return
    }

    // Get the final tunch value (either fixed or custom)
    const finalTunch = customTunch || tunchValue;
    
    // Validate tunch value
    const tunchNum = parseFloat(finalTunch);
    if (isNaN(tunchNum) || tunchNum <= 0 || tunchNum > 100) {
      alert('Please enter a valid tunch value between 0 and 100');
      return;
    }

    // Get user ID from token
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('Unable to identify user. Please login again.');
      console.error('Could not extract user ID from token or localStorage');
      return;
    }

    const enquiryData = {
      productID: product.id,
      userID: userId,
      quantity: quantityMode === 'weight' ? quantity : Number(quantity),
      sizeID: selectedSize.id || selectedSize.sizeId,
      tunch: finalTunch
    };

    setIsEnquiring(true);
    try {
      console.debug('Creating enquiry:', enquiryData);
      const response = await createEnquiry(enquiryData, token);
      
      if (response.success) {
        alert('Enquiry submitted successfully! We will contact you soon.');
        // Optionally reset form or show success message
      } else {
        console.error('Enquiry failed:', response.error);
        alert(response.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error creating enquiry:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
      } else if (error.response?.status === 400) {
        alert(error.response.data?.message || 'Invalid enquiry data');
      } else {
        alert('Failed to submit enquiry. Please try again.');
      }
    } finally {
      setIsEnquiring(false);
    }
  }

  const fallbackProduct = {
    name: 'Sample Gold Chain',
    category: 'Jewelry',
    sizes: [
      { dieNo: 'D001', diameter: '2.5', ballGauge: '18', wireGauge: '20', weight: '5.2' },
      { dieNo: 'D002', diameter: '2.5', ballGauge: '16', wireGauge: '18', weight: '6.8' },
      { dieNo: 'D003', diameter: '3.0', ballGauge: '18', wireGauge: '20', weight: '7.1' },
      { dieNo: 'D004', diameter: '3.0', ballGauge: '16', wireGauge: '18', weight: '8.5' }
    ]
  }

  const displayProduct = product || fallbackProduct

  const handleAttributeChange = (attribute, value) => {
    const matches = displayProduct.sizes.filter(s => s[attribute] === value)
    if (matches.length === 1) {
      setSelectedSize(matches[0])
    } else if (matches.length > 1) {
      let best = matches[0]
      const otherAttrs = ['diameter', 'ballGauge', 'wireGauge', 'weight'].filter(a => a !== attribute)
      let maxM = -1
      matches.forEach(s => {
        let m = 0
        otherAttrs.forEach(a => {
          if (selectedSize?.[a] && s[a] === selectedSize[a]) m++
        })
        if (m > maxM) {
          maxM = m
          best = s
        }
      })
      setSelectedSize(best)
    } else {
      setSelectedSize(null)
    }
  }

  const calculateQuantityFromWeight = (targetWeight, pieceWeight) => {
    if (!pieceWeight || pieceWeight <= 0) return 1;
    return Math.max(1, Math.round(targetWeight / pieceWeight));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
      {/* Header */}
      <div className="border-b border-gray-100 pb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category:</span>
          <span className="inline-flex px-3 py-1 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 rounded-full text-sm font-semibold border border-amber-200">
            {displayProduct.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-3 leading-tight">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Design:</span> {displayProduct.name}
        </h1>
      </div>

      {/* Size selectors */}
      {displayProduct.sizes.length > 0 ? (
        <div className="space-y-6 border-b border-gray-100 pb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Die Id: <span className="text-amber-600">{selectedSize?.dieNo || 'Select a size'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Diameter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase">Diameter</label>
              <select
                value={selectedSize?.diameter || ''}
                onChange={e => handleAttributeChange('diameter', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
              >
                <option value="">Select Diameter</option>
                {[...new Set(displayProduct.sizes.map(s => s.diameter))].map(d => (
                  <option key={d} value={d}>{d}mm</option>
                ))}
              </select>
            </div>
            {/* Ball Gauge */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase">Ball Gauge</label>
              <select
                value={selectedSize?.ballGauge || ''}
                onChange={e => handleAttributeChange('ballGauge', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
              >
                <option value="">Select Ball Gauge</option>
                {[...new Set(displayProduct.sizes.map(s => s.ballGauge))].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            {/* Wire Gauge */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase">Wire Gauge</label>
              <select
                value={selectedSize?.wireGauge || ''}
                onChange={e => handleAttributeChange('wireGauge', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
              >
                <option value="">Select Wire Gauge</option>
                {[...new Set(displayProduct.sizes.map(s => s.wireGauge))].map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 uppercase">Weight</label>
              <select
                value={selectedSize?.weight || ''}
                onChange={e => handleAttributeChange('weight', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
              >
                <option value="">Select Weight</option>
                {[...new Set(displayProduct.sizes.map(s => s.weight))].map(wt => (
                  <option key={wt} value={wt}>{wt}g</option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected summary */}
          {selectedSize && (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div className="flex items-center mb-2 text-amber-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Selected Configuration
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-amber-700">
                <div><strong>Size ID:</strong> {selectedSize.id || selectedSize.sizeId || 'N/A'}</div>
                <div><strong>Die:</strong> {selectedSize.dieNo}</div>
                <div><strong>Diameter:</strong> {selectedSize.diameter}</div>
                <div><strong>Ball:</strong> {selectedSize.ballGauge}</div>
                <div><strong>Tunch:</strong> {(customTunch || tunchValue)}%</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">No sizes available for this product.</p>
        </div>
      )}

      {/* Quantity/Weight Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700 uppercase">
            Order By
          </label>
          <select
            value={quantityMode}
            onChange={(e) => {
              setQuantityMode(e.target.value);
              setCustomWeight('');
            }}
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
                  setCustomWeight(targetWeight);
                  if (selectedSize?.weight) {
                    const calculatedQuantity = calculateQuantityFromWeight(targetWeight, selectedSize.weight);
                    setQuantity(calculatedQuantity);
                  }
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

      {/* Tunch Selection */}
      <div className="space-y-4 border-t border-gray-100 pt-6">
        <label className="block text-sm font-semibold text-gray-700 uppercase">
          Tunch Value
        </label>
        
        {/* Fixed Tunch Values */}
        <div className="flex flex-wrap gap-3">
          {FIXED_TUNCH_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => {
                setTunchValue(value);
                setCustomTunch('');
              }}
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
            onChange={(e) => {
              setCustomTunch(e.target.value);
              setTunchValue('');
            }}
            placeholder="Enter custom tunch value"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-medium focus:border-amber-500"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedSize}
          className={`flex-1 py-4 px-8 font-bold rounded-xl transition ${
            isAddingToCart || !selectedSize
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:-translate-y-0.5'
          } text-white`}
        >
          {isAddingToCart ? 'Adding…' : 'Add to Cart'}
        </button>
        <button
          onClick={handleEnquire}
          disabled={isEnquiring || !selectedSize}
          className={`flex-1 py-4 px-8 font-bold rounded-xl border-2 transition ${
            isEnquiring || !selectedSize
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'border-amber-600 text-amber-600 hover:-translate-y-0.5'
          }`}
        >
          {isEnquiring ? 'Submitting…' : 'Enquire Now'}
        </button>
      </div>

      {/* Validation */}
      {!selectedSize && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c-.765-1.36-2.722-1.36-3.487 0l-1.17 2.076a1.75 1.75 0 01-.74.74l-2.076 1.17c-1.36.765-1.36 2.722 0 3.487l2.076 1.17c.314.177.563.426.74.74l1.17 2.076c.765 1.36 2.722 1.36 3.487 0l1.17-2.076a1.75 1.75 0 01.74-.74l2.076-1.17c1.36-.765 1.36-2.722 0-3.487l-2.076-1.17a1.75 1.75 0 01-.74-.74L8.257 3.099zM6.5 6a.5.5 0 000 1h3a.5.5 0 000-1h-3zM6 8.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm.5 2.5a.5.5 0 000 1h3a.5.5 0 000-1h-3z" clipRule="evenodd" />
            </svg>
            <span>Please select a size configuration before adding to cart or making an enquiry</span>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {isAddingToCart && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Adding product to cart...</span>
          </div>
        </div>
      )}

      {isEnquiring && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Submitting your enquiry...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductInfo
