// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const Lead = require('../models/Lead');
// const Employee = require('../models/Employee');
// const { protect, authorize } = require('../middleware/auth');

// const router = express.Router();

// // All routes protected for telecallers only
// router.use(protect);
// router.use(authorize('telecaller'));

// // @desc    Get telecaller's assigned leads (without sensitive info)
// // @route   GET /api/telecaller/leads
// // @access  Private/Telecaller
// router.get('/leads', async (req, res) => {
//   try {
//     const {
//       status,
//       priority,
//       search,
//       page = 1,
//       limit = 20,
//       sortBy = 'createdAt',
//       sortOrder = 'desc'
//     } = req.query;

//     // Build query - only show leads assigned to this telecaller
//     const query = { assignedTo: req.user.id };
    
//     if (status) query.status = status;
//     if (priority) query.priority = priority;

//     // Search functionality
//     if (search) {
//       query.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { 'currentEducation.stream': { $regex: search, $options: 'i' } },
//         { 'currentEducation.schoolCollege': { $regex: search, $options: 'i' } },
//         { preferredCourses: { $in: [new RegExp(search, 'i')] } }
//       ];
//     }

//     // Sort configuration
//     const sortConfig = {};
//     sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

//     // Execute query - exclude phone numbers and email for security
//     const leads = await Lead.find(query)
//       .select('-phone -alternatePhone -email -location -isSecure')
//       .populate('assignedTo', 'name employeeId')
//       .sort(sortConfig)
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .lean();

//     const total = await Lead.countDocuments(query);

//     // Get lead counts by status for this telecaller
//     const statusCounts = await Lead.aggregate([
//       { $match: { assignedTo: req.user.id } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     res.json({
//       success: true,
//       data: leads,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//         limit: parseInt(limit)
//       },
//       stats: {
//         statusCounts
//       }
//     });

//   } catch (error) {
//     console.error('Get telecaller leads error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching leads'
//     });
//   }
// });

// // @desc    Get lead details for calling (phone revealed only when calling)
// // @route   GET /api/telecaller/leads/:id/call
// // @access  Private/Telecaller
// router.get('/leads/:id/call', async (req, res) => {
//   try {
//     const lead = await Lead.findOne({
//       _id: req.params.id,
//       assignedTo: req.user.id
//     }).populate('assignedTo', 'name employeeId');

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lead not found or not assigned to you'
//       });
//     }

//     // Return phone number only for calling purpose with security audit
//     const callData = {
//       _id: lead._id,
//       name: lead.name,
//       phone: lead.phone, // Phone number revealed only for calling
//       alternatePhone: lead.alternatePhone,
//       currentEducation: lead.currentEducation,
//       interestedIn: lead.interestedIn,
//       preferredCourses: lead.preferredCourses,
//       preferredCountries: lead.preferredCountries,
//       budget: lead.budget,
//       location: {
//         city: lead.location?.city,
//         state: lead.location?.state
//       },
//       callHistory: lead.callHistory.slice(-5) // Last 5 calls
//     };

//     // Log the phone access for security audit
//     console.log(`Phone access: Telecaller ${req.user.employeeId} accessed phone of lead ${lead._id}`);

//     res.json({
//       success: true,
//       data: callData
//     });

//   } catch (error) {
//     console.error('Get lead for call error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching lead details'
//     });
//   }
// });

// // @desc    Initiate call - Log call attempt and reveal phone
// // @route   POST /api/telecaller/leads/:id/initiate-call
// // @access  Private/Telecaller
// router.post('/leads/:id/initiate-call', async (req, res) => {
//   try {
//     const lead = await Lead.findOne({
//       _id: req.params.id,
//       assignedTo: req.user.id
//     });

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lead not found or not assigned to you'
//       });
//     }

//     // Log call initiation
//     lead.callHistory.push({
//       calledBy: req.user.id,
//       outcome: 'Call Initiated',
//       duration: 0,
//       notes: 'Call initiated from CRM system',
//       callDate: new Date()
//     });

//     await lead.save();

//     // Update telecaller performance
//     await Employee.findByIdAndUpdate(req.user.id, {
//       $inc: { 'performance.totalCalls': 1 }
//     });

//     // Return phone number for redirection
//     res.json({
//       success: true,
//       data: {
//         phone: lead.phone,
//         name: lead.name,
//         leadId: lead._id,
//         message: 'Call initiated successfully. Redirect to dialer.'
//       },
//       redirectUrl: `tel:${lead.phone}`
//     });

//   } catch (error) {
//     console.error('Initiate call error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while initiating call'
//     });
//   }
// });

// // @desc    Update lead status and add call log
// // @route   PUT /api/telecaller/leads/:id
// // @access  Private/Telecaller
// router.put('/leads/:id', [
//   body('status')
//     .isIn(['new', 'contacted', 'interested', 'not_interested', 'converted', 'admitted', 'lost'])
//     .withMessage('Invalid status'),
//   body('callOutcome')
//     .notEmpty().withMessage('Call outcome is required')
//     .isIn([
//       'Not Reachable',
//       'Call Back Later',
//       'Interested - Send Details',
//       'Not Interested',
//       'Wrong Number',
//       'Already Admitted',
//       'Requested Counselling',
//       'Converted',
//       'Call Initiated'
//     ]).withMessage('Invalid call outcome'),
//   body('nextFollowUp').optional().isISO8601().withMessage('Invalid follow-up date'),
//   body('callDuration').optional().isInt({ min: 0 }).withMessage('Call duration must be a positive number'),
//   body('notes').optional().isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters')
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

//     const {
//       status,
//       callOutcome,
//       nextFollowUp,
//       callDuration = 0,
//       notes = ''
//     } = req.body;

//     const lead = await Lead.findOne({
//       _id: req.params.id,
//       assignedTo: req.user.id
//     });

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: 'Lead not found or not assigned to you'
//       });
//     }

//     // Add to call history
//     const callLog = {
//       calledBy: req.user.id,
//       outcome: callOutcome,
//       duration: callDuration,
//       notes: notes,
//       callDate: new Date()
//     };

//     if (nextFollowUp) {
//       callLog.nextFollowUp = new Date(nextFollowUp);
//     }

//     lead.callHistory.push(callLog);

//     // Update lead status and priority
//     lead.status = status;
    
//     // Auto-update priority based on status and follow-ups
//     if (status === 'interested' || nextFollowUp) {
//       lead.priority = 'high';
//     } else if (status === 'contacted') {
//       lead.priority = 'medium';
//     } else if (status === 'not_interested' || status === 'lost') {
//       lead.priority = 'low';
//     }

//     // Add general notes if provided
//     if (notes && notes.trim()) {
//       lead.notes = lead.notes ? `${lead.notes}\n${notes.trim()}` : notes.trim();
//     }

//     await lead.save();

//     // Update telecaller performance metrics
//     const performanceUpdate = {
//       'performance.totalCalls': 1
//     };

//     if (status === 'contacted' || status === 'interested') {
//       performanceUpdate['performance.successfulCalls'] = 1;
//     }

//     if (status === 'converted') {
//       performanceUpdate['performance.conversions'] = 1;
//     }

//     await Employee.findByIdAndUpdate(req.user.id, {
//       $inc: performanceUpdate
//     });

//     // Get updated lead with populated data
//     const updatedLead = await Lead.findById(lead._id)
//       .populate('assignedTo', 'name employeeId')
//       .select('-phone -alternatePhone -email'); // Keep sensitive data hidden

//     res.json({
//       success: true,
//       message: 'Lead updated successfully',
//       data: updatedLead
//     });

//   } catch (error) {
//     console.error('Update lead error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while updating lead'
//     });
//   }
// });

// // @desc    Get telecaller dashboard with stats
// // @route   GET /api/telecaller/dashboard
// // @access  Private/Telecaller
// router.get('/dashboard', async (req, res) => {
//   try {
//     const telecallerId = req.user.id;

//     // Get assigned leads count by status
//     const leadCounts = await Lead.aggregate([
//       { $match: { assignedTo: telecallerId } },
//       { $group: { _id: '$status', count: { $sum: 1 } } }
//     ]);

//     // Get today's follow-ups
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     const todaysFollowUps = await Lead.find({
//       assignedTo: telecallerId,
//       'callHistory.nextFollowUp': {
//         $gte: today,
//         $lt: tomorrow
//       },
//       status: { $in: ['new', 'contacted', 'interested'] }
//     })
//     .select('name currentEducation preferredCourses priority status callHistory')
//     .sort({ 'callHistory.nextFollowUp': 1 })
//     .limit(10);

//     // Get performance stats from employee record
//     const telecaller = await Employee.findById(telecallerId)
//       .select('performance name employeeId designation');

//     // Get recent calls (last 7 days)
//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     const recentCalls = await Lead.aggregate([
//       {
//         $match: {
//           assignedTo: telecallerId,
//           'callHistory.callDate': { $gte: sevenDaysAgo }
//         }
//       },
//       { $unwind: '$callHistory' },
//       {
//         $match: {
//           'callHistory.callDate': { $gte: sevenDaysAgo }
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           'callHistory.outcome': 1,
//           'callHistory.callDate': 1,
//           'callHistory.duration': 1
//         }
//       },
//       { $sort: { 'callHistory.callDate': -1 } },
//       { $limit: 10 }
//     ]);

//     // Calculate today's stats
//     const todayStats = await Lead.aggregate([
//       {
//         $match: {
//           assignedTo: telecallerId,
//           'callHistory.callDate': { $gte: today }
//         }
//       },
//       { $unwind: '$callHistory' },
//       {
//         $match: {
//           'callHistory.callDate': { $gte: today }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           callsToday: { $sum: 1 },
//           totalDuration: { $sum: '$callHistory.duration' },
//           successfulCalls: {
//             $sum: {
//               $cond: [
//                 {
//                   $in: [
//                     '$callHistory.outcome',
//                     ['Interested - Send Details', 'Requested Counselling', 'Converted']
//                   ]
//                 },
//                 1,
//                 0
//               ]
//             }
//           }
//         }
//       }
//     ]);

//     const totalAssigned = leadCounts.reduce((sum, item) => sum + item.count, 0);
//     const todayData = todayStats[0] || { callsToday: 0, totalDuration: 0, successfulCalls: 0 };

//     res.json({
//       success: true,
//       data: {
//         overview: {
//           totalAssigned,
//           performance: telecaller.performance,
//           todayCalls: todayData.callsToday,
//           todaySuccessfulCalls: todayData.successfulCalls,
//           averageCallDuration: todayData.callsToday > 0 ? 
//             Math.round(todayData.totalDuration / todayData.callsToday) : 0
//         },
//         leadCounts,
//         todaysFollowUps,
//         recentCalls,
//         quickStats: {
//           callsToday: todayData.callsToday,
//           successfulCallsToday: todayData.successfulCalls,
//           pendingFollowUps: todaysFollowUps.length,
//           conversionRate: totalAssigned > 0 ? 
//             (telecaller.performance.conversions / totalAssigned * 100).toFixed(2) : 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Telecaller dashboard error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching dashboard data'
//     });
//   }
// });

// // @desc    Get follow-up leads
// // @route   GET /api/telecaller/follow-ups
// // @access  Private/Telecaller
// router.get('/follow-ups', async (req, res) => {
//   try {
//     const { days = 7, page = 1, limit = 20 } = req.query;

//     const targetDate = new Date();
//     targetDate.setDate(targetDate.getDate() + parseInt(days));

//     const query = {
//       assignedTo: req.user.id,
//       'callHistory.nextFollowUp': {
//         $lte: targetDate,
//         $gte: new Date() // Only future follow-ups
//       },
//       status: { $in: ['new', 'contacted', 'interested'] }
//     };

//     const followUpLeads = await Lead.find(query)
//       .select('-phone -alternatePhone -email')
//       .populate('assignedTo', 'name employeeId')
//       .sort({ 'callHistory.nextFollowUp': 1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .lean();

//     const total = await Lead.countDocuments(query);

//     res.json({
//       success: true,
//       data: followUpLeads,
//       pagination: {
//         current: parseInt(page),
//         pages: Math.ceil(total / limit),
//         total,
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get follow-ups error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while fetching follow-up leads'
//     });
//   }
// });

// // @desc    Get telecaller performance report
// // @route   GET /api/telecaller/performance
// // @access  Private/Telecaller
// router.get('/performance', async (req, res) => {
//   try {
//     const { period = '30days' } = req.query;
    
//     let startDate = new Date();
//     switch (period) {
//       case '7days':
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case '30days':
//         startDate.setDate(startDate.getDate() - 30);
//         break;
//       case '90days':
//         startDate.setDate(startDate.getDate() - 90);
//         break;
//       default:
//         startDate.setDate(startDate.getDate() - 30);
//     }

//     // Daily performance for the period
//     const dailyPerformance = await Lead.aggregate([
//       {
//         $match: {
//           assignedTo: req.user.id,
//           'callHistory.callDate': { $gte: startDate }
//         }
//       },
//       { $unwind: '$callHistory' },
//       {
//         $match: {
//           'callHistory.callDate': { $gte: startDate }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             date: {
//               $dateToString: {
//                 format: '%Y-%m-%d',
//                 date: '$callHistory.callDate'
//               }
//             }
//           },
//           calls: { $sum: 1 },
//           successfulCalls: {
//             $sum: {
//               $cond: [
//                 {
//                   $in: [
//                     '$callHistory.outcome',
//                     ['Interested - Send Details', 'Requested Counselling', 'Converted']
//                   ]
//                 },
//                 1,
//                 0
//               ]
//             }
//           },
//           totalDuration: { $sum: '$callHistory.duration' },
//           conversions: {
//             $sum: {
//               $cond: [
//                 { $eq: ['$status', 'converted'] },
//                 1,
//                 0
//               ]
//             }
//           }
//         }
//       },
//       { $sort: { '_id.date': 1 } }
//     ]);

//     // Outcome distribution
//     const outcomeDistribution = await Lead.aggregate([
//       {
//         $match: {
//           assignedTo: req.user.id,
//           'callHistory.callDate': { $gte: startDate }
//         }
//       },
//       { $unwind: '$callHistory' },
//       {
//         $match: {
//           'callHistory.callDate': { $gte: startDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$callHistory.outcome',
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     // Get current performance metrics
//     const telecaller = await Employee.findById(req.user.id)
//       .select('performance name employeeId');

//     res.json({
//       success: true,
//       data: {
//         period,
//         startDate,
//         dailyPerformance,
//         outcomeDistribution,
//         currentPerformance: telecaller.performance,
//         summary: {
//           totalCalls: dailyPerformance.reduce((sum, day) => sum + day.calls, 0),
//           successfulCalls: dailyPerformance.reduce((sum, day) => sum + day.successfulCalls, 0),
//           totalConversions: dailyPerformance.reduce((sum, day) => sum + day.conversions, 0),
//           averageCallsPerDay: dailyPerformance.length > 0 ? 
//             (dailyPerformance.reduce((sum, day) => sum + day.calls, 0) / dailyPerformance.length).toFixed(1) : 0,
//           successRate: dailyPerformance.reduce((sum, day) => sum + day.calls, 0) > 0 ?
//             (dailyPerformance.reduce((sum, day) => sum + day.successfulCalls, 0) / 
//              dailyPerformance.reduce((sum, day) => sum + day.calls, 0) * 100).toFixed(1) : 0
//         }
//       }
//     });

//   } catch (error) {
//     console.error('Performance report error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while generating performance report'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes protected for telecallers only
router.use(protect);
router.use(authorize('telecaller'));

// @desc    Get telecaller's assigned leads
// @route   GET /api/telecaller/leads
// @access  Private/Telecaller
router.get('/leads', async (req, res) => {
  try {
    const leads = await Lead.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Get lead counts by status
    const statusCounts = await Lead.aggregate([
      { $match: { assignedTo: req.user.id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      count: leads.length,
      data: leads,
      stats: { statusCounts }
    });

  } catch (error) {
    console.error('Get telecaller leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leads'
    });
  }
});

// @desc    Get lead details for calling
// @route   GET /api/telecaller/leads/:id/call
// @access  Private/Telecaller
router.get('/leads/:id/call', async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      assignedTo: req.user.id
    }).populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    res.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Get lead for call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lead details'
    });
  }
});

// @desc    Update lead status
// @route   PUT /api/telecaller/leads/:id
// @access  Private/Telecaller
router.put('/leads/:id', [
  body('status').isIn(['new', 'contacted', 'interested', 'not_interested', 'converted']).withMessage('Invalid status'),
  body('callOutcome').notEmpty().withMessage('Call outcome is required')
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

    const { status, callOutcome, nextFollowUp, callDuration = 0, notes = '' } = req.body;

    const lead = await Lead.findOne({
      _id: req.params.id,
      assignedTo: req.user.id
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found or not assigned to you'
      });
    }

    // Add to call history
    lead.callHistory.push({
      calledBy: req.user.id,
      outcome: callOutcome,
      duration: callDuration,
      notes: notes,
      callDate: new Date(),
      nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : undefined
    });

    // Update lead status
    lead.status = status;

    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });

  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lead'
    });
  }
});

// @desc    Get telecaller dashboard
// @route   GET /api/telecaller/dashboard
// @access  Private/Telecaller
router.get('/dashboard', async (req, res) => {
  try {
    const telecallerId = req.user.id;

    // Get assigned leads count by status
    const leadCounts = await Lead.aggregate([
      { $match: { assignedTo: telecallerId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get today's follow-ups
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysFollowUps = await Lead.find({
      assignedTo: telecallerId,
      'callHistory.nextFollowUp': {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).limit(10);

    const totalAssigned = leadCounts.reduce((sum, item) => sum + item.count, 0);
    const convertedCount = leadCounts.find(item => item._id === 'converted')?.count || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalAssigned,
          converted: convertedCount,
          conversionRate: totalAssigned > 0 ? (convertedCount / totalAssigned * 100).toFixed(1) : 0
        },
        leadCounts,
        todaysFollowUps
      }
    });

  } catch (error) {
    console.error('Telecaller dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

module.exports = router;