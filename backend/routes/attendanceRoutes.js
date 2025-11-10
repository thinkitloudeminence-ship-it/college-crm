// const express = require('express');
// const Attendance = require('../models/Attendance');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Mark attendance (login)
// router.post('/login', auth, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let attendance = await Attendance.findOne({
//       user: req.user._id,
//       date: today
//     });

//     if (attendance) {
//       return res.status(400).json({ message: 'Already logged in today' });
//     }

//     const loginTime = new Date();
//     const expectedLogin = new Date();
//     expectedLogin.setHours(10, 0, 0, 0); // 10:00 AM

//     let lateBy = 0;
//     if (loginTime > expectedLogin) {
//       lateBy = Math.round((loginTime - expectedLogin) / (1000 * 60)); // minutes
//     }

//     attendance = new Attendance({
//       user: req.user._id,
//       date: today,
//       loginTime: loginTime,
//       status: 'present',
//       lateBy: lateBy
//     });

//     await attendance.save();
//     res.json({ message: 'Login recorded successfully', lateBy });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Mark attendance (logout)
// router.post('/logout', auth, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({
//       user: req.user._id,
//       date: today
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: 'No login record found for today' });
//     }

//     const logoutTime = new Date();
//     attendance.logoutTime = logoutTime;

//     // Calculate working hours
//     if (attendance.loginTime) {
//       const workingMs = logoutTime - attendance.loginTime;
//       const breakMs = attendance.totalBreakTime * 60 * 1000;
//       const actualWorkingMs = workingMs - breakMs;
      
//       attendance.workingHours = Math.round(actualWorkingMs / (1000 * 60)); // minutes
//     }

//     await attendance.save();
//     res.json({ message: 'Logout recorded successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add break
// router.post('/break', auth, async (req, res) => {
//   try {
//     const { breakType } = req.body;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let attendance = await Attendance.findOne({
//       user: req.user._id,
//       date: today
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: 'Please login first' });
//     }

//     attendance.breaks.push({
//       type: breakType,
//       startTime: new Date()
//     });

//     await attendance.save();
//     res.json({ message: 'Break started' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // End break
// router.post('/break/end', auth, async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const attendance = await Attendance.findOne({
//       user: req.user._id,
//       date: today
//     });

//     if (!attendance) {
//       return res.status(400).json({ message: 'No attendance record found' });
//     }

//     const activeBreak = attendance.breaks.find(breakItem => !breakItem.endTime);
    
//     if (!activeBreak) {
//       return res.status(400).json({ message: 'No active break found' });
//     }

//     activeBreak.endTime = new Date();
//     activeBreak.duration = Math.round(
//       (activeBreak.endTime - activeBreak.startTime) / (1000 * 60) // minutes
//     );

//     attendance.totalBreakTime = attendance.breaks.reduce(
//       (total, breakItem) => total + (breakItem.duration || 0), 0
//     );

//     await attendance.save();
//     res.json({ message: 'Break ended' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get attendance report
// router.get('/report', auth, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const { startDate, endDate, userId } = req.query;
    
//     let filter = {};
//     if (startDate && endDate) {
//       filter.date = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }

//     if (userId) {
//       filter.user = userId;
//     } else if (req.user.role === 'manager') {
//       const User = require('../models/User');
//       const teamMembers = await User.find({ manager: req.user._id });
//       filter.user = { $in: teamMembers.map(member => member._id) };
//     }

//     const attendance = await Attendance.find(filter)
//       .populate('user', 'name email department role')
//       .sort({ date: -1 });

//     res.json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const Attendance = require('../models/Attendance');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Mark attendance (login) - already handled in auth routes

// Mark break start
router.post('/break/start', auth, async (req, res) => {
  try {
    const { breakType, reason } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'Please login first' });
    }

    // Check if there's an active break
    const activeBreak = attendance.breaks.find(breakItem => !breakItem.endTime);
    if (activeBreak) {
      return res.status(400).json({ message: 'Please end current break first' });
    }

    attendance.breaks.push({
      type: breakType,
      startTime: new Date(),
      reason: reason || ''
    });

    await attendance.save();
    res.json({ message: 'Break started successfully' });
  } catch (error) {
    console.error('Start break error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark break end
router.post('/break/end', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No attendance record found' });
    }

    const activeBreak = attendance.breaks.find(breakItem => !breakItem.endTime);
    
    if (!activeBreak) {
      return res.status(400).json({ message: 'No active break found' });
    }

    activeBreak.endTime = new Date();
    activeBreak.duration = Math.round(
      (activeBreak.endTime - activeBreak.startTime) / (1000 * 60) // minutes
    );

    attendance.totalBreakTime = attendance.breaks.reduce(
      (total, breakItem) => total + (breakItem.duration || 0), 0
    );

    await attendance.save();
    res.json({ 
      message: 'Break ended successfully',
      duration: activeBreak.duration
    });
  } catch (error) {
    console.error('End break error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request half day or leave
router.post('/leave', auth, async (req, res) => {
  try {
    const { type, hours, reason } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (!attendance) {
      attendance = new Attendance({
        user: req.user._id,
        date: today
      });
    }

    if (hours >= 4) {
      attendance.status = 'half_day';
    } else {
      attendance.status = 'present';
    }

    attendance.leaves.push({
      type,
      hours,
      reason,
      approved: false // Requires manager approval
    });

    await attendance.save();
    res.json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    console.error('Leave request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance report
router.get('/report', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { startDate, endDate, userId, department } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (userId) {
      filter.user = userId;
    } else if (req.user.role === 'manager') {
      const User = require('../models/User');
      const teamMembers = await User.find({ manager: req.user._id });
      filter.user = { $in: teamMembers.map(member => member._id) };
    }

    if (department) {
      const User = require('../models/User');
      const usersInDept = await User.find({ department });
      filter.user = { $in: usersInDept.map(user => user._id) };
    }

    const attendance = await Attendance.find(filter)
      .populate('user', 'name email department role employeeId')
      .sort({ date: -1 });

    // Calculate summary statistics
    const summary = {
      totalDays: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      halfDays: attendance.filter(a => a.status === 'half_day').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      averageWorkingHours: 0,
      totalLate: attendance.filter(a => a.lateBy > 0).length
    };

    const totalWorkingMinutes = attendance.reduce((sum, a) => sum + (a.workingHours || 0), 0);
    summary.averageWorkingHours = summary.totalDays > 0 ? 
      (totalWorkingMinutes / summary.totalDays / 60).toFixed(2) : 0;

    res.json({
      attendance,
      summary
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get today's attendance
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (!attendance) {
      attendance = {
        user: req.user._id,
        date: today,
        status: 'absent',
        breaks: [],
        leaves: []
      };
    }

    res.json(attendance);
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team attendance (for managers)
router.get('/team/today', auth, authorize('manager'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const User = require('../models/User');
    const teamMembers = await User.find({ manager: req.user._id });

    const attendance = await Attendance.find({
      user: { $in: teamMembers.map(member => member._id) },
      date: today
    }).populate('user', 'name email employeeId department');

    res.json(attendance);
  } catch (error) {
    console.error('Get team attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;