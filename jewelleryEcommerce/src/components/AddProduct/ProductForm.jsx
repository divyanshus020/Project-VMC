import { useState, useEffect, useRef } from 'react';
import { getSizes, createProduct, getProducts, sanitizeFormData } from '../../lib/api';
import Select from 'react-select';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductForm = () => {
  // State hooks remain the same
  const [category, setCategory] = useState('');
  const [designName, setDesignName] = useState('');
  const [dieNos, setDieNos] = useState([]);
  const [imageUrl, setImageUrl] = useState(null); // This will hold the file object
  const [images, setImages] = useState([]); // This will hold the file list
  const [sizeOptions, setSizeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState(null);

  const singleImageRef = useRef();
  const multiImageRef = useRef();

  // useEffect for fetching initial data remains the same
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsInitializing(true);
      setInitError(null);

      try {
        const sizeRes = await getSizes();
        if (!sizeRes.success) {
          throw new Error(sizeRes.error || 'Failed to fetch sizes');
        }
        const sizes = Array.isArray(sizeRes.data) ? sizeRes.data : [];
        setSizeOptions(
          sizes.map(size => ({
            label: `Die No: ${size.dieNo}`,
            value: size.id,
            details: size
          }))
        );

        const productRes = await getProducts();
        const products = Array.isArray(productRes.data) ? productRes.data : [];
        let categories = [];
        if (products.length > 0) {
          categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        }

        const categoryOpts = categories.map(cat => ({ label: cat, value: cat }));
        categoryOpts.push({ label: '+ Add New Category', value: '__add_new__' });
        setCategoryOptions(categoryOpts);

      } catch (error) {
        console.error('Initialization error:', error);
        setInitError(error.message || 'Failed to load initial data');
        setCategoryOptions([{ label: '+ Add New Category', value: '__add_new__' }]);
      } finally {
        setIsInitializing(false);
      }
    };

    fetchInitialData();
  }, []);

  // validateImageFile function remains the same
  const validateImageFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG, GIF, or WebP');
    }

    if (file.size > MAX_SIZE) {
      throw new Error('File too large. Maximum size is 5MB');
    }

    return true;
  };

  // handleImageUpload (for multiple files) remains largely the same
  const handleImageUpload = async (files) => {
    try {
      [...files].forEach(validateImageFile);
      const uploads = await Promise.all(
        [...files].map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
          );
          return res.data.secure_url;
        })
      );
      return uploads;
    } catch (err) {
      console.error('Multiple image upload failed:', err);
      // The error will be caught by the handleSubmit's catch block and shown as a toast
      throw new Error(err.message || 'Error uploading multiple images');
    }
  };

  // handleSingleImageUpload remains largely the same
  const handleSingleImageUpload = async (file) => {
    try {
      validateImageFile(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => Math.max(prev, 70 + (percentCompleted * 0.15))); // Progress from 70% to 85%
          }
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Single image upload failed:', err);
      // The error will be caught by the handleSubmit's catch block and shown as a toast
      throw new Error(err.message || 'Error uploading single image');
    }
  };


  // Helper functions for size selection remain the same
  const handleSelectAllSizes = () => setDieNos(sizeOptions);
  const handleClearAllSizes = () => setDieNos([]);

  // handleCategoryChange remains the same
  const handleCategoryChange = (selectedOption) => {
    if (selectedOption?.value === '__add_new__') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCategory(selectedOption?.value || '');
    }
  };

  // *** UPDATED handleSubmit function ***
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Enhanced Validation ---
    if (!category || !designName || dieNos.length === 0) {
      toast.warn('Please fill all required fields marked with *');
      return;
    }
    // --- Key Change: Check if the main image file is selected ---
    if (!imageUrl) {
      toast.warn('A main product image is required.');
      return; // This prevents the API call and the 400 error
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      let uploadedImages = [];
      let uploadedSingleImage = '';

      // --- Upload single image (main image) ---
      setUploadProgress(10);
      toast.info('Uploading main image...');
      uploadedSingleImage = await handleSingleImageUpload(imageUrl);
      setUploadProgress(50);
      
      // --- Upload multiple images if any ---
      if (images && images.length > 0) {
        toast.info('Uploading additional images...');
        uploadedImages = await handleImageUpload(images);
      }
      setUploadProgress(70);

      // --- Prepare data for backend ---
      // The error indicates that the API expects a FormData object, not a plain JS object.
      const formData = new FormData();
      formData.append('name', designName);
      formData.append('category', category);
      formData.append('imageUrl', uploadedSingleImage);
      // Stringify arrays before appending to FormData
      formData.append('dieIds', JSON.stringify(dieNos.map(d => d.value)));
      formData.append('images', JSON.stringify(uploadedImages));
      
      setUploadProgress(85);
      toast.info('Finalizing product creation...');
      // Pass the FormData object to the createProduct function
      const response = await createProduct(formData);
      setUploadProgress(100);

      // --- Reset form on success ---
      setCategory('');
      setDesignName('');
      setDieNos([]);
      setImageUrl(null);
      setImages([]);
      setShowCustomCategory(false);
      if (singleImageRef.current) singleImageRef.current.value = '';
      if (multiImageRef.current) multiImageRef.current.value = '';

      toast.success('Product created successfully!');

    } catch (error) {
      console.error('Error creating product:', error);
      // Display a user-friendly error from the caught exception
      toast.error(error.message || 'Failed to create product. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // Custom styles for react-select remain the same
  const customSelectStyles = {
    control: (styles) => ({ ...styles, minHeight: '48px', borderColor: '#e5e7eb', borderRadius: '12px', boxShadow: 'none', '&:hover': { borderColor: '#6366f1' }, '&:focus-within': { borderColor: '#6366f1', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' } }),
    multiValue: (styles) => ({ ...styles, backgroundColor: '#f3f4f6', borderRadius: '8px' }),
    multiValueLabel: (styles) => ({ ...styles, color: '#374151' }),
    multiValueRemove: (styles) => ({ ...styles, color: '#6b7280', '&:hover': { backgroundColor: '#ef4444', color: 'white' } }),
    option: (styles, { data }) => ({ ...styles, color: data.value === '__add_new__' ? '#6366f1' : styles.color, fontWeight: data.value === '__add_new__' ? '600' : styles.fontWeight }),
  };

  // Loading state JSX remains the same
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Loading initial data, please wait...</p>
        </div>
      </div>
    );
  }

  // --- Main component return with ToastContainer ---
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Add ToastContainer at the top level of your component */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Fill in the details to add a new product to your catalog</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {initError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700">{initError}. Using default options.</p>
              </div>
            )}

            {/* Category Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
              {!showCustomCategory ? (
                <Select options={categoryOptions} onChange={handleCategoryChange} styles={customSelectStyles} placeholder="Select a category or add new..." className="text-sm" isClearable />
              ) : (
                <div className="flex items-center gap-2">
                  <input type="text" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter new category name" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  <button type="button" onClick={() => { setShowCustomCategory(false); setCategory(''); }} className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">Cancel</button>
                </div>
              )}
            </div>

            {/* Design Name Field */}
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Design Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Enter design name" value={designName} onChange={(e) => setDesignName(e.target.value)} required />
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700">Size Die Numbers <span className="text-red-500">*</span></label>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleSelectAllSizes} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 font-medium">Select All</button>
                        <button type="button" onClick={handleClearAllSizes} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 font-medium">Clear All</button>
                    </div>
                </div>
                <Select isMulti options={sizeOptions} value={dieNos} onChange={setDieNos} styles={customSelectStyles} placeholder="Select size die numbers..." className="text-sm" />
                <div className="text-sm text-gray-500">{dieNos.length} of {sizeOptions.length} sizes selected</div>
            </div>

            {/* Single Image Upload (Main Image) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Main Product Image <span className="text-red-500">*</span></label>
              <input ref={singleImageRef} type="file" accept="image/*" onChange={(e) => setImageUrl(e.target.files?.[0] || null)} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <div className="mt-2 text-sm text-gray-500">This image is required. Max 5MB.</div>
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Additional Images (Optional)</label>
              <input ref={multiImageRef} type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            </div>

            {/* Progress Bar and Submit Button */}
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600"><span>Uploading...</span><span>{uploadProgress}%</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div>
              </div>
            )}
            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]">
                {isLoading ? 'Creating Product...' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
