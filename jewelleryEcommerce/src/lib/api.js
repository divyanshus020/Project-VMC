import axios from 'axios';

// ✅ 1️⃣ Create reusable Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ⚠️ Update for production
});

// =======================
// 📦 PRODUCT APIs
// =======================

// Create product (with image file)
export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Create product (with image URL only)
export const createProductWithUrl = (data) =>
  API.post('/products', data);

// Get all products
export const getProducts = () => API.get('/products');

// Get single product by ID
export const getProductById = (id) => API.get(`/products/${id}`);

// Update product (with image file)
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Update product (with image URL only)
export const updateProductWithUrl = (id, data) =>
  API.put(`/products/${id}`, data);

// Delete product
export const deleteProduct = (id) => API.delete(`/products/${id}`);


// =======================
// 👤 USER APIs (OTP-based)
// =======================

// ✅ Check if a user exists (by phone number)
export const checkUserExists = (phoneNumber) =>
  API.post('/users/check-exists', { phoneNumber });

// Send OTP to user phone
export const sendOtp = (phoneNumber) =>
  API.post('/users/send-otp', { phoneNumber });

// Verify OTP for login or registration
export const verifyOtp = (phoneNumber, otp) =>
  API.post('/users/verify-otp-login', { phoneNumber, otp });

// Register new user after OTP verification
export const registerUser = (data) =>
  API.post('/users/register', data);

// Get user profile (token required)
export const getProfile = (token) =>
  API.get('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update user profile (token required)
export const updateProfile = (data, token) =>
  API.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


// =======================
// 🛡️ ADMIN APIs
// =======================

// Admin login
export const loginAdmin = (data) => API.post('/admin/login', data);

// Example for future use:
// export const getAdminDashboard = (token) =>
//   API.get('/admin/dashboard', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
