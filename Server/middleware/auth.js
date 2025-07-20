const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes by verifying a JWT token.
 * It checks for a 'Bearer' token in the Authorization header,
 * verifies it, and attaches the corresponding user to the request object.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
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

    // **FIX:** Look for the user/admin ID using multiple possible keys ('id', 'userId', 'adminId')
    // This makes the middleware more robust if different token payloads are used.
    const id = decoded.id || decoded.userId || decoded.adminId;

    // If no ID is found in the token payload, the token is invalid for this purpose.
    if (!id) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token payload (missing user ID)' });
    }

    // Find the user in the database using the extracted ID
    const user = await User.findById(id);
    if (!user) {
      // If the user associated with the token no longer exists
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    // Attach the user information to the request object
    req.user = { ...decoded, ...user };
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Log the error for debugging purposes
    console.error('JWT Error:', err.message);

    // Handle errors like 'JsonWebTokenError' (invalid signature) or 'TokenExpiredError'
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
