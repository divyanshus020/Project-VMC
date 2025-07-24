import React, { useState } from 'react';
import { addToCart, createEnquiry } from '../../lib/api';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import TunchSelector from './TunchSelector';

const ProductInfo = ({ product }) => {
  // State for quantity and its mode (pieces vs. weight)
  const [quantity, setQuantity] = useState(1);
  const [quantityMode, setQuantityMode] = useState('pieces'); // 'pieces' or 'weight'
  const [customWeight, setCustomWeight] = useState('');

  // State for the selected product size configuration
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

  // State for tunch (purity) value
  const [tunchValue, setTunchValue] = useState('92.5'); // Default to 92.5
  const [customTunch, setCustomTunch] = useState('');

  // State to manage loading indicators for buttons
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isEnquiring, setIsEnquiring] = useState(false);

  /**
   * Robustly retrieves the user ID from the JWT token stored in localStorage.
   */
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('userToken')
      if (!token) {
        console.error('No token found in localStorage');
        return null;
      }
      const decoded = jwtDecode(token);
      const userId = decoded.userId || decoded.id || decoded.user_id || decoded.sub;
      if (userId) return userId;
      
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.userId || user.user_id;
      }
      
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        return user.id || user.userId || user.user_id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  /**
   * Handles the "Add to Cart" action with loading toast notifications.
   */
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      toast.warn('Please login to add items to cart');
      return;
    }
    if (!product?.id) {
      toast.error('Product information is missing');
      return;
    }
    if (!selectedSize) {
      toast.warn('Please select a size before adding to cart');
      return;
    }

    const finalTunch = customTunch || tunchValue;
    const tunchNum = parseFloat(finalTunch);
    if (isNaN(tunchNum) || tunchNum <= 0 || tunchNum > 100) {
      toast.warn('Please enter a valid tunch value between 0 and 100');
      return;
    }

    const dieNo = selectedSize.dieNo || selectedSize.DieNo || selectedSize.die_no;
    const weight = selectedSize.weight || selectedSize.Weight || selectedSize.weight_g;

    if (!dieNo) {
      toast.error('Could not read Die Number from configuration');
      return;
    }
    if (!weight) {
      toast.error('Could not read Weight from configuration');
      return;
    }

    const cartData = {
      productId: product.id,
      sizeId: selectedSize.id || selectedSize.sizeId,
      quantity: Number(quantity),
      DieNo: dieNo,
      weight: weight,
      tunch: tunchNum,
      totalWeight: quantityMode === 'weight' ? parseFloat(customWeight) : weight * quantity,
    };

    setIsAddingToCart(true);
    const toastId = toast.loading("Adding item to cart...");

    try {
      const response = await addToCart(cartData, token);
      if (response.success) {
        toast.update(toastId, { render: "Product added successfully!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        throw new Error(response.message || 'Failed to add product to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add product. Please try again.';
      toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 4000 });
    } finally {
      setIsAddingToCart(false);
    }
  };

  /**
   * Handles the "Enquire Now" action with loading toast notifications.
   */
  const handleEnquire = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    if (!token) {
      toast.warn('Please login to make an enquiry');
      return;
    }
    if (!product?.id) {
      toast.error('Product information is missing');
      return;
    }
    if (!selectedSize) {
      toast.warn('Please select a size before making an enquiry');
      return;
    }

    const finalTunch = customTunch || tunchValue;
    const tunchNum = parseFloat(finalTunch);
    if (isNaN(tunchNum) || tunchNum <= 0 || tunchNum > 100) {
      toast.warn('Please enter a valid tunch value between 0 and 100');
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      toast.error('Unable to identify user. Please login again.');
      return;
    }

    const enquiryData = {
      productID: product.id,
      userID: userId,
      quantity: quantityMode === 'weight' ? quantity : Number(quantity),
      sizeID: selectedSize.id || selectedSize.sizeId,
      tunch: finalTunch,
    };

    setIsEnquiring(true);
    const toastId = toast.loading("Submitting your enquiry...");

    try {
      const response = await createEnquiry(enquiryData, token);
      if (response.success) {
        toast.update(toastId, { render: "Enquiry submitted successfully!", type: "success", isLoading: false, autoClose: 3000 });
      } else {
        throw new Error(response.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error creating enquiry:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit enquiry. Please try again.';
      toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 4000 });
    } finally {
      setIsEnquiring(false);
    }
  };

  // Fallback data for development
  const fallbackProduct = {
    name: 'Sample Gold Chain',
    category: 'Jewelry',
    sizes: [
      { id: 'S1', dieNo: 'D001', diameter: '2.5', ballGauge: '18', wireGauge: '20', weight: 5.2 },
      { id: 'S2', dieNo: 'D002', diameter: '2.5', ballGauge: '16', wireGauge: '18', weight: 6.8 },
      { id: 'S3', dieNo: 'D003', diameter: '3.0', ballGauge: '18', wireGauge: '20', weight: 7.1 },
      { id: 'S4', dieNo: 'D004', diameter: '3.0', ballGauge: '16', wireGauge: '18', weight: 8.5 },
    ],
  };

  const displayProduct = product || fallbackProduct;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
      {/* Header Section */}
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

      {/* Child Components */}
      <SizeSelector
        displayProduct={displayProduct}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
        tunchValue={tunchValue}
        customTunch={customTunch}
      />
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        quantityMode={quantityMode}
        setQuantityMode={setQuantityMode}
        customWeight={customWeight}
        setCustomWeight={setCustomWeight}
        selectedSize={selectedSize}
      />
      <TunchSelector
        tunchValue={tunchValue}
        setTunchValue={setTunchValue}
        customTunch={customTunch}
        setCustomTunch={setCustomTunch}
      />

      {/* Action Buttons */}
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

      {/* Validation Message */}
      {!selectedSize && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Please select a size configuration to enable the 'Add to Cart' and 'Enquire' buttons.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
