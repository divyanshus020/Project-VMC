const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Admin Registration
exports.adminRegister = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is required" });
  }

  const { email, password, name, role, isActive } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address" });
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findByEmail(email);
    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Admin with this email already exists" });
    }

    // Create new admin
    const admin = await Admin.create({
      email,
      password,
      name: name || "",
      role: role || "admin",
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Request body is required" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await Admin.comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    
    res.status(200).json({
      message: "Admins retrieved successfully",
      count: admins.length,
      admins: admins.map(admin => Admin.sanitize(admin)),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    res.status(200).json({
      message: "Admin retrieved successfully",
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Admin by ID
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, role, isActive } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findById(id);
    if (!existingAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid email address" });
      }
      
      const adminWithEmail = await Admin.findByEmail(email);
      if (adminWithEmail && adminWithEmail.id !== Number(id)) {
        return res
          .status(409)
          .json({ message: "Admin with this email already exists" });
      }
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Update admin
    const updatedAdmin = await Admin.updateById(id, { email, password, name, role, isActive });
    
    res.status(200).json({
      message: "Admin updated successfully",
      admin: Admin.sanitize(updatedAdmin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Admin ID is required" });
    }
    
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    const deleted = await Admin.deleteById(id);
    if (!deleted) {
      return res.status(500).json({ message: "Failed to delete admin" });
    }
    
    res.status(200).json({
      message: "Admin deleted successfully",
      deletedAdmin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get Current Admin Profile
exports.getProfile = async (req, res) => {
  try {
    // Assuming req.admin is set by authentication middleware
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    res.status(200).json({
      message: "Profile retrieved successfully",
      admin: Admin.sanitize(admin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Current Admin Profile
exports.updateProfile = async (req, res) => {
  try {
    const { email, password, name, role, isActive } = req.body;
    const adminId = req.admin.id; // From authentication middleware

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid email address" });
      }
      
      const existingAdmin = await Admin.findByEmail(email);
      if (existingAdmin && existingAdmin.id !== Number(adminId)) {
        return res
          .status(409)
          .json({ message: "Admin with this email already exists" });
      }
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Update profile
    const updatedAdmin = await Admin.updateById(adminId, { email, password, name, role, isActive });
    
    res.status(200).json({
      message: "Profile updated successfully",
      admin: Admin.sanitize(updatedAdmin),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
