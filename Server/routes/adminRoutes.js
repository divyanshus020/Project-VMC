const express = require('express');
const router = express.Router();

const {
  adminRegister,
  adminLogin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getProfile,
  updateProfile,
} = require('../controllers/adminController');

// Optional: Middleware for authentication & role-based access (stub example)
// const { authenticateAdmin } = require('../middlewares/auth');

// --- Admin Authentication ---
router.post('/register', adminRegister);
router.post('/login', adminLogin);

// --- Admin Profile ---
router.get('/me', /* authenticateAdmin, */ getProfile);
router.put('/me', /* authenticateAdmin, */ updateProfile);

// --- Admin Management ---
router.get('/', /* authenticateAdmin, */ getAllAdmins);
router.get('/:id', /* authenticateAdmin, */ getAdminById);
router.put('/:id', /* authenticateAdmin, */ updateAdmin);
router.delete('/:id', /* authenticateAdmin, */ deleteAdmin);

module.exports = router;
