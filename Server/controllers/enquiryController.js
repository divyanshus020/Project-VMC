const enquiryModel = require('../models/enquiryModel');
const adminModel = require('../models/Admin'); // Import the admin model
const nodemailer = require('nodemailer');

// Helper function to send email notification to ALL admins
async function sendEnquiryNotification(enquiryDetails) {
    try {
        // 1. Fetch all active admin email addresses from the database
        const adminEmails = await adminModel.findAllAdminEmails();

        if (!adminEmails || adminEmails.length === 0) {
            console.warn('No active admin emails found. Cannot send notification email.');
            return; // Stop if no admins are found
        }

        // 2. Nodemailer transporter setup using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // Typically false for port 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 3. Create mail options, sending to all fetched admin emails
        const mailOptions = {
            from: `"Vimla Jewellers" <${process.env.EMAIL_USER}>`,
            to: adminEmails.join(', '), // Nodemailer can handle a comma-separated string of recipients
            subject: 'New Customer Enquiry Received!',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>New Enquiry Notification</h2>
                    <p>A new enquiry has been submitted on the website. Please review the details below:</p>
                    <hr>
                    <h3>Enquiry Details:</h3>
                    <ul>
                        <li><strong>Enquiry ID:</strong> ${enquiryDetails.enquiryID}</li>
                        <li><strong>User ID:</strong> ${enquiryDetails.userID}</li>
                        <li><strong>Product ID:</strong> ${enquiryDetails.productID}</li>
                        <li><strong>Size ID:</strong> ${enquiryDetails.sizeID}</li>
                        <li><strong>Quantity:</strong> ${enquiryDetails.quantity}</li>
                        <li><strong>Tunch:</strong> ${enquiryDetails.tunch || 'N/A'}</li>
                    </ul>
                    <p>Please log in to the admin dashboard to manage this enquiry.</p>
                </div>
            `,
        };

        // 4. Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email notification sent successfully to all admins:', info.messageId);

    } catch (emailError) {
        // Log the error, but don't let it crash the API request
        console.error('❌ Failed to send enquiry notification email:', emailError);
    }
}


// Create a new enquiry and trigger the email notification
exports.createEnquiry = async (req, res) => {
  try {
    const { productID, userID, quantity, sizeID, tunch } = req.body;
    if (!productID || !userID || !quantity || !sizeID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 1. Save the new enquiry to the database
    const newEnquiry = await enquiryModel.create({ productID, userID, quantity, sizeID, tunch });

    // 2. Send the email notification in the background (fire-and-forget)
    sendEnquiryNotification(newEnquiry);

    // 3. Respond to the user immediately without waiting for the email to send
    res.status(201).json({ message: "Enquiry submitted successfully", enquiry: newEnquiry });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    res.status(500).json({ error: err.message });
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
