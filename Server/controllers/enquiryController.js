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

// Update an enquiry
exports.updateEnquiry = async (req, res) => {
  try {
    const { productID, userID, quantity, sizeID, tunch } = req.body;
    const updated = await enquiryModel.update(req.params.id, { productID, userID, quantity, sizeID, tunch });
    res.json({ message: "Enquiry updated", enquiry: updated });
  } catch (err) {
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
