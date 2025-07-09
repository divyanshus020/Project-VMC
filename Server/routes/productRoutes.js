const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// ============================
// 🔧 Multer Configuration
// ============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp).'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Support single image + multiple gallery images
const productImageUpload = upload.fields([
  { name: 'image', maxCount: 1 },   // Thumbnail
  { name: 'images', maxCount: 10 }, // Slider/gallery
]);

// ============================
// 📦 PRODUCT ROUTES
// ============================

/**
 * @route   POST /api/products
 * @desc    Create a new product
 */
router.post('/', productImageUpload, createProduct);

/**
 * @route   GET /api/products
 * @desc    Get all products (optional ?dieNo=15)
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 */
router.get('/:id', getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 */
router.put('/:id', productImageUpload, updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 */
router.delete('/:id', deleteProduct);

module.exports = router;
