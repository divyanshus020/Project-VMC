const enquiryModel = require('../models/enquiryModel');
const adminModel = require('../models/Admin'); // Import the admin model
const nodemailer = require('nodemailer');

// Helper function to send email notification to ALL admins
async function sendEnquiryNotification(enquiryList) {
  try {
    if (!Array.isArray(enquiryList) || enquiryList.length === 0) {
      console.warn('❌ No enquiry data provided.');
      return;
    }

    // 1. Fetch all active admin email addresses from the database
    const adminEmails = await adminModel.findAllAdminEmails();

    if (!adminEmails || adminEmails.length === 0) {
      console.warn('❌ No active admin emails found. Cannot send notification email.');
      return;
    }

    // 2. Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isSingleEnquiry = enquiryList.length === 1;
    const subject = isSingleEnquiry ? 'New Customer Enquiry Received!' : 'New Customer Enquiries Received!';
    const title = isSingleEnquiry ? 'New Enquiry Notification' : 'New Enquiries Notification';

    // 3. Build enquiry details HTML for all enquiries
    let enquiriesHtml = enquiryList
      .map((enquiry, index) => {
        return `
          <h4>Enquiry #${index + 1}</h4>
          <ul>
            <li><strong>Enquiry ID:</strong> ${enquiry.enquiryID}</li>
            <li><strong>User:</strong> ${enquiry.fullName || `ID: ${enquiry.userID}`}</li>
            <li><strong>Product:</strong> ${enquiry.productName || `ID: ${enquiry.productID}`}</li>
            <li><strong>Die No:</strong> ${enquiry.dieNo || 'N/A'}</li>
            <li><strong>Quantity:</strong> ${enquiry.quantity}</li>
            <li><strong>Tunch:</strong> ${enquiry.tunch || 'N/A'}</li>
          </ul>
          <hr>
        `;
      })
      .join("");

    // 4. Email body with dynamic subject and title
    const mailOptions = {
      from: `"Vimla Jewellers" <${process.env.EMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${title}</h2>
          <p>The following enquiries were submitted:</p>
          ${enquiriesHtml}
          <p>Please log in to the admin dashboard to manage these enquiries.</p>
        </div>
      `,
    };

    // 5. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

  } catch (emailError) {
    console.error('❌ Failed to send enquiry notification email:', emailError);
  }
}



// Create a new enquiry and trigger the email notification
exports.createEnquiry = async (req, res) => {
  try {
    const { enquiries, userID, items, productID } = req.body;
    let enquiriesToProcess = [];

    // **FIXED**: Handle different payload formats from the frontend
    if (Array.isArray(enquiries) && enquiries.length > 0) {
      // Handles format from old cart: { enquiries: [item1, item2] }
      enquiriesToProcess = enquiries;
    } else if (userID && Array.isArray(items) && items.length > 0) {
      // Handles format from new cart: { userID: 1, items: [item1, item2] }
      enquiriesToProcess = items.map(item => ({ ...item, userID }));
    } else if (productID && userID) {
      // Handles format from ProductInfo page (single item): { productID, userID, ... }
      enquiriesToProcess = [req.body];
    } else {
      // If no format matches, it's a bad request
      return res.status(400).json({ success: false, error: "Invalid request format. Expected 'enquiries' array, 'items' array, or a single enquiry object." });
    }

    const detailedCreatedEnquiries = [];
    for (const enquiry of enquiriesToProcess) {
      const { productID, userID: currentUserID, quantity, sizeID, tunch } = enquiry;

      if (!productID || !currentUserID || !quantity || !sizeID) {
        console.warn("Skipping enquiry with missing fields:", enquiry);
        continue;
      }

      const newEnquiry = await enquiryModel.create({ productID, userID: currentUserID, quantity, sizeID, tunch });
      
      // **FIXED**: After creating, fetch the full details of that specific enquiry
      // This uses a function that we know exists in the model.
      const detailedEnquiry = await enquiryModel.findWithDetailsById(newEnquiry.enquiryID);
      if(detailedEnquiry) {
        detailedCreatedEnquiries.push(detailedEnquiry);
      }
    }

    if (detailedCreatedEnquiries.length === 0) {
        return res.status(400).json({ success: false, error: "No valid enquiries were processed." });
    }

    // Send one email for all processed enquiries
    sendEnquiryNotification(detailedCreatedEnquiries);

    res.status(201).json({
      success: true,
      message: `${detailedCreatedEnquiries.length} enquiry/enquiries submitted successfully`,
      enquiries: detailedCreatedEnquiries,
    });
  } catch (err) {
    console.error("Error creating enquiries:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



// --- All other controller functions remain unchanged ---

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.findAllWithDetails(); // Using detailed find for consistency
    res.json(enquiries);
  } catch (err) {
    console.error("Error getting all enquiries:", err);
    res.status(500).json({ error: err.message });
  }
};

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

exports.getEnquiryById = async (req, res) => {
  try {
    const enquiry = await enquiryModel.findWithDetailsById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    console.error(`Error getting enquiry by ID ${req.params.id}:`, err);
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
