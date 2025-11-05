// const jwt = require('jsonwebtoken');
// const Admin = require('../models/Admin');
// const Employee = require('../models/Employee');

// // @desc    Protect routes - verify JWT token
// exports.protect = async (req, res, next) => {
//   let token;

//   // Check for token in header or cookie
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized to access this route. No token provided.'
//     });
//   }

//   try {
//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     let user;

//     // Check if user is admin
//     if (decoded.role === 'admin' || decoded.role === 'superadmin') {
//       user = await Admin.findById(decoded.id).select('-password');
//     } else {
//       // Check if user is employee
//       user = await Employee.findById(decoded.id).select('-password -loginAttempts -lockUntil');
//     }

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'User not found or token is invalid'
//       });
//     }

//     if (!user.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: 'User account is deactivated. Please contact administrator.'
//       });
//     }

//     // Add user to request object
//     req.user = user;
//     next();

//   } catch (error) {
//     console.error('Auth middleware error:', error);

//     if (error.name === 'JsonWebTokenError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid token. Please login again.'
//       });
//     }

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({
//         success: false,
//         message: 'Token expired. Please login again.'
//       });
//     }

//     res.status(401).json({
//       success: false,
//       message: 'Not authorized to access this route'
//     });
//   }
// };

// // @desc    Authorize routes based on roles
// exports.authorize = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized to access this route'
//       });
//     }

//     // For employees, use designation as role
//     const userRole = req.user.role || req.user.designation;

//     if (!roles.includes(userRole)) {
//       return res.status(403).json({
//         success: false,
//         message: `User role ${userRole} is not authorized to access this route. Required roles: ${roles.join(', ')}`
//       });
//     }
//     next();
//   };
// };

// // @desc    Optional auth - doesn't fail if no token, but adds user if available
// exports.optionalAuth = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies && req.cookies.token) {
//     token = req.cookies.token;
//   }

//   if (!token) {
//     return next();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     let user;

//     if (decoded.role === 'admin' || decoded.role === 'superadmin') {
//       user = await Admin.findById(decoded.id).select('-password');
//     } else {
//       user = await Employee.findById(decoded.id).select('-password -loginAttempts -lockUntil');
//     }

//     if (user && user.isActive) {
//       req.user = user;
//     }

//     next();
//   } catch (error) {
//     // Don't throw error for optional auth, just continue without user
//     next();
//   }
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};