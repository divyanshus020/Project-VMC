// ✅ src/api.jsx

import axios from 'axios';

// 👉 1️⃣ Create reusable axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
});

// 👉 2️⃣ CREATE Product
export const createProduct = (formData) =>
  API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 👉 3️⃣ CREATE Product with imageUrl (for Postman-style JSON)
export const createProductWithUrl = (data) =>
  API.post('/products', data);

// 👉 4️⃣ GET all Products
export const getProducts = () =>
  API.get('/products');

// 👉 5️⃣ GET single Product by ID
export const getProductById = (id) =>
  API.get(`/products/${id}`);

// 👉 6️⃣ UPDATE Product (with file)
export const updateProduct = (id, formData) =>
  API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// 👉 7️⃣ UPDATE Product with imageUrl
export const updateProductWithUrl = (id, data) =>
  API.put(`/products/${id}`, data);

// 👉 8️⃣ DELETE Product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
