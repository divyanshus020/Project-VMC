const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// A helper function for consistent error responses
const sendErrorResponse = (res, statusCode, message, error) => {
  res.status(statusCode).json({
    message,
    // Only include detailed error in non-production environments for security
    ...(process.env.NODE_ENV !== 'production' && error && { error: error.message }),
  });
};


// --- AUTHENTICATION CONTROLLERS ---

/**
 * @desc    Register a new admin. Can also be used by a SuperAdmin to create other admins.
 * @route   POST /api/admins/register
 * @route   POST /api/admins/create
 * @access  Public / SuperAdmin
 */
exports.adminRegister = async (req, res) => {
  const { email, password, name, role, isActive } = req.body;

  // --- Input Validation ---
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please provide a valid email address" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  // Sanitize and validate the role
  let validatedRole = "admin"; // Default role
  if (role) {
    const lowerCaseRole = role.toLowerCase().replace("_", "");
    if (lowerCaseRole === "superadmin") {
      validatedRole = "superadmin";
    } else if (lowerCaseRole !== "admin") {
      return res.status(400).json({ message: "Invalid role. Use 'admin' or 'superadmin'." });
    }
  }

  try {
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    const newAdminData = {
      email,
      password, // The model should handle hashing
      name: name || "",
      role: validatedRole,
      isActive: typeof isActive === "boolean" ? isActive : true,
    };

    const admin = await Admin.create(newAdminData);

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    console.error("Admin registration error:", err);
    sendErrorResponse(res, 500, "Server error during registration.", err);
  }
};

/**
 * @desc    Authenticate an admin and get a token
 * @route   POST /api/admins/login
 * @access  Public
 */
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" }); // Generic message
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: "Account is deactivated. Please contact an administrator." });
    }

    const isMatch = await Admin.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" }); // Generic message
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    console.error("Admin login error:", err);
    sendErrorResponse(res, 500, "Server error during login.", err);
  }
};


// --- PASSWORD RESET CONTROLLERS ---

/**
 * @desc    Handle forgot password request by generating a reset token
 * @route   POST /api/admins/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const admin = await Admin.findByEmail(email);
    if (admin) {
      // Generate reset token only if admin exists
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await Admin.saveResetToken(admin.id, resetToken, resetTokenExpiry);

      // TODO: In production, send an email with the reset link.
      // For development, we can return the token.
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }
    
    // For security, always return the same message to prevent email enumeration
    res.status(200).json({
      message: "If an account with that email exists, password reset instructions have been sent."
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    sendErrorResponse(res, 500, "Server error during password reset request.", err);
  }
};

/**
 * @desc    Reset password using a valid token
 * @route   POST /api/admins/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Reset token and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  try {
    const admin = await Admin.findByResetToken(token);
    if (!admin || new Date() > new Date(admin.resetTokenExpiry)) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    await Admin.updatePasswordAndClearToken(admin.id, newPassword);

    res.status(200).json({ message: "Password has been reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    sendErrorResponse(res, 500, "Server error while resetting password.", err);
  }
};


// --- ADMIN MANAGEMENT (SuperAdmin only) ---

/**
 * @desc    Get all admins
 * @route   GET /api/admins
 * @access  SuperAdmin
 */
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json({
      count: admins.length,
      admins: admins.map(admin => Admin.sanitize(admin)),
    });
  } catch (err) {
    console.error("Get all admins error:", err);
    sendErrorResponse(res, 500, "Server error retrieving admins.", err);
  }
};

/**
 * @desc    Get a single admin by ID
 * @route   GET /api/admins/:id
 * @access  SuperAdmin
 */
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin: Admin.sanitize(admin) });
  } catch (err) {
    console.error("Get admin by ID error:", err);
    sendErrorResponse(res, 500, "Server error retrieving admin.", err);
  }
};

/**
 * @desc    Update an admin's details by ID
 * @route   PUT /api/admins/:id
 * @access  SuperAdmin
 */
exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password, name, role, isActive } = req.body;
  const loggedInAdminId = req.admin.id;

  try {
    const adminToUpdate = await Admin.findById(id);
    if (!adminToUpdate) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent a superadmin from deactivating or changing their own role via this endpoint
    if (Number(loggedInAdminId) === Number(id)) {
        if (isActive === false || (role && role !== req.admin.role)) {
            return res.status(400).json({ message: "You cannot change your own role or active status via this route. Use profile settings." });
        }
    }

    const updateData = {};
    
    // Validate and add fields to updateData if they are provided
    if (email) {
      const existing = await Admin.findByEmail(email);
      if (existing && Number(existing.id) !== Number(id)) {
        return res.status(409).json({ message: "Email is already in use by another account." });
      }
      updateData.email = email;
    }
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });
      updateData.password = password;
    }
    if (role) {
      const lowerCaseRole = role.toLowerCase().replace("_", "");
      if (!['admin', 'superadmin'].includes(lowerCaseRole)) {
        return res.status(400).json({ message: "Invalid role specified." });
      }
      updateData.role = lowerCaseRole;
    }
    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update data provided." });
    }

    const updatedAdmin = await Admin.updateById(id, updateData);
    res.status(200).json({
      message: "Admin updated successfully",
      admin: Admin.sanitize(updatedAdmin),
    });
  } catch (err) {
    console.error("Update admin error:", err);
    sendErrorResponse(res, 500, "Server error updating admin.", err);
  }
};

/**
 * @desc    Delete an admin by ID
 * @route   DELETE /api/admins/:id
 * @access  SuperAdmin
 */
exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const loggedInAdminId = req.admin.id;

  if (Number(id) === Number(loggedInAdminId)) {
    return res.status(400).json({ message: "You cannot delete your own account." });
  }

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    await Admin.deleteById(id);
    res.status(200).json({ message: `Admin with email ${admin.email} has been deleted.` });
  } catch (err) {
    console.error("Delete admin error:", err);
    sendErrorResponse(res, 500, "Server error deleting admin.", err);
  }
};


// --- SELF-PROFILE MANAGEMENT ---

/**
 * @desc    Get the profile of the currently logged-in admin
 * @route   GET /api/admins/me
 * @access  Admin, SuperAdmin
 */
exports.getProfile = async (req, res) => {
  try {
    // req.admin.id is attached by the authenticateAdmin middleware
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found." });
    }
    res.status(200).json({ admin: Admin.sanitize(admin) });
  } catch (err) {
    console.error("Get profile error:", err);
    sendErrorResponse(res, 500, "Server error retrieving profile.", err);
  }
};

/**
 * @desc    Update the profile of the currently logged-in admin
 * @route   PUT /api/admins/me
 * @access  Admin, SuperAdmin
 */
exports.updateProfile = async (req, res) => {
  const { email, password, name } = req.body;
  const adminId = req.admin.id;

  try {
    const updateData = {};

    // Validate and prepare data for self-update
    // An admin cannot change their own role or active status here.
    if (email) {
      const existing = await Admin.findByEmail(email);
      if (existing && Number(existing.id) !== Number(adminId)) {
        return res.status(409).json({ message: "Email is already in use." });
      }
      updateData.email = email;
    }
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters long" });
      updateData.password = password;
    }
    if (name !== undefined) updateData.name = name;
    
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No update data provided." });
    }

    const updatedAdmin = await Admin.updateById(adminId, updateData);
    res.status(200).json({
      message: "Profile updated successfully",
      admin: Admin.sanitize(updatedAdmin),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    sendErrorResponse(res, 500, "Server error updating profile.", err);
  }
};
