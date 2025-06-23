import axios from 'axios';

// 👉 1️⃣ Create reusable axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ Update for production if needed
});

// =======================
// 📦 PRODUCT APIs
// =======================

// CREATE Product (with image file)
export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// CREATE Product (with imageUrl for testing)
export const createProductWithUrl = (data) =>
  API.post('/products', data);

// GET all Products
export const getProducts = () => API.get('/products');

// GET single Product by ID
export const getProductById = (id) => API.get(`/products/${id}`);

// UPDATE Product (with file)
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// UPDATE Product (with imageUrl)
export const updateProductWithUrl = (id, data) =>
  API.put(`/products/${id}`, data);

// DELETE Product
export const deleteProduct = (id) => API.delete(`/products/${id}`);


// =======================
// 👤 USER APIs
// =======================

// REGISTER User
export const registerUser = (data) => API.post('/users/register', data);

// LOGIN User
export const loginUser = (data) => API.post('/users/login', data);

// GET User Profile (requires token)
export const getProfile = (token) =>
  API.get('/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// UPDATE User Profile (password update, requires token)
export const updateProfile = (data, token) =>
  API.put('/users/profile', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
