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

// Import enums from Product model for options endpoint
const Product = require('../models/Product');

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
router.get('/options', (req, res) => {
  res.json({
    capSizes: Product.schema.path('capSize').enumValues,
    malaWeights: Product.schema.path('weight').enumValues,
    tulsiRudrakshMM: Product.schema.path('tulsiRudrakshMM').enumValues,
    tulsiRudrakshEstPcs: Product.schema.path('estPCS').enumValues,
    diameters: Product.schema.path('diameter').enumValues,
    ballGauges: Product.schema.path('ballGauge').enumValues,
    wireGauges: Product.schema.path('wireGauge').enumValues,
    otherWeights: Product.schema.path('otherWeight').enumValues,
  });
});

// GET single product by ID
router.get('/:id', getProductById);

// UPDATE product (supports new thumbnail + new slider images or URLs)
router.put('/:id', productImageUpload, updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;
