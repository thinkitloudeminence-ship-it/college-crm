// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const Admin = require('../models/Admin');
// const Employee = require('../models/Employee');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Login user (Admin or Employee)
// // @route   POST /api/auth/login
// // @access  Public
// router.post('/login', [
//   body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
//   body('password').notEmpty().withMessage('Please provide a password')
// ], async (req, res) => {
//   try {
//     // Check validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { email, password, userType = 'employee' } = req.body;

//     let user;
//     let userModel;

//     // Determine which model to use based on userType
//     if (userType === 'admin') {
//       userModel = Admin;
//     } else {
//       userModel = Employee;
//     }

//     // Find user by email and ensure they are active
//     user = await userModel.findOne({ 
//       email, 
//       isActive: true 
//     }).select('+password +loginAttempts +lockUntil');

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials or account inactive'
//       });
//     }

//     // Check if account is locked
//     if (user.isLocked) {
//       const remainingTime = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
//       return res.status(423).json({
//         success: false,
//         message: `Account temporarily locked. Try again in ${remainingTime} minutes.`
//       });
//     }

//     // Check password
//     try {
//       await user.matchPassword(password);
//     } catch (error) {
//       return res.status(401).json({
//         success: false,
//         message: error.message
//       });
//     }

//     // Create token
//     const token = user.getSignedJwtToken();

//     // Prepare user data for response
//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role || user.designation,
//       ...(user.employeeId && { employeeId: user.employeeId }),
//       ...(user.department && { department: user.department }),
//       ...(user.permissions && { permissions: user.permissions })
//     };

//     // Set cookie if needed (for web)
//     res.cookie('token', token, {
//       expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict'
//     });

//     res.json({
//       success: true,
//       message: 'Login successful',
//       token,
//       user: userData
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during login process'
//     });
//   }
// });

// // @desc    Get current logged in user
// // @route   GET /api/auth/me
// // @access  Private
// router.get('/me', protect, async (req, res) => {
//   try {
//     let user;

//     if (req.user.role === 'admin' || req.user.role === 'superadmin') {
//       user = await Admin.findById(req.user.id).select('-password');
//     } else {
//       user = await Employee.findById(req.user.id).select('-password');
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     const userData = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role || user.designation,
//       ...(user.employeeId && { employeeId: user.employeeId }),
//       ...(user.department && { department: user.department }),
//       ...(user.permissions && { permissions: user.permissions }),
//       ...(user.profile && { profile: user.profile })
//     };

//     res.json({
//       success: true,
//       data: userData
//     });

//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching user data'
//     });
//   }
// });

// // @desc    Logout user / clear cookie
// // @route   GET /api/auth/logout
// // @access  Private
// router.get('/logout', (req, res) => {
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });

//   res.json({
//     success: true,
//     message: 'User logged out successfully'
//   });
// });

// // @desc    Change password
// // @route   PUT /api/auth/change-password
// // @access  Private
// router.put('/change-password', [
//   protect,
//   body('currentPassword').notEmpty().withMessage('Current password is required'),
//   body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { currentPassword, newPassword } = req.body;

//     let user;
//     if (req.user.role === 'admin' || req.user.role === 'superadmin') {
//       user = await Admin.findById(req.user.id).select('+password');
//     } else {
//       user = await Employee.findById(req.user.id).select('+password');
//     }

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     // Check current password
//     const isMatch = await user.matchPassword(currentPassword);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Current password is incorrect'
//       });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     res.json({
//       success: true,
//       message: 'Password updated successfully'
//     });

//   } catch (error) {
//     console.error('Change password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while changing password'
//     });
//   }
// });

// // @desc    Forgot password - initiate reset
// // @route   POST /api/auth/forgot-password
// // @access  Public
// router.post('/forgot-password', [
//   body('email').isEmail().withMessage('Please provide a valid email')
// ], async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation errors',
//         errors: errors.array()
//       });
//     }

//     const { email } = req.body;

//     // Look for user in both Admin and Employee collections
//     let user = await Admin.findOne({ email, isActive: true });
//     if (!user) {
//       user = await Employee.findOne({ email, isActive: true });
//     }

//     // Always return success to prevent email enumeration
//     if (!user) {
//       return res.json({
//         success: true,
//         message: 'If an account with that email exists, a reset link has been sent'
//       });
//     }

//     // In production, you would:
//     // 1. Generate reset token
//     // 2. Send email with reset link
//     // 3. Save hashed reset token in database with expiry

//     // For now, we'll just return success
//     res.json({
//       success: true,
//       message: 'If an account with that email exists, a reset link has been sent'
//     });

//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error during password reset process'
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Please add password')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email, isActive: true }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;