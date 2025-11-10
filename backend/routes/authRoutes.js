// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { auth } = require('../middlewares/auth');

// const router = express.Router();

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Update last login and active status
//     user.lastLogin = new Date();
//     user.isActive = true;
//     await user.save();

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Logout
// router.post('/logout', auth, async (req, res) => {
//   try {
//     req.user.isActive = false;
//     await req.user.save();
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get current user
// router.get('/me', auth, async (req, res) => {
//   res.json({
//     user: {
//       id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//       role: req.user.role,
//       department: req.user.department
//     }
//   });
// });

// module.exports = router;

// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { auth } = require('../middlewares/auth');

// const router = express.Router();

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Update last login and active status
//     user.lastLogin = new Date();
//     user.isActive = true;
//     await user.save();

//     // Create JWT token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department
//       }
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Logout
// router.post('/logout', auth, async (req, res) => {
//   try {
//     req.user.isActive = false;
//     await req.user.save();
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get current user
// router.get('/me', auth, async (req, res) => {
//   try {
//     res.json({
//       user: {
//         id: req.user._id,
//         name: req.user.name,
//         email: req.user.email,
//         role: req.user.role,
//         department: req.user.department
//       }
//     });
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;


const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Login with attendance tracking
router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceInfo, location } = req.body;

    const user = await User.findOne({ email, status: 'active' });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or account inactive' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Calculate late minutes
    const loginTime = new Date();
    const expectedLogin = new Date();
    expectedLogin.setHours(10, 0, 0, 0); // 10:00 AM
    
    let lateBy = 0;
    if (loginTime > expectedLogin) {
      lateBy = Math.round((loginTime - expectedLogin) / (1000 * 60));
    }

    // Create or update attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      user: user._id,
      date: today
    });

    if (!attendance) {
      attendance = new Attendance({
        user: user._id,
        date: today,
        loginTime: loginTime,
        status: 'present',
        lateBy: lateBy,
        deviceInfo,
        location
      });
    } else {
      attendance.loginTime = loginTime;
      attendance.lateBy = lateBy;
      attendance.status = 'present';
    }

    await attendance.save();

    // Update user status
    user.isActive = true;
    user.lastLogin = loginTime;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        lateBy: lateBy
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout with attendance update
router.post('/logout', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today
    });

    if (attendance) {
      attendance.logoutTime = new Date();
      await attendance.save();
    }

    req.user.isActive = false;
    await req.user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        employeeId: req.user.employeeId,
        isActive: req.user.isActive
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;