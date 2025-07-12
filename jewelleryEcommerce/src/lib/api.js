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

// ============================
// 📦 PRODUCT APIs
// ============================

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

export const getProducts = async (params) => {
  try {
    const response = await API.get('/products', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
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

export const getSizes = () => API.get('/sizes');

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
export const addToCart = (data, token) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/cart/add', sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCart = (token) =>
  API.get('/cart', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDetailedCart = (token) =>
  API.get('/cart/detailed', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getCartTotal = (token) =>
  API.get('/cart/total', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateCartItemQuantity = (itemId, quantity, token) => {
  const sanitizedData = sanitizeData({ quantity });
  return API.patch(`/cart/item/${itemId}`, sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const removeCartItem = (itemId, token) =>
  API.delete(`/cart/item/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const clearCart = (token) =>
  API.delete('/cart/clear', {
    headers: { Authorization: `Bearer ${token}` },
  });

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