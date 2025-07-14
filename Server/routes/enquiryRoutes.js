const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');

// POST /api/enquiries - Create a new enquiry
router.post('/', enquiryController.createEnquiry);

// GET /api/enquiries - Get all enquiries
router.get('/', enquiryController.getAllEnquiries);

// GET /api/enquiries/:id - Get a single enquiry
router.get('/:id', enquiryController.getEnquiryById);

// PUT /api/enquiries/:id - Update an enquiry
router.put('/:id', enquiryController.updateEnquiry);

// DELETE /api/enquiries/:id - Delete an enquiry
router.delete('/:id', enquiryController.deleteEnquiry);

// GET /api/enquiries/user/:userID - Get all enquiries by a user
router.get('/user/:userID', enquiryController.getEnquiriesByUser);

module.exports = router;
