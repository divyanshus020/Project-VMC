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

// Update the getAllUsers function
export const getAllUsers = async () => {
  try {
    console.log('🔄 Fetching all users...');
    
    const response = await API.get('/users');
    console.log('📋 Users API response:', response.data);
    
    if (response.data && response.data.success) {
      return {
        success: true,
        data: Array.isArray(response.data.data) ? response.data.data : [],
        count: response.data.count || 0
      };
    } else if (Array.isArray(response.data)) {
      // Handle direct array response
      return {
        success: true,
        data: response.data,
        count: response.data.length
      };
    }
    
    return { 
      success: false, 
      data: [], 
      error: 'Invalid users response format' 
    };
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return { 
      success: false, 
      data: [], 
      error: error.response?.data?.message || error.message || 'Failed to fetch users'
    };
  }
};

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
// 📋 ENQUIRY APIs (UPDATED)
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
      data: response.data.enquiry,
      message: response.data.message || 'Enquiry created successfully'
    };
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || 'Failed to create enquiry'
    };
  }
};


// Get all enquiries (Admin only) - Updated with better error handling
export const getAllEnquiries = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('🔄 Fetching all enquiries...');

    const response = await API.get('/enquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📋 Enquiries API response:', response.data);

    // Backend returns array directly
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        count: response.data.length
      };
    }

    // Handle wrapped response
    if (response.data && response.data.success) {
      return {
        success: true,
        data: Array.isArray(response.data.data) ? response.data.data : [],
        count: response.data.count || 0
      };
    }

    return {
      success: false,
      data: [],
      error: 'Invalid enquiries response format'
    };

  } catch (error) {
    console.error('❌ Error fetching enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch enquiries'
    };
  }
};

// Get enquiry by ID - Updated with better error handling
export const getEnquiryById = async (id, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');
    if (!token) throw new Error('Authentication token is required');

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
      error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch enquiry'
    };
  }
};

// Update enquiry - Updated with better error handling and status support
// Update enquiry - Updated with better error handling and status support
export const updateEnquiry = async (id, data, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');
    if (!token) throw new Error('Authentication token is required');

    // Sanitize data - only include fields that are provided
    const sanitizedData = {};
    
    if (data.productID !== undefined) sanitizedData.productID = parseInt(data.productID);
    if (data.userID !== undefined) sanitizedData.userID = parseInt(data.userID);
    if (data.quantity !== undefined) sanitizedData.quantity = parseInt(data.quantity);
    if (data.sizeID !== undefined) sanitizedData.sizeID = parseInt(data.sizeID);
    if (data.tunch !== undefined) sanitizedData.tunch = data.tunch ? data.tunch.toString() : null;
    if (data.status !== undefined) sanitizedData.status = data.status;

    console.log(`Updating enquiry ${id} with data:`, sanitizedData);

    const response = await API.put(`/enquiries/${id}`, sanitizedData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: response.data.success || true,
      data: response.data.data || response.data,
      message: response.data.message || 'Enquiry updated successfully'
    };
  } catch (error) {
    console.error(`Error updating enquiry ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to update enquiry'
    };
  }
};

// Delete enquiry - Updated with better error handling
export const deleteEnquiry = async (id, token) => {
  try {
    if (!id) throw new Error('Enquiry ID is required');
    if (!token) throw new Error('Authentication token is required');

    console.log(`Deleting enquiry ${id}`);

    const response = await API.delete(`/enquiries/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      success: true,
      data: response.data,
      message: 'Enquiry deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting enquiry ${id}:`, error);
    return {
      success: false,
      error: error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to delete enquiry'
    };
  }
};

// Get enquiries by user ID
export const getEnquiriesByUser = async (userID, token) => {
  try {
    if (!userID) throw new Error('User ID is required');
    if (!token) throw new Error('Authentication token is required');

    const response = await API.get(`/enquiries/user/${userID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Backend returns array directly
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error(`Error fetching enquiries for user ${userID}:`, error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch user enquiries'
    };
  }
};

// Get current user's enquiries
export const getMyEnquiries = async (token) => {
  try {
    if (!token) throw new Error('Authentication token is required');

    const response = await API.get('/enquiries/my-enquiries', {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Backend returns array directly
    if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching my enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch your enquiries'
    };
  }
};

// Get enquiries with detailed product and size information - Updated with better error handling
export const getDetailedEnquiries = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('🔄 Fetching detailed enquiries...');

    const response = await API.get('/enquiries/detailed', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📋 Detailed enquiries API response:', response.data);

    // Handle different response formats
    if (response.data && response.data.success) {
      return {
        success: true,
        data: Array.isArray(response.data.data) ? response.data.data : [],
        count: response.data.count || 0
      };
    } else if (Array.isArray(response.data)) {
      return {
        success: true,
        data: response.data,
        count: response.data.length
      };
    } else if (response.data) {
      return {
        success: true,
        data: [response.data],
        count: 1
      };
    }

    return {
      success: false,
      data: [],
      error: 'Invalid detailed enquiries response format'
    };

  } catch (error) {
    console.error('❌ Error fetching detailed enquiries:', error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.message || error.message || 'Failed to fetch detailed enquiries'
    };
  }
};

// Get enquiry statistics (for admin dashboard)
export const getEnquiryStats = async (token) => {
  try {
    if (!token) throw new Error('Authentication token is required');

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


// Add helper function to format enquiry data for display
export const formatEnquiryForDisplay = (enquiry) => {
  return {
    ...enquiry,
    createdAt: formatDate(enquiry.createdAt),
    updatedAt: formatDate(enquiry.updatedAt),
    tunch: formatTunch(enquiry.tunch),
    status: enquiry.status || 'pending'
  };
};

// Add helper function to prepare enquiry data for API
export const prepareEnquiryData = (formData) => {
  return {
    productID: parseInt(formData.productID),
    userID: parseInt(formData.userID), 
    quantity: parseInt(formData.quantity),
    sizeID: parseInt(formData.sizeID),
    tunch: formData.tunch || null
  };
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
// 🔍 VALIDATION HELPERS
// ============================

// Validate enquiry data
export const validateEnquiryData = (data) => {
  const errors = {};

  if (!data.productID) {
    errors.productID = 'Product ID is required';
  } else if (isNaN(parseInt(data.productID))) {
    errors.productID = 'Product ID must be a valid number';
  }

  if (!data.userID) {
    errors.userID = 'User ID is required';
  } else if (isNaN(parseInt(data.userID))) {
    errors.userID = 'User ID must be a valid number';
  }

  if (!data.quantity) {
    errors.quantity = 'Quantity is required';
  } else if (isNaN(parseInt(data.quantity)) || parseInt(data.quantity) <= 0) {
    errors.quantity = 'Quantity must be a positive number';
  }

  if (!data.sizeID) {
    errors.sizeID = 'Size ID is required';
  } else if (isNaN(parseInt(data.sizeID))) {
    errors.sizeID = 'Size ID must be a valid number';
  }

  // Tunch is optional in backend
  if (data.tunch && (!validateTunch(data.tunch))) {
    errors.tunch = 'Tunch must be a valid percentage between 0 and 100';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validate enquiry status
export const validateEnquiryStatus = (status) => {
  const validStatuses = ['pending', 'approved', 'rejected', 'cancelled'];
  return validStatuses.includes(status);
};

// ============================
// 🛠️ UTILITY EXPORTS
// ============================
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

// Export enquiry status constants
export const ENQUIRY_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved', 
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

// Export enquiry status colors for UI
export const ENQUIRY_STATUS_COLORS = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red',
  cancelled: 'gray'
};

// Export enquiry status labels
export const ENQUIRY_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled'
};

// ============================
// 🔄 RETRY MECHANISM
// ============================

// Helper function to retry API calls
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API Call attempt ${attempt}/${maxRetries}`);
      const result = await apiCall();
      console.log(`✅ API Call succeeded on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`❌ API Call failed on attempt ${attempt}:`, error.message);
      
      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        console.log('🚫 Not retrying due to client error');
        break;
      }
      
      // Wait before retrying (except on last attempt)
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  console.error(`💥 API Call failed after ${maxRetries} attempts`);
  throw lastError;
};

// ============================
// 🔐 TOKEN MANAGEMENT
// ============================

// Helper function to get token from localStorage
export const getAuthToken = (type = 'admin') => {
  const tokenKey = type === 'admin' ? 'adminToken' : 'userToken';
  return localStorage.getItem(tokenKey);
};

// Helper function to set token in localStorage
export const setAuthToken = (token, type = 'admin') => {
  const tokenKey = type === 'admin' ? 'adminToken' : 'userToken';
  localStorage.setItem(tokenKey, token);
};

// Helper function to remove token from localStorage
export const removeAuthToken = (type = 'admin') => {
  const tokenKey = type === 'admin' ? 'adminToken' : 'userToken';
  localStorage.removeItem(tokenKey);
};

// Helper function to check if token exists and is valid format
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT format validation (3 parts separated by dots)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Try to decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token is expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token format:', error);
    return false;
  }
};

// ============================
// 📱 RESPONSIVE HELPERS
// ============================

// Helper function to detect mobile device
export const isMobileDevice = () => {
  return window.innerWidth <= 768;
};

// Helper function to get optimal image size based on device
export const getOptimalImageSize = () => {
  const width = window.innerWidth;
  
  if (width <= 480) return 'small';
  if (width <= 768) return 'medium';
  if (width <= 1024) return 'large';
  return 'xlarge';
};

// ============================
// 🎨 UI HELPERS
// ============================

// Helper function to format currency
export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount) return 'N/A';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to format date
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('en-IN', { ...defaultOptions, ...options });
};

// Helper function to format relative time
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper function to generate random color
export const generateRandomColor = () => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// ============================
// 🔍 SEARCH & FILTER HELPERS
// ============================

// Helper function to create search regex
export const createSearchRegex = (searchTerm) => {
  if (!searchTerm) return null;
  
  try {
    // Escape special regex characters
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escapedTerm, 'i');
  } catch (error) {
    console.error('Invalid search term:', error);
    return null;
  }
};

// Helper function to highlight search terms
export const highlightSearchTerm = (text, searchTerm) => {
  if (!text || !searchTerm) return text;
  
  const regex = createSearchRegex(searchTerm);
  if (!regex) return text;
  
  return text.replace(regex, `<mark>$&</mark>`);
};

// Helper function to filter array by multiple criteria
export const filterData = (data, filters) => {
  if (!Array.isArray(data)) return [];
  
  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value || value === 'all') return true;
      
      const itemValue = item[key];
      
      if (typeof value === 'string') {
        return String(itemValue).toLowerCase().includes(value.toLowerCase());
      }
      
      return itemValue === value;
    });
  });
};

// ============================
// 📊 DATA PROCESSING HELPERS
// ============================

// Helper function to group data by key
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Helper function to sort data
export const sortData = (data, key, direction = 'asc') => {
  if (!Array.isArray(data)) return [];
  
  return [...data].sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Helper function to paginate data
export const paginateData = (data, page = 1, pageSize = 10) => {
  if (!Array.isArray(data)) return { data: [], total: 0, pages: 0 };
  
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    pages: Math.ceil(data.length / pageSize),
    currentPage: page,
    pageSize
  };
};

// ============================
// 🔔 NOTIFICATION HELPERS
// ============================

// Helper function to show success notification
export const showSuccessNotification = (message, description = '') => {
  if (typeof window !== 'undefined' && window.antd?.notification) {
    window.antd.notification.success({
      message,
      description,
      placement: 'topRight',
      duration: 4.5
    });
  } else {
    console.log('✅ Success:', message, description);
  }
};

// Helper function to show error notification
export const showErrorNotification = (message, description = '') => {
  if (typeof window !== 'undefined' && window.antd?.notification) {
    window.antd.notification.error({
      message,
      description,
      placement: 'topRight',
      duration: 6
    });
  } else {
    console.error('❌ Error:', message, description);
  }
};

// Helper function to show warning notification
export const showWarningNotification = (message, description = '') => {
  if (typeof window !== 'undefined' && window.antd?.notification) {
    window.antd.notification.warning({
      message,
      description,
      placement: 'topRight',
      duration: 5
    });
  } else {
    console.warn('⚠️ Warning:', message, description);
  }
};

// ============================
// 🔧 DEVELOPMENT HELPERS
// ============================

// Helper function to log API calls in development
export const logApiCall = (method, url, data, response) => {
  if (import.meta.env.DEV) {
    console.group(`🔍 API Call: ${method.toUpperCase()} ${url}`);
    console.log('📤 Request Data:', data);
    console.log('📥 Response:', response);
    console.groupEnd();
  }
};

// Helper function to measure performance
export const measurePerformance = (label, fn) => {
  if (import.meta.env.DEV) {
    console.time(label);
    const result = fn();
    console.timeEnd(label);
    return result;
  }
  return fn();
};

// ============================
// 🎯 FINAL EXPORTS
// ============================

// Export all utility functions


// Export version for debugging
export const API_VERSION = '1.0.0';

// Export build timestamp
export const BUILD_TIMESTAMP = new Date().toISOString();

console.log(`🚀 API Library loaded - Version: ${API_VERSION}, Build: ${BUILD_TIMESTAMP}`);
