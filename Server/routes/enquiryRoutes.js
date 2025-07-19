const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

// GET /api/enquiries/my-enquiries - Get current user's enquiries
router.get('/my-enquiries', protect, enquiryController.getMyEnquiries);

// GET /api/enquiries/user/:userID - Get all enquiries by a user
router.get('/user/:userID', protect, enquiryController.getEnquiriesByUser);

// POST /api/enquiries - Create a new enquiry
router.post('/', protect, enquiryController.createEnquiry);

// GET /api/enquiries - Get all enquiries
router.get('/', protect, enquiryController.getAllEnquiries);

// GET /api/enquiries/:id - Get a single enquiry
router.get('/:id', protect, enquiryController.getEnquiryById);

// PUT /api/enquiries/:id - Update an enquiry
router.put('/:id', protect, enquiryController.updateEnquiry);

// DELETE /api/enquiries/:id - Delete an enquiry
router.delete('/:id', protect, enquiryController.deleteEnquiry);

module.exports = router;
