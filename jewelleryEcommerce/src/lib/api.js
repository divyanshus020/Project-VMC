import axios from 'axios';

// ✅ 1️⃣ Create reusable Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ⚠️ Change to production URL in production
});

// =======================
// 📦 PRODUCT APIs
// =======================

// Create product (with file upload)
export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Create product (with image URL)
export const createProductWithUrl = (data) => API.post('/products', data);

// Get all products
export const getProducts = () => API.get('/products');

// Get product by ID
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
// 👤 USER APIs (OTP-based auth)
// =======================

// ✅ 1️⃣ Check if user exists
export const checkUserExists = (phoneNumber) =>
  API.post('/users/check-exists', { phoneNumber });

// ✅ 2️⃣ Send OTP for login
export const sendOtpForLogin = (phoneNumber) =>
  API.post('/users/send-otp-login', { phoneNumber });

// ✅ 3️⃣ Send OTP for register
export const sendOtpForRegister = (phoneNumber) =>
  API.post('/users/send-otp-register', { phoneNumber });

// ✅ 4️⃣ Verify OTP for login
export const verifyOtpForLogin = (phoneNumber, otp) =>
  API.post('/users/verify-otp-login', { phoneNumber, otp });

// ✅ 5️⃣ Verify OTP & register
export const verifyOtpForRegister = (data) =>
  API.post('/users/verify-otp-register', data);

// ✅ 6️⃣ Get profile
export const getProfile = (token) =>
  API.get('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ✅ 7️⃣ Update profile
export const updateProfile = (data, token) =>
  API.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


// =======================
// 🛡️ ADMIN APIs
// =======================

// ✅ Admin login
export const loginAdmin = (data) => API.post('/admin/login', data);

// Future use:
// export const getAdminDashboard = (token) =>
//   API.get('/admin/dashboard', {
//     headers: { Authorization: `Bearer ${token}` },
//   });
