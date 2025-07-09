const express = require('express');
const router = express.Router();

const {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize
} = require('../controllers/sizeController');

// 📏 SIZE ROUTES

// ✅ Create a new Size
router.post('/', createSize);

// ✅ Get all Sizes
router.get('/', getAllSizes);

// ✅ Get a single Size by ID
router.get('/:id', getSizeById);

// ✅ Update Size by ID
router.put('/:id', updateSize);

// ✅ Delete Size by ID
router.delete('/:id', deleteSize);

module.exports = router;
