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
  getProductOptions
} = require('../controllers/productController');

// Multer config: saves files to ./uploads/
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Use multer.fields for both main image and array of slider images
const productImageUpload = upload.fields([
  { name: 'image', maxCount: 1 },     // Thumbnail image
  { name: 'images', maxCount: 10 }    // Additional slider images
]);

// CREATE product (supports thumbnail + multiple slider images or URLs)
router.post('/', productImageUpload, createProduct);

// GET all products
router.get('/', getProducts);

// GET product options (enums for dropdowns) - PLACE THIS BEFORE /:id
router.get('/options', getProductOptions);

// GET single product by ID
router.get('/:id', getProductById);

// UPDATE product (supports new thumbnail + new slider images or URLs)
router.put('/:id', productImageUpload, updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;
