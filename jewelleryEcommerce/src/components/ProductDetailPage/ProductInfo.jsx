import React, { useState } from 'react'
import { addToCart } from '../../lib/api'

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

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
      quantity: Number(quantity),
      DieNo: dieNo,
      weight: weight
    }

    setIsAddingToCart(true)
    try {
      console.debug('Adding to cart:', cartData)
      const response = await addToCart(cartData, token)
      if (response.status === 200 || response.status === 201) {
        alert('Product added to cart successfully!')
      } else {
        console.error('Unexpected status:', response.status, response.data)
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

  const handleEnquire = () => {
    const enquiryData = {
      product: product,
      selectedSize,
      quantity
    }
    console.log('Enquiry data:', enquiryData)
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
                  <path fillRule="evenodd" d="M10 18a8 8 0 ...
                  " clipRule="evenodd" />
                </svg>
                Selected Configuration
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-amber-700">
                <div><strong>Die:</strong> {selectedSize.dieNo}</div>
                <div><strong>Diameter:</strong> {selectedSize.diameter}</div>
                <div><strong>Ball:</strong> {selectedSize.ballGauge}</div>
                <div><strong>Wire:</strong> {selectedSize.wireGauge}</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">No sizes available for this product.</p>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 uppercase">Quantity</label>
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
          className="flex-1 py-4 px-8 font-bold rounded-xl border-2 border-amber-600 text-amber-600 hover:-translate-y-0.5 transition"
        >
          Enquire Now
        </button>
      </div>

      {/* Validation */}
      {!selectedSize && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099..." clipRule="evenodd" />
            </svg>
            <span>Please select a size configuration before adding to cart</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductInfo
