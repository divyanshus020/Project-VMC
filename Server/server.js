const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

// Load Environment
dotenv.config();

// Connect to MySQL
connectDB()
  .then(() => console.log('✅ MySQL connection established'))
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err.message);
    process.exit(1);
  });

// Initialize App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Socket.IO Integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.use((req, res, next) => {
  res.locals.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log('✅ A user connected with socket ID:', socket.id);
  socket.on('joinUserRoom', (userId) => {
    if (userId) {
        socket.join(String(userId));
        console.log(`User with socket ID ${socket.id} joined room: ${userId}`);
    }
  });
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// =================================================================
// 🔗 API ROUTES
// =================================================================

// **FINAL DEBUGGING STEP:** This middleware will log every incoming request URL.
app.use((req, res, next) => {
    console.log(`[Logger] - Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/sizes', require('./routes/sizeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

try {
  const enquiryRoutes = require('./routes/enquiryRoutes');
  app.use('/api/enquiries', enquiryRoutes);
  console.log('✅ Successfully loaded and registered /api/enquiries routes.');
} catch (error) {
  console.error('❌ CRITICAL ERROR loading enquiryRoutes.js:', error);
}

// Root Route
app.get('/', (req, res) => {
  res.send('✅ API with Real-Time Support is running...');
});

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Global Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
