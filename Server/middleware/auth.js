const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Middleware to protect user routes by verifying a JWT token.
 * It checks for a 'Bearer' token in the Authorization header,
 * verifies it, and attaches the corresponding user to the request object.
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists and has the 'Bearer ' prefix
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Extract the token from the header (e.g., "Bearer <token>")
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look for the user ID using multiple possible keys
    const id = decoded.id || decoded.userId || decoded.adminId;

    if (!id) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing user ID)' });
    }

    // Find the user in the database using the extracted ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach the user information to the request object
    req.user = { ...decoded, ...user };
    
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

/**
 * Middleware to protect admin routes by verifying an admin JWT token.
 * Similar to protect but specifically for admin authentication.
 */
exports.authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Unauthorized: No admin token provided',
        error: 'ADMIN_AUTH_REQUIRED'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');

    // Look for admin ID
    const adminId = decoded.id || decoded.adminId;

    if (!adminId) {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid admin token payload',
        error: 'INVALID_ADMIN_TOKEN'
      });
    }

    // Find the admin in the database
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin not found',
        error: 'ADMIN_NOT_FOUND'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin account is deactivated',
        error: 'ADMIN_DEACTIVATED'
      });
    }

    // Attach admin info to request
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name,
      isActive: admin.isActive
    };

    console.log(`✅ Admin authenticated: ${admin.email} (${admin.role})`);
    next();
  } catch (err) {
    console.error('Admin JWT Error:', err.message);
    
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin token has expired',
        error: 'ADMIN_TOKEN_EXPIRED'
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Unauthorized: Invalid admin token',
        error: 'INVALID_ADMIN_TOKEN'
      });
    }

    return res.status(401).json({ 
      message: 'Unauthorized: Admin authentication failed',
      error: 'ADMIN_AUTH_FAILED'
    });
  }
};

/**
 * Middleware to check if the authenticated admin has superadmin privileges.
 * Must be used after authenticateAdmin middleware.
 */
exports.requireSuperAdmin = (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin authentication required',
        error: 'ADMIN_AUTH_REQUIRED'
      });
    }

    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ 
        message: 'Forbidden: Superadmin privileges required',
        error: 'INSUFFICIENT_PRIVILEGES',
        requiredRole: 'superadmin',
        currentRole: req.admin.role
      });
    }

    console.log(`✅ Superadmin access granted: ${req.admin.email}`);
    next();
  } catch (err) {
    console.error('Superadmin check error:', err.message);
    return res.status(500).json({ 
      message: 'Server error during authorization check',
      error: 'AUTH_CHECK_FAILED'
    });
  }
};

/**
 * Middleware to check if the authenticated admin has admin or superadmin privileges.
 * Must be used after authenticateAdmin middleware.
 */
exports.requireAdmin = (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin authentication required',
        error: 'ADMIN_AUTH_REQUIRED'
      });
    }

    const validRoles = ['admin', 'superadmin'];
    if (!validRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: Admin privileges required',
        error: 'INSUFFICIENT_PRIVILEGES',
        requiredRoles: validRoles,
        currentRole: req.admin.role
      });
    }

    console.log(`✅ Admin access granted: ${req.admin.email} (${req.admin.role})`);
    next();
  } catch (err) {
    console.error('Admin check error:', err.message);
    return res.status(500).json({ 
      message: 'Server error during authorization check',
      error: 'AUTH_CHECK_FAILED'
    });
  }
};

/**
 * Middleware that allows both admin and superadmin, but adds additional info
 * Must be used after authenticateAdmin middleware.
 */
exports.adminOrSuperAdmin = (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ 
        message: 'Unauthorized: Admin authentication required',
        error: 'ADMIN_AUTH_REQUIRED'
      });
    }

    // Add permission flags to request for easy checking in routes
    req.permissions = {
      isSuperAdmin: req.admin.role === 'superadmin',
      isAdmin: req.admin.role === 'admin',
      canManageAdmins: req.admin.role === 'superadmin',
      canViewEnquiries: req.admin.role === 'superadmin',
      canManageProducts: ['admin', 'superadmin'].includes(req.admin.role)
    };

    console.log(`✅ Admin authenticated with permissions:`, req.permissions);
    next();
  } catch (err) {
    console.error('Permission check error:', err.message);
    return res.status(500).json({ 
      message: 'Server error during permission check',
      error: 'PERMISSION_CHECK_FAILED'
    });
  }
};

/**
 * Optional admin authentication - doesn't fail if no token provided
 * Useful for routes that work for both authenticated and non-authenticated users
 */
exports.optionalAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without admin context
      req.admin = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
    const adminId = decoded.id || decoded.adminId;

    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (admin && admin.isActive) {
        req.admin = {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          name: admin.name,
          isActive: admin.isActive
        };
      }
    }

    next();
  } catch (err) {
    // If token is invalid, just continue without admin context
    console.log('Optional admin auth failed:', err.message);
    req.admin = null;
    next();
  }
};