const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Multer config: saves to ./uploads/
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// CREATE product (with image)
router.post('/', upload.single('image'), createProduct);

// GET all products
router.get('/', getProducts);

// GET single product by ID
router.get('/:id', getProductById);

// UPDATE product (with optional new image)
router.put('/:id', upload.single('image'), updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;
