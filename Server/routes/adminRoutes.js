const express = require('express');
const router = express.Router();

const {
  adminRegister,
  adminLogin,
  forgotPassword,
  resetPassword,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getProfile,
  updateProfile,
} = require('../controllers/adminController');

const { 
  authenticateAdmin, 
  requireSuperAdmin, 
  requireAdmin,
  adminOrSuperAdmin 
} = require('../middleware/auth');

// --- Public Admin Routes (No authentication required) ---
router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- Protected Admin Profile Routes ---
router.get('/me', authenticateAdmin, getProfile);
router.put('/me', authenticateAdmin, updateProfile);

// --- Admin Management Routes (SuperAdmin only for most operations) ---
// Get all admins - SuperAdmin only
router.get('/', authenticateAdmin, requireSuperAdmin, getAllAdmins);

// Get admin by ID - SuperAdmin only  
router.get('/:id', authenticateAdmin, requireSuperAdmin, getAdminById);

// Update admin - SuperAdmin only (except self-update which goes through /me)
router.put('/:id', authenticateAdmin, requireSuperAdmin, updateAdmin);

// Delete admin - SuperAdmin only
router.delete('/:id', authenticateAdmin, requireSuperAdmin, deleteAdmin);

// --- Special Routes for Role Management ---
// Create new admin - SuperAdmin only (can create both admin and superadmin)
// Note: This uses the same register endpoint but should be protected
router.post('/create', authenticateAdmin, requireSuperAdmin, adminRegister);

module.exports = router;