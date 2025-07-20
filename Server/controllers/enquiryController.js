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
    console.error("Error creating enquiry:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all basic enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.findAllWithDetails(); // Using detailed find for consistency
    res.json(enquiries);
  } catch (err) {
    console.error("Error getting all enquiries:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all enquiries with detailed, joined data
exports.getDetailedEnquiries = async (req, res) => {
    try {
        const detailedEnquiries = await enquiryModel.findAllWithDetails();
        res.json({
            success: true,
            data: detailedEnquiries,
            count: detailedEnquiries.length
        });
    } catch (err) {
        console.error("Error getting detailed enquiries:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get a specific enquiry by ID
exports.getEnquiryById = async (req, res) => {
  try {
    // **FIX:** Changed from findById to the correct function name: findWithDetailsById
    const enquiry = await enquiryModel.findWithDetailsById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    console.error(`Error getting enquiry by ID ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
};

// Update an enquiry and emit a real-time update
exports.updateEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const sanitizedData = {};
    for (const [key, value] of Object.entries(updateData)) {
      sanitizedData[key] = value === undefined ? null : value;
    }

    const updateResult = await enquiryModel.update(id, sanitizedData);

    if (!updateResult || updateResult.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Enquiry not found or not updated' });
    }

    const updatedEnquiry = await enquiryModel.findWithDetailsById(id);
    if (!updatedEnquiry) {
        return res.status(404).json({ success: false, error: 'Could not retrieve updated enquiry details.' });
    }

    const io = res.locals.io;
    const userIdForRoom = updatedEnquiry.userID;

    if (io && userIdForRoom) {
        io.to(String(userIdForRoom)).emit('enquiryStatusUpdated', updatedEnquiry);
        console.log(`✅ Emitted 'enquiryStatusUpdated' to room: ${userIdForRoom}`);
    } else {
        console.warn('Socket.IO instance or userID not found. Real-time event not sent.');
    }

    res.status(200).json({
      success: true,
      data: updatedEnquiry,
      message: 'Enquiry updated successfully and real-time event sent.'
    });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update enquiry'
    });
  }
};

// Get the current logged-in user's enquiries (detailed)
exports.getMyEnquiries = async (req, res) => {
  try {
    const userID = req.user?.id || req.user?.userId;
    if (!userID) {
      return res.status(401).json({ success: false, error: "User not authenticated" });
    }

    const enquiries = await enquiryModel.findDetailedByUser(userID);
    
    res.json({ success: true, data: enquiries || [] });
  } catch (err) {
    console.error('Error fetching user enquiries:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete an enquiry
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await enquiryModel.delete(id);

    if (!result || result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }

    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    console.error(`Error deleting enquiry ${req.params.id}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all enquiries for a specific user ID (Admin use)
exports.getEnquiriesByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const enquiries = await enquiryModel.findDetailedByUser(userID);
    res.json(enquiries);
  } catch (err) {
    console.error(`Error getting enquiries for user ${req.params.userID}:`, err);
    res.status(500).json({ error: err.message });
  }
};
