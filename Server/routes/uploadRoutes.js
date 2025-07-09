const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadMultipleImages } = require('../controllers/uploadController');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// POST /api/upload/multiple
router.post('/multiple', upload.array('images', 10), uploadMultipleImages);

module.exports = router;
