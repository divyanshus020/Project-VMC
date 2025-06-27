const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ==========================
// 🔧 Middleware
// ==========================
app.use(cors());
app.use(express.json());

// Serve static files (e.g. images, uploads)
app.use('/uploads', express.static('uploads'));

// Optional: Enable request logging in development
// const morgan = require('morgan');
// if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ==========================
// 🔗 Routes
// ==========================
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Optional: OTP-based login

// Health Check Route
app.get('/', (req, res) => {
  res.send('✅ API is running on Vimla Jewellers backend');
});

// ==========================
// ❌ 404 Not Found Handler
// ==========================
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// ==========================
// 🚨 Global Error Handler
// ==========================
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==========================
// 🚀 Start Server
// ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
