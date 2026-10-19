const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and follows 'Bearer <token>' pattern
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access Denied: Missing or malformed Authorization header. Expected format: Bearer <token>',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access Denied: No authentication token provided',
      });
    }

    // Verify token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from MongoDB to ensure user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed: User no longer exists',
      });
    }

    // Attach decoded user info to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error: JWT token has expired, please log in again',
        expired: true,
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Authentication Error: Invalid or tampered token',
    });
  }
};

module.exports = auth;
