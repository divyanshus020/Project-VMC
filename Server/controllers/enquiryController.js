const enquiryModel = require('../models/enquiryModel');

// Create a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { productID, userID, quantity, sizeID, tunch } = req.body;
    if (!productID || !userID || !quantity || !sizeID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const enquiry = await enquiryModel.create({ productID, userID, quantity, sizeID, tunch });
    res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.findAll();
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await enquiryModel.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sanitizedData = {};
    for (const [key, value] of Object.entries(updateData)) {
      sanitizedData[key] = value === undefined ? null : value;
    }

    const result = await enquiryModel.update(id, sanitizedData); // Assuming `update` method exists

    res.status(200).json({
      success: true,
      data: result,
      message: 'Enquiry updated successfully'
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update enquiry'
    });
  }
};

// Get current user's enquiries
exports.getMyEnquiries = async (req, res) => {
  try {
    // Extract user ID from the authenticated user (assuming you have auth middleware)
    const userID = req.user?.userId || req.user?.id || req.user?.userID;
    
    console.log('Auth user object:', req.user);
    console.log('Extracted userID:', userID);
    
    if (!userID) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    console.log('Fetching enquiries for user ID:', userID);
    
    const enquiries = await enquiryModel.findByUser(userID);
    
    console.log('Found enquiries:', enquiries);
    
    if (!enquiries || enquiries.length === 0) {
      return res.json([]);
    }
    
    res.json(enquiries);
  } catch (err) {
    console.error('Error fetching user enquiries:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const result = await enquiryModel.delete(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get enquiries by user ID
exports.getEnquiriesByUser = async (req, res) => {
  try {
    const userID = req.params.userID;
    const enquiries = await enquiryModel.findByUser(userID);
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
