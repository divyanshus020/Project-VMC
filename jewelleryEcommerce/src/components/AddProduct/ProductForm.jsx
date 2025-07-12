import { useState, useEffect, useRef } from 'react';
import { 
  getSizes, 
  createProduct, 
  getProducts, 
  sanitizeFormData,
  uploadMultipleImages,
  uploadSingleImage 
} from '../../lib/api';
import Select from 'react-select';
import axios from 'axios';

const ProductForm = () => {
  const [category, setCategory] = useState('');
  const [designName, setDesignName] = useState('');
  const [dieNos, setDieNos] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [sizeOptions, setSizeOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const singleImageRef = useRef();
  const multiImageRef = useRef();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sizeRes = await getSizes();
        setSizeOptions(
          sizeRes.data.map(size => ({ label: size.dieNo, value: size.id }))
        );

        const productRes = await getProducts();
        const products = productRes.data;
        const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
        const categoryOpts = uniqueCategories.map(cat => ({ label: cat, value: cat }));
        categoryOpts.push({ label: '+ Add New Category', value: '__add_new__' });
        setCategoryOptions(categoryOpts);
      } catch (error) {
        console.error('Initialization error:', error);
        setCategoryOptions([{ label: '+ Add New Category', value: '__add_new__' }]);
      }
    };
    fetchInitialData();
  }, []);

  const validateImageFile = (file) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPG, PNG or GIF');
    }
    
    if (file.size > MAX_SIZE) {
      throw new Error('File too large. Maximum size is 5MB');
    }
    
    return true;
  };

  const handleImageUpload = async (files) => {
    try {
      // Validate all files first
      [...files].forEach(validateImageFile);

      const uploads = await Promise.all(
        [...files].map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log('Upload progress:', percentCompleted);
              }
            }
          );
          return res.data.secure_url;
        })
      );
      return uploads;
    } catch (err) {
      console.error('Multiple image upload failed:', err);
      throw new Error(err.message || 'Error uploading multiple images');
    }
  };

  const handleSingleImageUpload = async (file) => {
    try {
      // Validate file
      validateImageFile(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log('Upload progress:', percentCompleted);
          }
        }
      );
      return res.data.secure_url;
    } catch (err) {
      console.error('Single image upload failed:', err);
      throw new Error(err.message || 'Error uploading single image');
    }
  };

  const handleSelectAllSizes = () => {
    setDieNos(sizeOptions);
  };

  const handleClearAllSizes = () => {
    setDieNos([]);
  };

  const handleCategoryChange = (selectedOption) => {
    if (selectedOption?.value === '__add_new__') {
      setShowCustomCategory(true);
      setCategory('');
    } else {
      setShowCustomCategory(false);
      setCategory(selectedOption?.value || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !designName || dieNos.length === 0) {
      alert('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      let uploadedImages = [];
      let uploadedSingleImage = '';

      // Upload multiple images if any
      if (images && images.length > 0) {
        setUploadProgress(25);
        uploadedImages = await handleImageUpload(images);
        setUploadProgress(50);
      }

      // Upload single image if selected
      if (imageUrl) {
        setUploadProgress(60);
        uploadedSingleImage = await handleSingleImageUpload(imageUrl);
        setUploadProgress(70);
      }

      // Create FormData with sanitization
      const formData = new FormData();
      formData.append('name', designName);
      formData.append('category', category);

      // Add single image URL if available
      if (uploadedSingleImage) {
        formData.append('imageUrl', uploadedSingleImage);
      }

      // Add die IDs as JSON string array
      if (dieNos.length > 0) {
        formData.append('dieIds', JSON.stringify(dieNos.map(d => d.value)));
      }

      // Add multiple images as JSON string array
      if (uploadedImages.length > 0) {
        formData.append('images', JSON.stringify(uploadedImages));
      }

      // Sanitize form data
      const sanitizedFormData = sanitizeFormData(formData);

      setUploadProgress(85);
      const response = await createProduct(sanitizedFormData);
      setUploadProgress(100);

      // Reset form
      setCategory('');
      setDesignName('');
      setDieNos([]);
      setImageUrl(null);
      setImages([]);
      setShowCustomCategory(false);
      if (singleImageRef.current) singleImageRef.current.value = '';
      if (multiImageRef.current) multiImageRef.current.value = '';

      alert('Product created successfully!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const customSelectStyles = {
    control: (styles) => ({
      ...styles,
      minHeight: '48px',
      borderColor: '#e5e7eb',
      borderRadius: '12px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#6366f1' },
      '&:focus-within': {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)',
      },
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
    }),
    multiValueLabel: (styles) => ({ ...styles, color: '#374151' }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#6b7280',
      '&:hover': { backgroundColor: '#ef4444', color: 'white' },
    }),
    option: (styles, { data }) => ({
      ...styles,
      color: data.value === '__add_new__' ? '#6366f1' : styles.color,
      fontWeight: data.value === '__add_new__' ? '600' : styles.fontWeight,
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
          <p className="text-gray-600">Fill in the details to add a new product to your catalog</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              
              {!showCustomCategory ? (
                <Select
                  options={categoryOptions}
                  onChange={handleCategoryChange}
                  styles={customSelectStyles}
                  placeholder="Select a category or add new..."
                  className="text-sm"
                  isClearable
                />
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                      placeholder="Enter new category name"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCategory('');
                      }}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Design Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Design Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter design name"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Size Selection with Select All Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Size Die Numbers <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllSizes}
                    className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors duration-200 font-medium"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllSizes}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <Select
                isMulti
                options={sizeOptions}
                value={dieNos}
                onChange={setDieNos}
                styles={customSelectStyles}
                placeholder="Select size die numbers..."
                className="text-sm"
              />
              <div className="text-sm text-gray-500">
                {dieNos.length} of {sizeOptions.length} sizes selected
              </div>
            </div>

            {/* Single Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Main Product Image
              </label>
              <div className="relative">
                <input
                  ref={singleImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageUrl(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Upload a main product image (JPG, PNG, GIF). Maximum 5MB.
                </div>
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Additional Images (Optional)
              </label>
              <div className="relative">
                <input
                  ref={multiImageRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages(e.target.files)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Upload additional product images. Supported formats: JPG, PNG, GIF. Maximum 5MB per image.
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creating Product...</span>
                  </div>
                ) : (
                  'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Make sure all required fields are filled before submitting
        </div>
      </div>
    </div>
  );
};

export default ProductForm;