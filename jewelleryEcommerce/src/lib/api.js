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
// 🛡️ ADMIN APIs (UPDATED)
// ============================

// Admin Registration - Updated to handle new response structure
export const registerAdmin = async (data) => {
  try {
    // Validate required fields on frontend
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Please provide a valid email address');
    }

    // Validate password length
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const sanitizedData = sanitizeData({
      email: data.email,
      password: data.password,
      name: data.name || '',
      role: data.role || 'admin',
      isActive: typeof data.isActive === 'boolean' ? data.isActive : true
    });

    console.log('Registering admin with data:', { ...sanitizedData, password: '[HIDDEN]' });

    const response = await API.post('/admin/register', sanitizedData);

    // Return structured response
    return {
      success: true,
      message: response.data.message,
      token: response.data.token,
      admin: response.data.admin
    };

  } catch (error) {
    console.error('Error registering admin:', error);
    
    // Handle different error types
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Registration failed',
        status: error.response.status
      };
    } else if (error.message) {
      return {
        success: false,
        error: error.message
      };
    } else {
      return {
        success: false,
        error: 'Network error or server unavailable'
      };
    }
  }
};

// Admin Login - Updated to handle new response structure
export const loginAdmin = async (data) => {
  try {
    // Validate required fields
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }

    const sanitizedData = sanitizeData({
      email: data.email,
      password: data.password
    });

    console.log('Admin login attempt for:', data.email);

    const response = await API.post('/admin/login', sanitizedData);

    // Return structured response
    return {
      success: true,
      message: response.data.message,
      token: response.data.token,
      admin: response.data.admin
    };

  } catch (error) {
    console.error('Error logging in admin:', error);
    
    // Handle different error types
    if (error.response) {
      return {
        success: false,
        error: error.response.data?.message || 'Login failed',
        status: error.response.status
      };
    } else if (error.message) {
      return {
        success: false,
        error: error.message
      };
    } else {
      return {
        success: false,
        error: 'Network error or server unavailable'
      };
    }
  }
};

// Get Admin Profile - Updated with better error handling
export const getAdminProfile = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await API.get('/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch admin profile',
      status: error.response?.status
    };
  }
};

// Update Admin Profile - Updated with better error handling
export const updateAdminProfile = async (data, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const sanitizedData = sanitizeData(data);
    const response = await API.put('/admin/me', sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      message: 'Profile updated successfully',
      data: response.data
    };

  } catch (error) {
    console.error('Error updating admin profile:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update admin profile',
      status: error.response?.status
    };
  }
};

// Get All Admins - Updated with better error handling
export const getAllAdmins = async (token) => {
  try {
    const response = await API.get('/admin', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error('Error fetching all admins:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || 'Failed to fetch admins',
      status: error.response?.status
    };
  }
};

// Get Admin by ID - Updated with better error handling
export const getAdminById = async (id, token) => {
  try {
    if (!id) {
      throw new Error('Admin ID is required');
    }

    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await API.get(`/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error(`Error fetching admin ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch admin',
      status: error.response?.status
    };
  }
};

// Update Admin - Updated with better error handling
export const updateAdmin = async (id, data, token) => {
  try {
    if (!id) {
      throw new Error('Admin ID is required');
    }

    if (!token) {
      throw new Error('Authentication token is required');
    }

    const sanitizedData = sanitizeData(data);
    const response = await API.put(`/admin/${id}`, sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      message: 'Admin updated successfully',
      data: response.data
    };

  } catch (error) {
    console.error(`Error updating admin ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update admin',
      status: error.response?.status
    };
  }
};

// Delete Admin - Updated with better error handling
export const deleteAdmin = async (id, token) => {
  try {
    if (!id) {
      throw new Error('Admin ID is required');
    }

    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await API.delete(`/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      message: 'Admin deleted successfully',
      data: response.data
    };

  } catch (error) {
    console.error(`Error deleting admin ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete admin',
      status: error.response?.status
    };
  }
};

// Admin validation helpers
export const validateAdminData = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (data.role && !['admin', 'super_admin', 'moderator'].includes(data.role)) {
    errors.role = 'Invalid role specified';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Check if admin is authenticated
export const isAdminAuthenticated = (token) => {
  if (!token) return false;
  
  try {
    // Basic token format validation
    const parts = token.split('.');
    return parts.length === 3; // JWT has 3 parts
  } catch (error) {
    return false;
  }
};

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
<<<<<<< HEAD
    } catch (error) {
=======
  } catch (error) {
>>>>>>> db6ccb0569f2ba62fe7c9e4c00f2f79b0802bc65
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
export const uploadMultipleImages = async (files, fieldName = 'images') => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append(fieldName, file));
    
    const response = await API.post('/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload images'
    };
  }
};

export const uploadSingleImage = async (file, fieldName = 'image') => {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await API.post('/upload/single', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error uploading single image:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload image'
    };
  }
};

// ============================
// 🔧 REQUEST INTERCEPTORS
// ============================

// Request interceptor to add common headers
API.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    // Log request for debugging (only in development)
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
API.interceptors.response.use(
  (response) => {
    // Log response for debugging (only in development)
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  (error) => {
    // Log error for debugging
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - clearing local storage');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('userToken');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }

    if (error.response?.status === 403) {
      console.warn('Forbidden access - insufficient permissions');
    }

    if (error.response?.status >= 500) {
      console.error('Server error - please try again later');
    }

    return Promise.reject(error);
  }
);

// ============================
// 🛠️ UTILITY FUNCTIONS
// ============================

// Helper function to handle API responses consistently
export const handleApiResponse = (response) => {
  if (response.success) {
    return response;
  } else {
    throw new Error(response.error || 'API request failed');
  }
};

// Helper function to format error messages
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

// Helper function to check if response is successful
export const isApiSuccess = (response) => {
  return response && (response.success === true || response.status < 400);
};

// Helper function to extract data from API response
export const extractApiData = (response) => {
  if (response.data) {
    return response.data;
  }
  return response;
};

// Helper function to create form data from object
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    const value = data[key];
    
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

// Helper function to validate file types
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) => {
  return allowedTypes.includes(file.type);
};

// Helper function to validate file size
export const validateFileSize = (file, maxSizeInMB = 5) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

// Helper function to compress image before upload
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob(resolve, file.type, quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// ============================
// 📊 ANALYTICS & MONITORING
// ============================

// Helper function to track API calls (for analytics)
export const trackApiCall = (endpoint, method, success, duration) => {
  if (import.meta.env.DEV) {
    console.log(`📊 API Analytics: ${method} ${endpoint}`, {
      success,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  }
  
  // Here you could send analytics data to your monitoring service
  // Example: analytics.track('api_call', { endpoint, method, success, duration });
};

// Helper function to measure API call duration
export const measureApiCall = async (apiCall) => {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const duration = performance.now() - startTime;
    
    // Track successful API call
    trackApiCall(apiCall.name, 'unknown', true, duration);
    
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    
    // Track failed API call
    trackApiCall(apiCall.name, 'unknown', false, duration);
    
    throw error;
  }
};

// ============================
// 🛠️ UTILITY EXPORTS
// ============================
<<<<<<< HEAD
export { 
  sanitizeData, 
  sanitizeFormData,
};

// Export the axios instance for advanced usage
export { API };

// Export API base URL for reference
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Export common HTTP status codes for reference
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Export common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error - please check your connection',
  SERVER_ERROR: 'Server error - please try again later',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access forbidden - insufficient permissions',
  NOT_FOUND: 'Requested resource not found',
  VALIDATION_ERROR: 'Please check your input and try again'
};
=======
export { sanitizeData, sanitizeFormData };

>>>>>>> db6ccb0569f2ba62fe7c9e4c00f2f79b0802bc65
