// const express = require('express');
// const Attendance = require('../models/Attendance');
// const Lead = require('../models/Lead');
// const Task = require('../models/Task');
// const User = require('../models/User');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Get comprehensive dashboard report
// router.get('/dashboard', auth, async (req, res) => {
//   try {
//     let userFilter = {};
//     let leadFilter = {};
//     let taskFilter = {};

//     if (req.user.role === 'manager') {
//       const teamMembers = await User.find({ manager: req.user._id });
//       const teamMemberIds = teamMembers.map(member => member._id);
      
//       userFilter = { _id: { $in: teamMemberIds } };
//       leadFilter = { assignedTo: { $in: teamMemberIds } };
//       taskFilter = { assignedTo: { $in: teamMemberIds } };
//     } else if (req.user.role === 'telecaller') {
//       userFilter = { _id: req.user._id };
//       leadFilter = { assignedTo: req.user._id };
//       taskFilter = { assignedTo: req.user._id };
//     }

//     // User statistics
//     const totalUsers = await User.countDocuments(userFilter);
//     const activeUsers = await User.countDocuments({ ...userFilter, isActive: true });
//     const telecallers = await User.countDocuments({ ...userFilter, role: 'telecaller' });

//     // Lead statistics
//     const totalLeads = await Lead.countDocuments(leadFilter);
//     const convertedLeads = await Lead.countDocuments({ ...leadFilter, status: 'converted' });
//     const hotLeads = await Lead.countDocuments({ ...leadFilter, status: 'hot' });

//     // Task statistics
//     const totalTasks = await Task.countDocuments(taskFilter);
//     const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'completed' });
//     const overdueTasks = await Task.countDocuments({
//       ...taskFilter,
//       dueDate: { $lt: new Date() },
//       status: { $ne: 'completed' }
//     });

//     // Today's attendance
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const todayAttendance = await Attendance.countDocuments({
//       ...userFilter,
//       date: today,
//       status: 'present'
//     });

//     // Late arrivals today
//     const lateToday = await Attendance.countDocuments({
//       ...userFilter,
//       date: today,
//       lateBy: { $gt: 0 }
//     });

//     res.json({
//       users: {
//         total: totalUsers,
//         active: activeUsers,
//         telecallers: telecallers
//       },
//       leads: {
//         total: totalLeads,
//         converted: convertedLeads,
//         hot: hotLeads,
//         conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0
//       },
//       tasks: {
//         total: totalTasks,
//         completed: completedTasks,
//         overdue: overdueTasks,
//         completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
//       },
//       attendance: {
//         presentToday: todayAttendance,
//         lateToday: lateToday
//       }
//     });
//   } catch (error) {
//     console.error('Dashboard report error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Generate monthly report
// router.get('/monthly', auth, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const { year, month, department } = req.query;
    
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0);

//     let userFilter = {};
//     if (department) {
//       userFilter.department = department;
//     }
//     if (req.user.role === 'manager') {
//       const teamMembers = await User.find({ manager: req.user._id });
//       userFilter._id = { $in: teamMembers.map(member => member._id) };
//     }

//     const users = await User.find(userFilter).select('name email department role employeeId');

//     // Attendance data
//     const attendanceData = await Attendance.aggregate([
//       {
//         $match: {
//           user: { $in: users.map(u => u._id) },
//           date: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$user',
//           present: {
//             $sum: { $cond: [{ $in: ['$status', ['present', 'half_day']] }, 1, 0] }
//           },
//           halfDays: {
//             $sum: { $cond: [{ $eq: ['$status', 'half_day'] }, 1, 0] }
//           },
//           workingHours: { $sum: '$workingHours' },
//           breaks: { $sum: '$totalBreakTime' },
//           lateDays: {
//             $sum: { $cond: [{ $gt: ['$lateBy', 0] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     // Lead conversion data
//     const leadData = await Lead.aggregate([
//       {
//         $match: {
//           assignedTo: { $in: users.map(u => u._id) },
//           createdAt: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$assignedTo',
//           totalLeads: { $sum: 1 },
//           convertedLeads: {
//             $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     // Task completion data
//     const taskData = await Task.aggregate([
//       {
//         $match: {
//           assignedTo: { $in: users.map(u => u._id) },
//           dueDate: { $gte: startDate, $lte: endDate }
//         }
//       },
//       {
//         $group: {
//           _id: '$assignedTo',
//           totalTasks: { $sum: 1 },
//           completedTasks: {
//             $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
//           }
//         }
//       }
//     ]);

//     // Combine all data
//     const report = users.map(user => {
//       const attendance = attendanceData.find(a => a._id.toString() === user._id.toString()) || {};
//       const leads = leadData.find(l => l._id.toString() === user._id.toString()) || {};
//       const tasks = taskData.find(t => t._id.toString() === user._id.toString()) || {};

//       return {
//         employee: {
//           name: user.name,
//           email: user.email,
//           department: user.department,
//           employeeId: user.employeeId,
//           role: user.role
//         },
//         attendance: {
//           present: attendance.present || 0,
//           halfDays: attendance.halfDays || 0,
//           workingHours: Math.round((attendance.workingHours || 0) / 60), // Convert to hours
//           breaks: Math.round((attendance.breaks || 0) / 60), // Convert to hours
//           lateDays: attendance.lateDays || 0
//         },
//         performance: {
//           totalLeads: leads.totalLeads || 0,
//           convertedLeads: leads.convertedLeads || 0,
//           conversionRate: leads.totalLeads > 0 ? 
//             ((leads.convertedLeads / leads.totalLeads) * 100).toFixed(2) : 0,
//           totalTasks: tasks.totalTasks || 0,
//           completedTasks: tasks.completedTasks || 0,
//           taskCompletionRate: tasks.totalTasks > 0 ? 
//             ((tasks.completedTasks / tasks.totalTasks) * 100).toFixed(2) : 0
//         }
//       };
//     });

//     res.json({
//       period: { startDate, endDate },
//       summary: {
//         totalEmployees: users.length,
//         averageConversionRate: report.length > 0 ? 
//           (report.reduce((sum, r) => sum + parseFloat(r.performance.conversionRate), 0) / report.length).toFixed(2) : 0,
//         averageTaskCompletion: report.length > 0 ? 
//           (report.reduce((sum, r) => sum + parseFloat(r.performance.taskCompletionRate), 0) / report.length).toFixed(2) : 0
//       },
//       detailedReport: report
//     });
//   } catch (error) {
//     console.error('Monthly report error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const Attendance = require('../models/Attendance');
const Lead = require('../models/Lead');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Get comprehensive dashboard report
router.get('/dashboard', auth, async (req, res) => {
  try {
    let userFilter = {};
    let leadFilter = {};
    let taskFilter = {};

    if (req.user.role === 'manager') {
      const teamMembers = await User.find({ manager: req.user._id });
      const teamMemberIds = teamMembers.map(member => member._id);
      
      userFilter = { _id: { $in: teamMemberIds } };
      leadFilter = { assignedTo: { $in: teamMemberIds } };
      taskFilter = { assignedTo: { $in: teamMemberIds } };
    } else if (req.user.role === 'telecaller') {
      userFilter = { _id: req.user._id };
      leadFilter = { assignedTo: req.user._id };
      taskFilter = { assignedTo: req.user._id };
    }

    // User statistics
    const totalUsers = await User.countDocuments(userFilter);
    const activeUsers = await User.countDocuments({ ...userFilter, isActive: true });
    const telecallers = await User.countDocuments({ ...userFilter, role: 'telecaller' });

    // Lead statistics
    const totalLeads = await Lead.countDocuments(leadFilter);
    const convertedLeads = await Lead.countDocuments({ ...leadFilter, status: 'converted' });
    const hotLeads = await Lead.countDocuments({ ...leadFilter, status: 'hot' });

    // Forwarded leads statistics
    const forwardedStats = await Lead.aggregate([
      {
        $match: {
          $or: [
            { forwardedBy: req.user._id },
            { forwardedTo: req.user._id }
          ]
        }
      },
      {
        $group: {
          _id: null,
          forwardedByMe: {
            $sum: { $cond: [{ $eq: ['$forwardedBy', req.user._id] }, 1, 0] }
          },
          forwardedToMe: {
            $sum: { $cond: [{ $eq: ['$forwardedTo', req.user._id] }, 1, 0] }
          }
        }
      }
    ]);

    const forwardedData = forwardedStats.length > 0 ? forwardedStats[0] : {
      forwardedByMe: 0,
      forwardedToMe: 0
    };

    // Task statistics
    const totalTasks = await Task.countDocuments(taskFilter);
    const completedTasks = await Task.countDocuments({ ...taskFilter, status: 'completed' });
    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.countDocuments({
      ...userFilter,
      date: today,
      status: 'present'
    });

    // Late arrivals today
    const lateToday = await Attendance.countDocuments({
      ...userFilter,
      date: today,
      lateBy: { $gt: 0 }
    });

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        telecallers: telecallers
      },
      leads: {
        total: totalLeads,
        converted: convertedLeads,
        hot: hotLeads,
        conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0,
        forwardedByMe: forwardedData.forwardedByMe,
        forwardedToMe: forwardedData.forwardedToMe
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0
      },
      attendance: {
        presentToday: todayAttendance,
        lateToday: lateToday
      }
    });
  } catch (error) {
    console.error('Dashboard report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get forwarded leads statistics for admin dashboard
router.get('/forwarded-stats', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const forwardedStats = await Lead.aggregate([
      {
        $match: {
          $or: [
            { forwardedBy: { $exists: true } },
            { forwardedTo: { $exists: true } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalForwarded: { $sum: 1 },
          forwardedThisWeek: {
            $sum: {
              $cond: [
                { $gte: ['$forwardedAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
                1,
                0
              ]
            }
          },
          forwardedThisMonth: {
            $sum: {
              $cond: [
                { $gte: ['$forwardedAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Get top telecallers who forward most leads
    const topForwarders = await Lead.aggregate([
      {
        $match: {
          forwardedBy: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$forwardedBy',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          name: '$user.name',
          employeeId: '$user.employeeId',
          count: 1
        }
      }
    ]);

    const stats = forwardedStats.length > 0 ? forwardedStats[0] : {
      totalForwarded: 0,
      forwardedThisWeek: 0,
      forwardedThisMonth: 0
    };

    res.json({
      ...stats,
      topForwarders
    });
  } catch (error) {
    console.error('Forwarded stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate monthly report
router.get('/monthly', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { year, month, department } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    let userFilter = {};
    if (department) {
      userFilter.department = department;
    }
    if (req.user.role === 'manager') {
      const teamMembers = await User.find({ manager: req.user._id });
      userFilter._id = { $in: teamMembers.map(member => member._id) };
    }

    const users = await User.find(userFilter).select('name email department role employeeId');

    // Attendance data
    const attendanceData = await Attendance.aggregate([
      {
        $match: {
          user: { $in: users.map(u => u._id) },
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$user',
          present: {
            $sum: { $cond: [{ $in: ['$status', ['present', 'half_day']] }, 1, 0] }
          },
          halfDays: {
            $sum: { $cond: [{ $eq: ['$status', 'half_day'] }, 1, 0] }
          },
          workingHours: { $sum: '$workingHours' },
          breaks: { $sum: '$totalBreakTime' },
          lateDays: {
            $sum: { $cond: [{ $gt: ['$lateBy', 0] }, 1, 0] }
          }
        }
      }
    ]);

    // Lead conversion data
    const leadData = await Lead.aggregate([
      {
        $match: {
          assignedTo: { $in: users.map(u => u._id) },
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'converted'] }, 1, 0] }
          }
        }
      }
    ]);

    // Forwarded leads data
    const forwardedData = await Lead.aggregate([
      {
        $match: {
          forwardedBy: { $in: users.map(u => u._id) },
          forwardedAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$forwardedBy',
          forwardedLeads: { $sum: 1 }
        }
      }
    ]);

    // Task completion data
    const taskData = await Task.aggregate([
      {
        $match: {
          assignedTo: { $in: users.map(u => u._id) },
          dueDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Combine all data
    const report = users.map(user => {
      const attendance = attendanceData.find(a => a._id.toString() === user._id.toString()) || {};
      const leads = leadData.find(l => l._id.toString() === user._id.toString()) || {};
      const forwarded = forwardedData.find(f => f._id.toString() === user._id.toString()) || {};
      const tasks = taskData.find(t => t._id.toString() === user._id.toString()) || {};

      return {
        employee: {
          name: user.name,
          email: user.email,
          department: user.department,
          employeeId: user.employeeId,
          role: user.role
        },
        attendance: {
          present: attendance.present || 0,
          halfDays: attendance.halfDays || 0,
          workingHours: Math.round((attendance.workingHours || 0) / 60),
          breaks: Math.round((attendance.breaks || 0) / 60),
          lateDays: attendance.lateDays || 0
        },
        performance: {
          totalLeads: leads.totalLeads || 0,
          convertedLeads: leads.convertedLeads || 0,
          conversionRate: leads.totalLeads > 0 ? 
            ((leads.convertedLeads / leads.totalLeads) * 100).toFixed(2) : 0,
          forwardedLeads: forwarded.forwardedLeads || 0,
          totalTasks: tasks.totalTasks || 0,
          completedTasks: tasks.completedTasks || 0,
          taskCompletionRate: tasks.totalTasks > 0 ? 
            ((tasks.completedTasks / tasks.totalTasks) * 100).toFixed(2) : 0
        }
      };
    });

    res.json({
      period: { startDate, endDate },
      summary: {
        totalEmployees: users.length,
        averageConversionRate: report.length > 0 ? 
          (report.reduce((sum, r) => sum + parseFloat(r.performance.conversionRate), 0) / report.length).toFixed(2) : 0,
        averageTaskCompletion: report.length > 0 ? 
          (report.reduce((sum, r) => sum + parseFloat(r.performance.taskCompletionRate), 0) / report.length).toFixed(2) : 0,
        totalForwardedLeads: report.reduce((sum, r) => sum + r.performance.forwardedLeads, 0)
      },
      detailedReport: report
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;