// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const Lead = require('../models/Lead');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // All routes protected
// router.use(protect);

// // @desc    Get all leads (admin only)
// // @route   GET /api/leads
// // @access  Private/Admin
// router.get('/', authorize('admin', 'superadmin'), async (req, res) => {
//   try {
//     const leads = await Lead.find()
//       .populate('assignedTo', 'name employeeId')
//       .populate('createdBy', 'name')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: leads.length,
//       data: leads
//     });
//   } catch (error) {
//     console.error('Get leads error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching leads'
//     });
//   }
// });

// // @desc    Create new lead
// // @route   POST /api/leads
// // @access  Private/Admin
// router.post('/', [
//   authorize('admin', 'superadmin'),
//   body('name').notEmpty().withMessage('Name is required'),
//   body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required')
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

//     const leadData = {
//       ...req.body,
//       createdBy: req.user.id
//     };

//     const lead = await Lead.create(leadData);

//     res.status(201).json({
//       success: true,
//       message: 'Lead created successfully',
//       data: lead
//     });
//   } catch (error) {
//     console.error('Create lead error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while creating lead'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected
router.use(protect);

// @desc    Create lead
// @route   POST /api/leads
// @access  Private/Admin
router.post('/', [
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required')
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

    const leadData = {
      ...req.body,
      createdBy: req.user.id
    };

    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });

  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating lead'
    });
  }
});

// @desc    Get all leads (admin only)
// @route   GET /api/leads
// @access  Private/Admin
router.get('/', authorize('admin'), async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads'
    });
  }
});

module.exports = router;