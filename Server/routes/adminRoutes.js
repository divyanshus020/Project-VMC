const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ==============================
// 👤 Admin Routes
// ==============================

// Static routes first!
router.post('/register', adminController.adminRegister);
router.post('/login', adminController.adminLogin);
router.get('/profile', adminController.getProfile);
router.put('/profile', adminController.updateProfile);

// Then collection routes
router.get('/', adminController.getAllAdmins);

// Dynamic routes LAST
router.get('/:id', adminController.getAdminById);
router.put('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
