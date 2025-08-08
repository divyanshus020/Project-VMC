const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// This line is critical. It assumes your middleware file is located at:
// Server/
// ├── middleware/
// │   └── auth.js  <-- The file must be named this
// └── routes/
//     └── enquiryRoutes.js (this file)
const { protect } = require('../middleware/auth'); 


// =================================================================
// FINAL & CORRECT ROUTE CONFIGURATION
// =================================================================

// Specific routes must be defined before dynamic routes to ensure they are matched correctly.

// GET /api/enquiries/detailed - Get all enquiries with joined data (for Admin)
router.get('/detailed', protect, enquiryController.getDetailedEnquiries);

// GET /api/enquiries/my-enquiries - Get the current logged-in user's enquiries
router.get('/my-enquiries', protect, enquiryController.getMyEnquiries);

// GET /api/enquiries/user/:userID - Get all enquiries for a specific user (for Admin)
router.get('/user/:userID', protect, enquiryController.getEnquiriesByUser);

// --- General routes for the base '/api/enquiries' path ---
 
// POST /api/enquiries - Create a new enquiry
router.post('/', protect, enquiryController.createEnquiry);

// GET /api/enquiries - Get all enquiries (basic)
router.get('/', protect, enquiryController.getAllEnquiries);


// --- Dynamic routes with an ID must be last ---

// GET /api/enquiries/:id - Get a single enquiry by its ID
router.get('/:id', protect, enquiryController.getEnquiryById);

// PUT /api/enquiries/:id - Update an enquiry
router.put('/:id', protect, enquiryController.updateEnquiry);

// DELETE /api/enquiries/:id - Delete an enquiry
router.delete('/:id', protect, enquiryController.deleteEnquiry);

module.exports = router;
