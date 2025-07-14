const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ==========================
// 🌍 Load Environment
// ==========================
dotenv.config();

// ==========================
// 🔌 Connect to MySQL
// ==========================
connectDB()
  .then(() => console.log('✅ MySQL connection established'))
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

// ==========================
// 🚀 Initialize App
// ==========================
const app = express();

// ==========================
// 🔧 Middleware
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serve static files

// ==========================
// 🔗 API Routes
// ==========================
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sizes', require('./routes/sizeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes')); // ✅ Enquiry route added

// ==========================
// ✅ Root Route
// ==========================
app.get('/', (req, res) => {
  res.send('✅ Vimla Jewellers API is running...');
});

// ==========================
// ❌ 404 - Not Found
// ==========================
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
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
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
