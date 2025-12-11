const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, token failed' 
      });
    }
  } else {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token' 
    });
  }
};

// Restrict to business owners only
exports.businessOwnerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'business_owner') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Business owners only.' 
    });
  }
};

// Restrict to regular users only
exports.regularUserOnly = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Regular users only.' 
    });
  }
};
