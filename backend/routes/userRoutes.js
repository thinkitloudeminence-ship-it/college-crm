// const express = require('express');
// const User = require('../models/User');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Get all users (Admin only)
// router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     let filter = {};
    
//     if (req.user.role === 'manager') {
//       filter = { 
//         $or: [
//           { manager: req.user._id },
//           { _id: req.user._id }
//         ]
//       };
//     }

//     const users = await User.find(filter).select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create user (Admin/Manager)
// router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const { name, email, password, role, department, phone, address } = req.body;

//     let userData = {
//       name,
//       email,
//       password: password || 'default123',
//       role,
//       department,
//       phone,
//       address
//     };

//     if (req.user.role === 'manager') {
//       userData.manager = req.user._id;
//       userData.role = 'employee'; // Managers can only create employees
//     }

//     const user = new User(userData);
//     await user.save();

//     res.status(201).json({ 
//       message: 'User created successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department
//       }
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Email already exists' });
//     }
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update user
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     ).select('-password');
    
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Delete user (Admin only)
// router.delete('/:id', auth, authorize('admin'), async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const User = require('../models/User');
const { auth, authorize } = require('../middlewares/auth');
const { sendWelcomeEmail } = require('../utils/sendEmail');

const router = express.Router();

// Get all users with filters
router.get('/', auth, async (req, res) => {
  try {
    const { role, department, manager, active } = req.query;
    let filter = {};
    
    if (req.user.role === 'manager') {
      filter = { 
        $or: [
          { manager: req.user._id },
          { _id: req.user._id }
        ]
      };
    } else if (req.user.role === 'employee' || req.user.role === 'telecaller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (manager) filter.manager = manager;
    if (active !== undefined) filter.isActive = active === 'true';

    const users = await User.find(filter)
      .select('-password')
      .populate('manager', 'name email employeeId')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (Admin/Manager)
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { name, email, password, role, department, phone, address, manager } = req.body;

    let userData = {
      name,
      email,
      password: password || 'default123',
      role,
      department,
      phone,
      address
    };

    if (req.user.role === 'manager') {
      userData.manager = req.user._id;
      // Managers can only create employees in their department
      if (role !== 'employee' || department !== req.user.department) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    if (manager && req.user.role === 'admin') {
      userData.manager = manager;
    }

    const user = new User(userData);
    await user.save();

    // Send welcome email
    try {
      await sendWelcomeEmail(
        user.email,
        user.name,
        password || 'default123',
        `${process.env.CLIENT_URL}/login`
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('manager', 'name email employeeId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'manager' && user.manager?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check permissions
    if (req.user.role === 'manager' && user.manager?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team members (for managers)
router.get('/team/members', auth, authorize('manager'), async (req, res) => {
  try {
    const teamMembers = await User.find({ 
      manager: req.user._id,
      status: 'active'
    }).select('-password');

    res.json(teamMembers);
  } catch (error) {
    console.error('Get team members error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;