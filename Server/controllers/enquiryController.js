const enquiryModel = require('../models/enquiryModel');
const adminModel = require('../models/Admin'); // Import the admin model
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); // Use a robust ID generator for cartId

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
    const firstEnquiry = enquiryList[0];
    const subject = isSingleEnquiry ? `New Enquiry from ${firstEnquiry.fullName}` : `New Multi-Item Enquiry from ${firstEnquiry.fullName}`;
    
    // --- NEW DETAILED HTML TEMPLATE ---

    // 1. Extract common details from the first enquiry item
    const userDetailsHtml = `
        <p><strong>Name:</strong> ${firstEnquiry.fullName}<br>
        <strong>Email:</strong> ${firstEnquiry.email}<br>
        <strong>Phone:</strong> ${firstEnquiry.phoneNumber}</p>
    `;
    const enquiryDetailsHtml = `
        <p><strong>Enquiry Date:</strong> ${new Date(firstEnquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}<br>
        <strong>Cart/Enquiry No:</strong> ${firstEnquiry.cartId || firstEnquiry.enquiryID}</p>
    `;

    // 2. Build an HTML table for all the items
    const itemsTableHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Design</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Die No.</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Quantity</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Weight</th>
                    <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Tunch</th>
                </tr>
            </thead>
            <tbody>
                ${enquiryList.map(item => `
                    <tr>
                        <td style="padding: 12px; border: 1px solid #ddd;">${item.productName}</td>
                        <td style="padding: 12px; border: 1px solid #ddd;">${item.DieNo || item.dieNo || 'N/A'}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">
                            ${item.isCustomWeight 
                                ? `<span style="color: #2563eb; font-weight: bold;">${item.weight}g</span><br><small style="color: #1d4ed8;">(Custom Weight)</small>` 
                                : `${item.weight || item.size_weight || 'N/A'}g`
                            }
                        </td>
                        <td style="padding: 12px; border: 1px solid #ddd; text-align: center;">${item.tunch}%</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // 3. Assemble the final email body
    const mailOptions = {
      from: `"Vimla Jewellers" <${process.env.EMAIL_USER}>`,
      to: adminEmails.join(', '),
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>New Enquiry Notification</h2>
          <hr>
          <h3>User Details:</h3>
          ${userDetailsHtml}
          <h3>Enquiry Details:</h3>
          ${enquiryDetailsHtml}
          ${itemsTableHtml}
          <p style="margin-top: 20px;">Please log in to the admin dashboard to manage this enquiry.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Detailed email sent successfully:', info.messageId);

  } catch (emailError) {
    console.error('❌ Failed to send enquiry notification email:', emailError);
  }
}



// Create a new enquiry and trigger the email notification
exports.createEnquiry = async (req, res) => {
  try {
    console.log('Raw req.body received:', req.body);
    const { enquiries, userID, items, productID } = req.body;
    let enquiriesToProcess = [];
    let cartId = null; // Initialize cartId

    if (userID && Array.isArray(items) && items.length > 0) {
      // This is a cart submission
      cartId = uuidv4(); // Generate a single cartId for the transaction
      enquiriesToProcess = items.map(item => ({ ...item, userID, cartId }));
    } else if (Array.isArray(enquiries) && enquiries.length > 0) {
      // This handles single or multiple items wrapped in an 'enquiries' array
      if (enquiries.length > 1) {
        cartId = uuidv4();
      }
      console.log('Processing enquiries array:', enquiries);
      enquiriesToProcess = enquiries.map(e => {
        console.log('Individual enquiry before mapping:', e);
        return {...e, cartId};
      });
    } else if (productID && userID) {
      // This handles a single item enquiry from the product page
      enquiriesToProcess = [req.body];
    } else {
      return res.status(400).json({ success: false, error: "Invalid request format." });
    }

    const createdEnquiryIds = [];
    for (const enquiry of enquiriesToProcess) {
      const { productID, userID: currentUserID, quantity, sizeID, tunch, cartId: currentCartId, weight, totalWeight, isCustomWeight, DieNo } = enquiry;

      console.log('Processing enquiry with weight data:', {
        productID, currentUserID, quantity, sizeID, tunch, weight, totalWeight, isCustomWeight, DieNo
      });

      if (!productID || !currentUserID || !quantity || !sizeID) {
        console.warn("Skipping enquiry with missing fields:", enquiry);
        continue;
      }

      const newEnquiry = await enquiryModel.create({ 
        productID, 
        userID: currentUserID, 
        quantity, 
        sizeID, 
        tunch, 
        cartId: currentCartId,
        weight,
        totalWeight,
        isCustomWeight,
        DieNo
      });
      createdEnquiryIds.push(newEnquiry.enquiryID);
    }

    if (createdEnquiryIds.length === 0) {
        return res.status(400).json({ success: false, error: "No valid enquiries were processed." });
    }

    // Fetch the full details of the newly created enquiries for the email notification
    const detailedCreatedEnquiries = await enquiryModel.findMultipleByIds(createdEnquiryIds);

    // Send one email for all processed enquiries
    if (detailedCreatedEnquiries.length > 0) {
        sendEnquiryNotification(detailedCreatedEnquiries);
    }

    res.status(201).json({
      success: true,
      message: `${createdEnquiryIds.length} enquiry/enquiries submitted successfully`,
      enquiryIDs: createdEnquiryIds,
    });
  } catch (err) {
    console.error("Error creating enquiries:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};



// --- All other controller functions remain unchanged ---

exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.findAllWithDetails();
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
