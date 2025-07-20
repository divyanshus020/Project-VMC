const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth'); 

// =================================================================
// FINAL DEBUGGING LOG
// This log will confirm if this file is being executed.
// =================================================================
console.log('[Debug] - enquiryRoutes.js file is being executed and router is being configured.');


// GET /api/enquiries/detailed - Get all enquiries with joined data (for Admin)
// The 'protect' middleware is re-added as it is not the source of the 404.
router.get('/detailed', protect, enquiryController.getDetailedEnquiries);

// GET /api/enquiries/my-enquiries - Get the current logged-in user's enquiries
router.get('/my-enquiries', protect, enquiryController.getMyEnquiries);

// GET /api/enquiries/user/:userID - Get all enquiries for a specific user (for Admin)
router.get('/user/:userID', protect, enquiryController.getEnquiriesByUser);

// --- General and Dynamic routes last ---

// GET /api/enquiries - Get all enquiries (basic)
router.get('/', protect, enquiryController.getAllEnquiries);

// GET /api/enquiries/:id - Get a single enquiry by its ID
router.get('/:id', protect, enquiryController.getEnquiryById);

// POST /api/enquiries - Create a new enquiry
router.post('/', protect, enquiryController.createEnquiry);

// PUT /api/enquiries/:id - Update an enquiry
router.put('/:id', protect, enquiryController.updateEnquiry);

// DELETE /api/enquiries/:id - Delete an enquiry
router.delete('/:id', protect, enquiryController.deleteEnquiry);

module.exports = router;
