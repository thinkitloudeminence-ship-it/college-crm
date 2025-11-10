// const express = require('express');
// const multer = require('multer');
// const xlsx = require('xlsx');
// const Lead = require('../models/Lead');
// const User = require('../models/User');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Configure multer for file upload
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = [
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'application/vnd.ms-excel',
//       'text/csv',
//       'application/csv',
//       'text/x-csv'
//     ];

//     const fileExtension = file.originalname.toLowerCase().split('.').pop();
//     const allowedExtensions = ['xlsx', 'xls', 'csv'];

//     if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only Excel and CSV files are allowed'), false);
//     }
//   }
// });

// // ========== NEW ROUTE FOR TELECALLERS ==========

// // // Get telecallers for forwarding
// // router.get('/users/telecallers', auth, async (req, res) => {
// //   try {
// //     const telecallers = await User.find({
// //       role: 'telecaller',
// //       status: 'active',
// //       _id: { $ne: req.user._id } // Exclude current user
// //     }).select('name email employeeId department phone');

// //     res.json(telecallers);
// //   } catch (error) {
// //     console.error('Get telecallers error:', error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // Get all telecallers for lead forwarding
// router.get('/users/telecallers', auth, async (req, res) => {
//   try {
//     console.log('Fetching telecallers for user:', req.user._id);

//     const telecallers = await User.find({
//       $or: [
//         { role: 'telecaller' },
//         { role: 'employee', department: 'telecalling' }
//       ],
//       status: 'active',
//       _id: { $ne: req.user._id } // Exclude current user
//     }).select('name email employeeId department phone role');

//     console.log('Found telecallers:', telecallers.length);

//     res.json(telecallers);
//   } catch (error) {
//     console.error('Get telecallers error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });


// // ========== UPLOAD ROUTES ==========

// // Upload Excel/CSV file and create leads
// router.post('/upload', auth, authorize('admin'), upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     console.log('Uploading file:', req.file.originalname);

//     const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const data = xlsx.utils.sheet_to_json(worksheet);

//     if (data.length === 0) {
//       return res.status(400).json({ message: 'File is empty' });
//     }

//     const leads = [];
//     const errors = [];

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       try {
//         if (!row.name || !row.email || !row.phone) {
//           errors.push(`Row ${i + 2}: Missing required fields`);
//           continue;
//         }

//         const lead = new Lead({
//           name: row.name,
//           email: row.email,
//           phone: row.phone.toString(),
//           college: row.college || '',
//           course: row.course || '',
//           city: row.city || '',
//           source: row.source || 'website',
//           status: 'new',
//           assignedBy: req.user._id,
//           createdBy: req.user._id
//         });

//         leads.push(lead);
//       } catch (error) {
//         errors.push(`Row ${i + 2}: ${error.message}`);
//       }
//     }

//     if (leads.length > 0) {
//       await Lead.insertMany(leads);
//     }

//     res.json({
//       message: `Successfully processed ${leads.length} leads`,
//       processed: leads.length,
//       errors: errors,
//       failed: errors.length
//     });

//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Get leads with filters
// router.get('/', auth, async (req, res) => {
//   try {
//     const { status, assignedTo, source, dateFrom, dateTo, search } = req.query;
//     let filter = {};

//     // Role-based filtering
//     if (req.user.role === 'telecaller') {
//       filter.assignedTo = req.user._id;
//     } else if (req.user.role === 'manager') {
//       const telecallers = await User.find({
//         manager: req.user._id,
//         role: 'telecaller'
//       });
//       filter.assignedTo = { $in: telecallers.map(t => t._id) };
//     }

//     if (status) filter.status = status;
//     if (assignedTo) filter.assignedTo = assignedTo;
//     if (source) filter.source = source;

//     // Search filter
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } },
//         { phone: { $regex: search, $options: 'i' } },
//         { college: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Date filtering
//     if (dateFrom || dateTo) {
//       filter.createdAt = {};
//       if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
//       if (dateTo) filter.createdAt.$lte = new Date(dateTo);
//     }

//     const leads = await Lead.find(filter)
//       .populate('assignedTo', 'name email employeeId department')
//       .populate('assignedBy', 'name email')
//       .populate('createdBy', 'name email')
//       .sort({ createdAt: -1 });

//     res.json(leads);
//   } catch (error) {
//     console.error('Get leads error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get single lead
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const lead = await Lead.findById(req.params.id)
//       .populate('assignedTo', 'name email employeeId department')
//       .populate('assignedBy', 'name email')
//       .populate('createdBy', 'name email')
//       .populate('forwardedBy', 'name email employeeId department')
//       .populate('forwardedTo', 'name email employeeId department');

//     if (!lead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }

//     // Check permissions
//     if (req.user.role === 'telecaller' && lead.assignedTo?._id.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     res.json(lead);
//   } catch (error) {
//     console.error('Get lead error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update lead status (Telecaller/Admin/Manager)
// router.put('/:id/status', auth, async (req, res) => {
//   try {
//     const {
//       status,
//       remarks,
//       followUpDate,
//       callDuration,
//       interestLevel,
//       nextAction,
//       studentName,
//       studentNumber,
//       alternateNumber,
//       email,
//       twelfthSubject,
//       currentCity,
//       preferredCity,
//       examPreparation,
//       currentCourse,
//       budget,
//       reference
//     } = req.body;

//     console.log('Updating lead status:', req.params.id, status);

//     const lead = await Lead.findById(req.params.id);
//     if (!lead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }

//     // Check permissions
//     if (req.user.role === 'telecaller' && lead.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const oldStatus = lead.status;

//     // Update all fields - only update if value is provided
//     if (status) lead.status = status;
//     if (remarks !== undefined) lead.remarks = remarks;
//     if (followUpDate !== undefined) lead.followUpDate = followUpDate;
//     if (callDuration !== undefined) lead.callDuration = callDuration;
//     if (interestLevel !== undefined) lead.interestLevel = interestLevel;
//     if (nextAction !== undefined) lead.nextAction = nextAction;
//     if (studentName !== undefined) lead.name = studentName;
//     if (studentNumber !== undefined) lead.phone = studentNumber;
//     if (alternateNumber !== undefined) lead.alternateNumber = alternateNumber;
//     if (email !== undefined) lead.email = email;
//     if (twelfthSubject !== undefined) lead.twelfthSubject = twelfthSubject;
//     if (currentCity !== undefined) lead.currentCity = currentCity;
//     if (preferredCity !== undefined) lead.preferredCity = preferredCity;
//     if (examPreparation !== undefined) lead.examPreparation = examPreparation;
//     if (currentCourse !== undefined) lead.currentCourse = currentCourse;
//     if (budget !== undefined) lead.budget = budget;
//     if (reference !== undefined) lead.reference = reference;

//     if (status === 'converted') {
//       lead.conversionDate = new Date();
//       lead.conversion = {
//         convertedAt: new Date(),
//         convertedBy: req.user._id,
//         courseEnrolled: lead.course,
//         paymentStatus: 'pending'
//       };
//     }

//     // Add to timeline using the instance method
//     await lead.addTimelineEvent(
//       `Status changed from ${oldStatus} to ${status}`,
//       remarks || '',
//       req.user._id
//     );

//     await lead.save();

//     // Populate before sending response
//     await lead.populate('assignedTo', 'name email employeeId department');
//     await lead.populate('assignedBy', 'name email');

//     console.log('Lead status updated successfully');
//     res.json(lead);
//   } catch (error) {
//     console.error('Update lead status error:', error);
//     res.status(500).json({
//       message: 'Server error: ' + error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });

// // ========== FORWARDED LEADS ROUTES ==========

// // Get leads forwarded by current user
// router.get('/forwarded/my-forwards', auth, async (req, res) => {
//   try {
//     const forwardedLeads = await Lead.find({
//       $or: [
//         { forwardedBy: req.user._id },
//         { 'forwardHistory.forwardedBy': req.user._id }
//       ]
//     })
//       .populate('forwardedTo', 'name email employeeId department')
//       .populate('forwardedBy', 'name email employeeId department')
//       .populate('assignedTo', 'name email employeeId department')
//       .populate('forwardHistory.forwardedBy', 'name email employeeId department')
//       .populate('forwardHistory.forwardedTo', 'name email employeeId department')
//       .sort({ forwardedAt: -1 });

//     res.json(forwardedLeads);
//   } catch (error) {
//     console.error('Get my forwards error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Get leads forwarded to current user
// router.get('/forwarded/received', auth, async (req, res) => {
//   try {
//     const receivedLeads = await Lead.find({
//       $or: [
//         { forwardedTo: req.user._id },
//         { 'forwardHistory.forwardedTo': req.user._id },
//         { assignedTo: req.user._id, forwardedTo: { $exists: true } }
//       ]
//     })
//       .populate('forwardedBy', 'name email employeeId department')
//       .populate('forwardedTo', 'name email employeeId department')
//       .populate('assignedTo', 'name email employeeId department')
//       .populate('forwardHistory.forwardedBy', 'name email employeeId department')
//       .populate('forwardHistory.forwardedTo', 'name email employeeId department')
//       .sort({ forwardedAt: -1 });

//     res.json(receivedLeads);
//   } catch (error) {
//     console.error('Get received forwards error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// // Enhanced Forward lead endpoint
// router.post('/:id/forward', auth, async (req, res) => {
//   try {
//     const { forwardTo, reason, notes } = req.body;
//     const lead = await Lead.findById(req.params.id);

//     if (!lead) {
//       return res.status(404).json({ message: 'Lead not found' });
//     }

//     // Check permissions - only assigned telecaller can forward
//     if (req.user.role === 'telecaller' && lead.assignedTo?.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     let forwardToUser = null;
//     let forwardToName = 'Admin';
//     let forwardToType = 'admin';

//     if (forwardTo !== 'admin') {
//       forwardToUser = await User.findById(forwardTo);
//       if (forwardToUser) {
//         forwardToName = forwardToUser.name;
//         forwardToType = 'telecaller';

//         // Check if forwarding to self
//         if (forwardToUser._id.toString() === req.user._id.toString()) {
//           return res.status(400).json({ message: 'Cannot forward lead to yourself' });
//         }
//       } else {
//         return res.status(400).json({ message: 'Invalid telecaller' });
//       }
//     }

//     // Update lead with forwarding information
//     lead.forwardedBy = req.user._id;
//     lead.forwardedTo = forwardTo !== 'admin' ? forwardTo : null;
//     lead.forwardReason = reason;
//     lead.forwardNotes = notes;
//     lead.forwardedAt = new Date();

//     // Add to forward history
//     if (!lead.forwardHistory) {
//       lead.forwardHistory = [];
//     }

//     lead.forwardHistory.push({
//       forwardedBy: req.user._id,
//       forwardedTo: forwardTo !== 'admin' ? forwardTo : null,
//       reason: reason,
//       notes: notes,
//       forwardedAt: new Date(),
//       forwardType: forwardToType
//     });

//     // If forwarding to admin, unassign the lead
//     if (forwardTo === 'admin') {
//       lead.assignedTo = null;
//       lead.status = 'new';
//       lead.forwardStatus = 'returned_to_admin';
//     } else {
//       // Forward to another telecaller
//       lead.assignedTo = forwardTo;
//       lead.status = 'assigned';
//       lead.forwardStatus = 'forwarded_to_telecaller';
//     }

//     // Add to timeline using instance method
//     await lead.addTimelineEvent(
//       'forwarded',
//       `Forwarded to ${forwardToName}. Reason: ${reason}. Notes: ${notes}`,
//       req.user._id
//     );

//     await lead.save();

//     // Proper population
//     const populatedLead = await Lead.findById(lead._id)
//       .populate('forwardedBy', 'name email employeeId department')
//       .populate('forwardedTo', 'name email employeeId department')
//       .populate('assignedTo', 'name email employeeId department')
//       .populate('forwardHistory.forwardedBy', 'name email employeeId department')
//       .populate('forwardHistory.forwardedTo', 'name email employeeId department');

//     res.json({
//       message: `Lead forwarded successfully to ${forwardToName}`,
//       lead: populatedLead,
//       forwardType: forwardToType
//     });
//   } catch (error) {
//     console.error('Forward lead error:', error);
//     res.status(500).json({ message: 'Server error: ' + error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const Lead = require('../models/Lead');
const User = require('../models/User');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/csv',
      'text/x-csv'
    ];

    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    const allowedExtensions = ['xlsx', 'xls', 'csv'];

    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed'), false);
    }
  }
});

// ========== NEW ROUTES ==========

// Get telecallers for forwarding
router.get('/users/telecallers', auth, async (req, res) => {
  try {
    console.log('Fetching telecallers for user:', req.user._id);

    const telecallers = await User.find({
      $or: [
        { role: 'telecaller' },
        { role: 'employee', department: 'telecalling' }
      ],
      status: 'active',
      _id: { $ne: req.user._id } // Exclude current user
    }).select('name email employeeId department phone role');

    console.log('Found telecallers:', telecallers.length);

    res.json(telecallers);
  } catch (error) {
    console.error('Get telecallers error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get lead statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    console.log('Fetching lead stats for user:', req.user._id, 'role:', req.user.role);
    
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'telecaller') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'manager') {
      const telecallers = await User.find({
        manager: req.user._id,
        role: 'telecaller'
      });
      filter.assignedTo = { $in: telecallers.map(t => t._id) };
    }
    // For admin, no filter needed - get all leads

    console.log('Filter for stats:', filter);

    // Get counts by status
    const total = await Lead.countDocuments(filter);
    const converted = await Lead.countDocuments({ ...filter, status: 'converted' });
    const hot = await Lead.countDocuments({ ...filter, status: 'hot' });
    const newLeads = await Lead.countDocuments({ ...filter, status: 'new' });
    const contacted = await Lead.countDocuments({ ...filter, status: 'contacted' });
    const assigned = await Lead.countDocuments({ ...filter, status: 'assigned' });
    const future = await Lead.countDocuments({ ...filter, status: 'future' });
    const dead = await Lead.countDocuments({ ...filter, status: 'dead' });

    // Get forwarded stats
    let forwardedByMe = 0;
    let forwardedToMe = 0;

    if (req.user.role === 'telecaller') {
      forwardedByMe = await Lead.countDocuments({ forwardedBy: req.user._id });
      forwardedToMe = await Lead.countDocuments({ forwardedTo: req.user._id });
    }

    const stats = {
      total,
      converted,
      hot,
      new: newLeads,
      contacted,
      assigned,
      future,
      dead,
      forwardedByMe,
      forwardedToMe,
      forwarded: forwardedByMe + forwardedToMe
    };

    console.log('Stats calculated:', stats);
    
    res.json(stats);
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({ 
      message: 'Server error: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ========== EXISTING ROUTES (Keep all your existing routes below) ==========

// Upload Excel/CSV file and create leads
router.post('/upload', auth, authorize('admin'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('Uploading file:', req.file.originalname);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'File is empty' });
    }

    const leads = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      try {
        if (!row.name || !row.email || !row.phone) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        const lead = new Lead({
          name: row.name,
          email: row.email,
          phone: row.phone.toString(),
          college: row.college || '',
          course: row.course || '',
          city: row.city || '',
          source: row.source || 'website',
          status: 'new',
          assignedBy: req.user._id,
          createdBy: req.user._id
        });

        leads.push(lead);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    if (leads.length > 0) {
      await Lead.insertMany(leads);
    }

    res.json({
      message: `Successfully processed ${leads.length} leads`,
      processed: leads.length,
      errors: errors,
      failed: errors.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get leads with filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, assignedTo, source, dateFrom, dateTo, search } = req.query;
    let filter = {};

    // Role-based filtering
    if (req.user.role === 'telecaller') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'manager') {
      const telecallers = await User.find({
        manager: req.user._id,
        role: 'telecaller'
      });
      filter.assignedTo = { $in: telecallers.map(t => t._id) };
    }

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (source) filter.source = source;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { college: { $regex: search, $options: 'i' } }
      ];
    }

    // Date filtering
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email employeeId department')
      .populate('assignedBy', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single lead
router.get('/:id', auth, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedTo', 'name email employeeId department')
      .populate('assignedBy', 'name email')
      .populate('createdBy', 'name email')
      .populate('forwardedBy', 'name email employeeId department')
      .populate('forwardedTo', 'name email employeeId department');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions
    if (req.user.role === 'telecaller' && lead.assignedTo?._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lead status (Telecaller/Admin/Manager)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const {
      status,
      remarks,
      followUpDate,
      callDuration,
      interestLevel,
      nextAction,
      studentName,
      studentNumber,
      alternateNumber,
      email,
      twelfthSubject,
      currentCity,
      preferredCity,
      examPreparation,
      currentCourse,
      budget,
      reference
    } = req.body;

    console.log('Updating lead status:', req.params.id, status);

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions
    if (req.user.role === 'telecaller' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldStatus = lead.status;

    // Update all fields - only update if value is provided
    if (status) lead.status = status;
    if (remarks !== undefined) lead.remarks = remarks;
    if (followUpDate !== undefined) lead.followUpDate = followUpDate;
    if (callDuration !== undefined) lead.callDuration = callDuration;
    if (interestLevel !== undefined) lead.interestLevel = interestLevel;
    if (nextAction !== undefined) lead.nextAction = nextAction;
    if (studentName !== undefined) lead.name = studentName;
    if (studentNumber !== undefined) lead.phone = studentNumber;
    if (alternateNumber !== undefined) lead.alternateNumber = alternateNumber;
    if (email !== undefined) lead.email = email;
    if (twelfthSubject !== undefined) lead.twelfthSubject = twelfthSubject;
    if (currentCity !== undefined) lead.currentCity = currentCity;
    if (preferredCity !== undefined) lead.preferredCity = preferredCity;
    if (examPreparation !== undefined) lead.examPreparation = examPreparation;
    if (currentCourse !== undefined) lead.currentCourse = currentCourse;
    if (budget !== undefined) lead.budget = budget;
    if (reference !== undefined) lead.reference = reference;

    if (status === 'converted') {
      lead.conversionDate = new Date();
      lead.conversion = {
        convertedAt: new Date(),
        convertedBy: req.user._id,
        courseEnrolled: lead.course,
        paymentStatus: 'pending'
      };
    }

    // Add to timeline using the instance method
    await lead.addTimelineEvent(
      `Status changed from ${oldStatus} to ${status}`,
      remarks || '',
      req.user._id
    );

    await lead.save();

    // Populate before sending response
    await lead.populate('assignedTo', 'name email employeeId department');
    await lead.populate('assignedBy', 'name email');

    console.log('Lead status updated successfully');
    res.json(lead);
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({
      message: 'Server error: ' + error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ========== FORWARDED LEADS ROUTES ==========

// Get leads forwarded by current user
router.get('/forwarded/my-forwards', auth, async (req, res) => {
  try {
    const forwardedLeads = await Lead.find({
      $or: [
        { forwardedBy: req.user._id },
        { 'forwardHistory.forwardedBy': req.user._id }
      ]
    })
      .populate('forwardedTo', 'name email employeeId department')
      .populate('forwardedBy', 'name email employeeId department')
      .populate('assignedTo', 'name email employeeId department')
      .populate('forwardHistory.forwardedBy', 'name email employeeId department')
      .populate('forwardHistory.forwardedTo', 'name email employeeId department')
      .sort({ forwardedAt: -1 });

    res.json(forwardedLeads);
  } catch (error) {
    console.error('Get my forwards error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get leads forwarded to current user
router.get('/forwarded/received', auth, async (req, res) => {
  try {
    const receivedLeads = await Lead.find({
      $or: [
        { forwardedTo: req.user._id },
        { 'forwardHistory.forwardedTo': req.user._id },
        { assignedTo: req.user._id, forwardedTo: { $exists: true } }
      ]
    })
      .populate('forwardedBy', 'name email employeeId department')
      .populate('forwardedTo', 'name email employeeId department')
      .populate('assignedTo', 'name email employeeId department')
      .populate('forwardHistory.forwardedBy', 'name email employeeId department')
      .populate('forwardHistory.forwardedTo', 'name email employeeId department')
      .sort({ forwardedAt: -1 });

    res.json(receivedLeads);
  } catch (error) {
    console.error('Get received forwards error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Get all forwarded leads (Admin/Manager)
router.get('/forwarded/all', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const forwardedLeads = await Lead.find({
      $or: [
        { forwardedBy: { $exists: true } },
        { forwardedTo: { $exists: true } },
        { 'forwardHistory.0': { $exists: true } }
      ]
    })
      .populate('forwardedBy', 'name email employeeId department')
      .populate('forwardedTo', 'name email employeeId department')
      .populate('assignedTo', 'name email employeeId department')
      .populate('forwardHistory.forwardedBy', 'name email employeeId department')
      .populate('forwardHistory.forwardedTo', 'name email employeeId department')
      .sort({ forwardedAt: -1 });

    res.json(forwardedLeads);
  } catch (error) {
    console.error('Get all forwarded leads error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Enhanced Forward lead endpoint
router.post('/:id/forward', auth, async (req, res) => {
  try {
    const { forwardTo, reason, notes } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check permissions - only assigned telecaller can forward
    if (req.user.role === 'telecaller' && lead.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let forwardToUser = null;
    let forwardToName = 'Admin';
    let forwardToType = 'admin';

    if (forwardTo !== 'admin') {
      forwardToUser = await User.findById(forwardTo);
      if (forwardToUser) {
        forwardToName = forwardToUser.name;
        forwardToType = 'telecaller';

        // Check if forwarding to self
        if (forwardToUser._id.toString() === req.user._id.toString()) {
          return res.status(400).json({ message: 'Cannot forward lead to yourself' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid telecaller' });
      }
    }

    // Update lead with forwarding information
    lead.forwardedBy = req.user._id;
    lead.forwardedTo = forwardTo !== 'admin' ? forwardTo : null;
    lead.forwardReason = reason;
    lead.forwardNotes = notes;
    lead.forwardedAt = new Date();

    // Add to forward history
    if (!lead.forwardHistory) {
      lead.forwardHistory = [];
    }

    lead.forwardHistory.push({
      forwardedBy: req.user._id,
      forwardedTo: forwardTo !== 'admin' ? forwardTo : null,
      reason: reason,
      notes: notes,
      forwardedAt: new Date(),
      forwardType: forwardToType
    });

    // If forwarding to admin, unassign the lead
    if (forwardTo === 'admin') {
      lead.assignedTo = null;
      lead.status = 'new';
      lead.forwardStatus = 'returned_to_admin';
    } else {
      // Forward to another telecaller
      lead.assignedTo = forwardTo;
      lead.status = 'assigned';
      lead.forwardStatus = 'forwarded_to_telecaller';
    }

    // Add to timeline using instance method
    await lead.addTimelineEvent(
      'forwarded',
      `Forwarded to ${forwardToName}. Reason: ${reason}. Notes: ${notes}`,
      req.user._id
    );

    await lead.save();

    // Proper population
    const populatedLead = await Lead.findById(lead._id)
      .populate('forwardedBy', 'name email employeeId department')
      .populate('forwardedTo', 'name email employeeId department')
      .populate('assignedTo', 'name email employeeId department')
      .populate('forwardHistory.forwardedBy', 'name email employeeId department')
      .populate('forwardHistory.forwardedTo', 'name email employeeId department');

    res.json({
      message: `Lead forwarded successfully to ${forwardToName}`,
      lead: populatedLead,
      forwardType: forwardToType
    });
  } catch (error) {
    console.error('Forward lead error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;