const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createProduct,
  getProducts
} = require('../controllers/productController');

// Multer config
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('image'), createProduct);
router.get('/', getProducts);

module.exports = router;
