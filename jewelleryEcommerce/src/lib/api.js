import axios from 'axios';

// ✅ Axios Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// ✅ Helper function to sanitize data before sending to API
const sanitizeData = (data) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = value === undefined ? null : value;
  }
  return sanitized;
};

// ✅ Helper function to sanitize FormData
const sanitizeFormData = (formData) => {
  const sanitizedFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    sanitizedFormData.append(key, value === undefined || value === 'undefined' ? '' : value);
  }
  return sanitizedFormData;
};

// ===============================
// 📦 PRODUCT APIs
// ===============================

// Create product with form data (images + details)
export const createProduct = async (formData) => {
  try {
    const sanitizedFormData = sanitizeFormData(formData);
    
    // Log the sanitized form data for debugging
    console.log('Sanitized FormData entries:');
    for (let [key, value] of sanitizedFormData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await API.post('/products', sanitizedFormData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
    });

    // Parse images JSON if it comes back as a string
    if (response.data && typeof response.data.images === 'string') {
      response.data.images = JSON.parse(response.data.images);
    }

    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
};

export const createProductWithUrl = async (data) => {
  try {
    const sanitizedData = sanitizeData(data);
    const response = await API.post('/products', sanitizedData);
    
    // Parse images JSON if needed
    if (response.data && typeof response.data.images === 'string') {
      response.data.images = JSON.parse(response.data.images);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating product with URL:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const response = await API.get('/products');
    
    if (!response?.data) {
      throw new Error('Invalid response from server');
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch products'
    };
  }
};

export const getProductById = async (id) => {
  if (!id) throw new Error('Product ID is required');
  try {
    const response = await API.get(`/products/${id}`);
    // Parse images JSON if needed
    if (response.data && typeof response.data.images === 'string') {
      response.data.images = JSON.parse(response.data.images);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  if (!category) throw new Error('Category is required');
  try {
    const response = await API.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw error;
  }
};

// Get all unique categories
export const getCategories = async () => {
  try {
    const response = await API.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Update product with form data
export const updateProduct = async (id, formData) => {
  if (!id) throw new Error('Product ID is required');
  try {
    const sanitizedFormData = sanitizeFormData(formData);
    const response = await API.put(`/products/${id}`, sanitizedFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  if (!id) throw new Error('Product ID is required');
  try {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await API.get('/products/search', { params: { q: query } });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const response = await API.get('/products/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get new arrivals
export const getNewArrivals = async () => {
  try {
    const response = await API.get('/products/new-arrivals');
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    throw error;
  }
};

// ============================
// 📏 SIZE APIs
// ============================
export const createSize = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/sizes', sanitizedData);
};

export const getSizes = async () => {
  try {
    const response = await API.get('/sizes');
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch sizes'
    };
  }
};

export const getSizeById = (id) => {
  if (!id) throw new Error('Size ID is required');
  return API.get(`/sizes/${id}`);
};

export const updateSize = (id, data) => {
  const sanitizedData = sanitizeData(data);
  return API.put(`/sizes/${id}`, sanitizedData);
};

export const deleteSize = (id) => API.delete(`/sizes/${id}`);

// ============================
// 🎲 DIE APIs
// ============================
export const createDie = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/dies', sanitizedData);
};

export const getDies = (params) => API.get('/dies', { params });

export const getDieById = (id) => {
  if (!id) throw new Error('Die ID is required');
  return API.get(`/dies/${id}`);
};

export const updateDie = (id, data) => {
  const sanitizedData = sanitizeData(data);
  return API.put(`/dies/${id}`, sanitizedData);
};

export const deleteDie = (id) => API.delete(`/dies/${id}`);

export const getDiesByProductId = (productId) => {
  if (!productId) throw new Error('Product ID is required');
  return API.get(`/dies/product/${productId}`);
};

export const getDiesBySizeId = (sizeId) => {
  if (!sizeId) throw new Error('Size ID is required');
  return API.get(`/dies/size/${sizeId}`);
};

// ============================
// 👤 USER APIs (OTP Auth)
// ============================

export const checkUserExists = async (phoneNumber) => {
  try {
    const response = await API.post('/users/check-exists', { phoneNumber });
    return response.data; // Should return { exists: boolean }
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
};

export const sendOtpForLogin = async (phoneNumber) => {
  try {
    const response = await API.post('/users/send-otp-login', { phoneNumber });
    return response.data; // Should return { message: string }
  } catch (error) {
    console.error('Error sending login OTP:', error);
    throw error;
  }
};

export const sendOtpForRegister = async (phoneNumber) => {
  try {
    const response = await API.post('/users/send-otp-register', { phoneNumber });
    return response.data;
  } catch (error) {
    console.error('Error sending registration OTP:', error);
    throw error;
  }
};

export const verifyOtpForLogin = async (phoneNumber, otp) => {
  try {
    const response = await API.post('/users/verify-otp-login', { 
      phoneNumber, 
      otp 
    });
    
    // Return just the data
    return response.data;
  } catch (error) {
    console.error('Error verifying login OTP:', error);
    throw error;
  }
};

export const verifyOtpForRegister = async (data) => {
  try {
    const sanitizedData = sanitizeData(data);
    const response = await API.post('/users/verify-otp-register', sanitizedData);
    return response.data;
  } catch (error) {
    console.error('Error verifying registration OTP:', error);
    throw error;
  }
};

export const getProfile = (token) =>
  API.get('/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (data, token) => {
  const sanitizedData = sanitizeData(data);
  return API.put('/users/profile', sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteProfile = (token) =>
  API.delete('/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (id, token) =>
  API.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllUsers = () => API.get('/users');

// ============================
// 🛡️ ADMIN APIs
// ============================
export const registerAdmin = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/admin/register', sanitizedData);
};

export const loginAdmin = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/admin/login', sanitizedData);
};

export const getAdminProfile = (token) =>
  API.get('/admin/me', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdminProfile = (data, token) => {
  const sanitizedData = sanitizeData(data);
  return API.put('/admin/me', sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllAdmins = () => API.get('/admin');

export const getAdminById = (id, token) =>
  API.get(`/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdmin = (id, data, token) => {
  const sanitizedData = sanitizeData(data);
  return API.put(`/admin/${id}`, sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAdmin = (id, token) =>
  API.delete(`/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ============================
// 🛒 CART APIs
// ============================

export const addToCart = async (data, token) => {
  try {
    const sanitizedData = sanitizeData({
      productId: data.productId,
      sizeId: data.sizeId,
      quantity: parseInt(data.quantity),
      DieNo: data.DieNo,
      weight: data.weight?.toString(),
      tunch: data.tunch ? parseFloat(data.tunch) : null
    });

    const response = await API.post('/cart/add', sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to add item to cart'
    };
  }
};

export const getCart = (token) =>
  API.get('/cart', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDetailedCart = async (token) => {
  try {
    const response = await API.get('/cart/detailed', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Add console.log to debug the response
    console.log('Cart API Response:', response);

    // Check if we have items in the response
    if (response.data?.data?.items) {
      return {
        success: true,
        data: response.data.data
      };
    }

    // If response.data is the direct items array
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: {
          items: response.data,
          totalItems: response.data.reduce((sum, item) => sum + (item.quantity || 0), 0)
        }
      };
    }

    return {
      success: false,
      error: 'Invalid cart data format'
    };

  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};
export const getCartTotal = (token) =>
  API.get('/cart/total', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCartItemQuantity = (itemId, quantity, token) => {
  const sanitizedData = sanitizeData({ quantity });
  // Fix the route path
  return API.patch(`/cart/item/${itemId}/quantity`, sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeCartItem = (itemId, token) =>
  // Fix the route path
  API.delete(`/cart/item/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const clearCart = (token) =>
  API.delete('/cart/clear', {
    headers: { Authorization: `Bearer ${token}` },
  });

// Add new tunch-related functions
export const updateCartItemTunch = (itemId, tunch, token) => {
  const sanitizedData = sanitizeData({ tunch: parseFloat(tunch) });
  // Update the route path to match backend
  return API.patch(`/cart/items/${itemId}/tunch`, sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Add size-related functions
export const getSizeDetailsByDieNo = async (dieNo) => {
  try {
    if (!dieNo) {
      return {
        success: false,
        error: 'Die number is required'
      };
    }

    const response = await API.get(`/sizes/by-die/${encodeURIComponent(dieNo)}`);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    }

    return {
      success: false,
      error: response.data?.message || 'No size details found'
    };

  } catch (error) {
    console.error(`Error fetching size details for die ${dieNo}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch size details',
      status: error.response?.status
    };
  }
};

// Add validation helpers
export const validateTunch = (tunch) => {
  if (!tunch) return false;
  const tunchNum = parseFloat(tunch);
  return !isNaN(tunchNum) && tunchNum > 0 && tunchNum <= 100;
};

export const formatTunch = (tunch) => {
  if (!tunch) return 'N/A';
  const tunchNum = parseFloat(tunch);
  return isNaN(tunchNum) ? 'N/A' : `${tunchNum.toFixed(1)}%`;
};

// Add constants for fixed tunch values
export const FIXED_TUNCH_VALUES = ['92.5', '90', '88.5', '84.5'];

// ============================
// 📋 ENQUIRY APIs
// ============================

// Create a new enquiry
export const createEnquiry = async (data, token) => {
  try {
    const sanitizedData = sanitizeData({
      productID: parseInt(data.productID),
      userID: parseInt(data.userID),
      quantity: parseInt(data.quantity),
      sizeID: parseInt(data.sizeID),
      tunch: data.tunch ? data.tunch.toString() : null
    });

    const response = await API.post('/enquiries', sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create enquiry'
    };
  }
};

// Get all enquiries (Admin only)
export const getAllEnquiries = async (token) => {
  try {
    const response = await API.get('/enquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch enquiries'
    };
  }
};

// Get enquiry by ID
export const getEnquiryById = async (id, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');

    const response = await API.get(`/enquiries/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error fetching enquiry ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch enquiry'
    };
  }
};

// Update enquiry
export const updateEnquiry = async (id, data, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');

    const sanitizedData = sanitizeData({
      productID: parseInt(data.productID),
      userID: parseInt(data.userID),
      quantity: parseInt(data.quantity),
      sizeID: parseInt(data.sizeID),
      tunch: data.tunch ? data.tunch.toString() : null
    });

    const response = await API.put(`/enquiries/${id}`, sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error updating enquiry ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update enquiry'
    };
  }
};

// Delete enquiry
export const deleteEnquiry = async (id, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');

    const response = await API.delete(`/enquiries/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error deleting enquiry ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete enquiry'
    };
  }
};

// Get enquiries by user ID
export const getEnquiriesByUser = async (userID, token) => {
  try {
    if (!userID) throw new Error('User ID is required');

    const response = await API.get(`/enquiries/user/${userID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error fetching enquiries for user ${userID}:`, error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch user enquiries'
    };
  }
};

// Get current user's enquiries
export const getMyEnquiries = async (token) => {
  try {
    const response = await API.get('/enquiries/my-enquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching my enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch your enquiries'
    };
  }
};

// Get enquiries with detailed product and size information
export const getDetailedEnquiries = async (token) => {
  try {
    const response = await API.get('/enquiries/detailed', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching detailed enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch detailed enquiries'
    };
  }
};

// Get enquiries by product ID
export const getEnquiriesByProduct = async (productID, token) => {
  try {
    if (!productID) throw new Error('Product ID is required');

    const response = await API.get(`/enquiries/product/${productID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error fetching enquiries for product ${productID}:`, error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch product enquiries'
    };
  }
};

// Bulk delete enquiries
export const bulkDeleteEnquiries = async (enquiryIds, token) => {
  try {
    if (!enquiryIds || !Array.isArray(enquiryIds) || enquiryIds.length === 0) {
      throw new Error('Enquiry IDs array is required');
    }

    const response = await API.delete('/enquiries/bulk-delete', {
      data: { enquiryIds },
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error bulk deleting enquiries:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete enquiries'
    };
  }
};

// Get enquiry statistics (for admin dashboard)
export const getEnquiryStats = async (token) => {
  try {
    const response = await API.get('/enquiries/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching enquiry statistics:', error);
    return {
      success: false,
      data: {},
      error: error.response?.data?.message || 'Failed to fetch enquiry statistics'
    };
  }
};

// ============================
// ☁️ IMAGE UPLOAD APIs (Cloudinary)
// ============================
export const uploadMultipleImages = (files, fieldName = 'images') => {
  const formData = new FormData();
  files.forEach((file) => formData.append(fieldName, file));
  return API.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadSingleImage = (file, fieldName = 'image') => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return API.post('/upload/single', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ============================
// 🛠️ UTILITY EXPORTS
// ============================
export { sanitizeData, sanitizeFormData };

