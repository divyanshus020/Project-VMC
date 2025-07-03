import axios from 'axios';

// ✅ 1️⃣ Create reusable Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// =======================
// 📦 PRODUCT APIs
// =======================

// Create product (with file upload)
export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Create product (with image URL + other details)
export const createProductWithUrl = (data) => API.post('/products', data);

// Get all products
export const getProducts = () => API.get('/products');

// Get product by ID
export const getProductById = (id) => API.get(`/products/${id}`);

// Get product options (for enums like capSize, weight, etc.)
export const getProductOptions = () => API.get('/products/options');

// Update product (with file upload)
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Update product (with image URL + data)
export const updateProductWithUrl = (id, data) =>
  API.put(`/products/${id}`, data);

// Delete product
export const deleteProduct = (id) => API.delete(`/products/${id}`);


// =======================
// 👤 USER APIs (OTP-based auth)
// =======================

export const checkUserExists = (phoneNumber) =>
  API.post('/users/check-exists', { phoneNumber });

export const sendOtpForLogin = (phoneNumber) =>
  API.post('/users/send-otp-login', { phoneNumber });

export const sendOtpForRegister = (phoneNumber) =>
  API.post('/users/send-otp-register', { phoneNumber });

export const verifyOtpForLogin = (phoneNumber, otp) =>
  API.post('/users/verify-otp-login', { phoneNumber, otp });

export const verifyOtpForRegister = (data) =>
  API.post('/users/verify-otp-register', data);

export const getProfile = (token) =>
  API.get('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateProfile = (data, token) =>
  API.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteProfile = (token) =>
  API.delete('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteUser = (id, token) =>
  API.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllUsers = () => API.get('/users');


// =======================
// 🛡️ ADMIN APIs
// =======================

export const registerAdmin = (data) => API.post('/admin/register', data);
export const loginAdmin = (data) => API.post('/admin/login', data);

export const getAdminProfile = (token) =>
  API.get('/admin/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateAdminProfile = (data, token) =>
  API.put('/admin/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllAdmins = () => API.get('/admin');


// =======================
// 🛒 CART APIs
// =======================

// Add item to cart
export const addToCart = (data, token) =>
  API.post('/cart/add', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Get cart
export const getCart = (token) =>
  API.get('/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Remove item from cart (now expects itemId, not productId)
export const removeCartItem = (itemId, token) =>
  API.delete(`/cart/remove/${itemId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Clear all items in cart
export const clearCart = (token) =>
  API.delete('/cart/clear', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
