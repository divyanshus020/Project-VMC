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
export const createProduct = (formData) => {
  const sanitizedFormData = sanitizeFormData(formData);
  return API.post('/products', sanitizedFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const createProductWithUrl = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/products', sanitizedData);
};

export const getProducts = (params) => API.get('/products', { params });

export const getProductById = (id) => {
  if (!id) throw new Error('Product ID is required');
  return API.get(`/products/${id}`);
};

export const updateProduct = (id, formData) => {
  const sanitizedFormData = sanitizeFormData(formData);
  return API.put(`/products/${id}`, sanitizedFormData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProductWithUrl = (id, data) => {
  const sanitizedData = sanitizeData(data);
  return API.put(`/products/${id}`, sanitizedData);
};

export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getCategories = async () => {
  try {
    const { data: products } = await API.get('/products');
    const uniqueCategories = [...new Set(products.map(p => p.category))]
      .filter(cat => cat && cat.trim() !== '')
      .sort();
    return { data: uniqueCategories };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [] };
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
// 👤 USER APIs (OTP Auth)
// ============================
export const checkUserExists = (phoneNumber) =>
  API.post('/users/check-exists', { phoneNumber });

export const sendOtpForLogin = (phoneNumber) =>
  API.post('/users/send-otp-login', { phoneNumber });

export const sendOtpForRegister = (phoneNumber) =>
  API.post('/users/send-otp-register', { phoneNumber });

export const verifyOtpForLogin = (phoneNumber, otp) =>
  API.post('/users/verify-otp-login', { phoneNumber, otp });

export const verifyOtpForRegister = (data) => {
  const sanitizedData = sanitizeData(data);
  return API.post('/users/verify-otp-register', sanitizedData);
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
  API.get('/admin/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAdminProfile = (data, token) => {
  const sanitizedData = sanitizeData(data);
  return API.put('/admin/profile', sanitizedData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllAdmins = () => API.get('/admin');

// ============================
// 🛒 CART APIs
// ============================
export const addToCart = (data, token) => {
  // Now supports productId, quantity, DieNo, and weight
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