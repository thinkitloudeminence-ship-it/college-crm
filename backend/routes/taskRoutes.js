// const express = require('express');
// const Task = require('../models/Task');
// const { auth, authorize } = require('../middlewares/auth');

// const router = express.Router();

// // Get tasks
// router.get('/', auth, async (req, res) => {
//   try {
//     let filter = {};
    
//     if (req.user.role === 'employee' || req.user.role === 'telecaller') {
//       filter.assignedTo = req.user._id;
//     } else if (req.user.role === 'manager') {
//       // Get tasks assigned to manager's team
//       const User = require('../models/User');
//       const teamMembers = await User.find({ manager: req.user._id });
//       filter.assignedTo = { $in: teamMembers.map(member => member._id) };
//     }

//     const tasks = await Task.find(filter)
//       .populate('assignedTo', 'name email department')
//       .populate('assignedBy', 'name email')
//       .sort({ createdAt: -1 });
    
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create task (Manager/Admin)
// router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const taskData = {
//       ...req.body,
//       assignedBy: req.user._id
//     };

//     const task = new Task(taskData);
//     await task.save();

//     await task.populate('assignedTo', 'name email department');
//     await task.populate('assignedBy', 'name email');

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Update task
// router.put('/:id', auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     // Check permissions
//     if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     )
//     .populate('assignedTo', 'name email department')
//     .populate('assignedBy', 'name email');

//     res.json(updatedTask);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Add comment to task
// router.post('/:id/comments', auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
    
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found' });
//     }

//     task.comments.push({
//       comment: req.body.comment,
//       commentedBy: req.user._id
//     });

//     await task.save();
//     res.json(task);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express');
const Task = require('../models/Task');
const { auth, authorize } = require('../middlewares/auth');

const router = express.Router();

// Get tasks with filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, assignedTo, department, priority, project } = req.query;
    let filter = {};
    
    if (req.user.role === 'employee' || req.user.role === 'telecaller') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'manager') {
      const User = require('../models/User');
      const teamMembers = await User.find({ manager: req.user._id });
      filter.assignedTo = { $in: teamMembers.map(member => member._id) };
    }

    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (department) filter.department = department;
    if (priority) filter.priority = priority;
    if (project) filter.project = project;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email employeeId department')
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1, priority: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task (Manager/Admin)
router.post('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      assignedBy: req.user._id
    };

    // Managers can only assign to their team
    if (req.user.role === 'manager') {
      const User = require('../models/User');
      const teamMember = await User.findOne({ 
        _id: taskData.assignedTo, 
        manager: req.user._id 
      });
      if (!teamMember) {
        return res.status(403).json({ message: 'Can only assign tasks to team members' });
      }
    }

    const task = new Task(taskData);
    await task.save();

    await task.populate('assignedTo', 'name email employeeId department');
    await task.populate('assignedBy', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Employees can only update status, progress, and comments
    if (req.user.role === 'employee') {
      const allowedUpdates = ['status', 'progress', 'comments', 'actualHours'];
      Object.keys(req.body).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete req.body[key];
        }
      });

      // Auto-complete if progress is 100%
      if (req.body.progress === 100) {
        req.body.status = 'completed';
        req.body.completionDate = new Date();
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate('assignedTo', 'name email employeeId department')
    .populate('assignedBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment to task
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.comments.push({
      comment: req.body.comment,
      commentedBy: req.user._id
    });

    await task.save();
    
    await task.populate('assignedTo', 'name email employeeId department');
    await task.populate('assignedBy', 'name email');
    await task.populate('comments.commentedBy', 'name email');

    res.json(task);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'employee' || req.user.role === 'telecaller') {
      filter.assignedTo = req.user._id;
    } else if (req.user.role === 'manager') {
      const User = require('../models/User');
      const teamMembers = await User.find({ manager: req.user._id });
      filter.assignedTo = { $in: teamMembers.map(member => member._id) };
    }

    const stats = await Task.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHours: { $sum: '$estimatedHours' }
        }
      }
    ]);

    const total = await Task.countDocuments(filter);
    const completed = await Task.countDocuments({ ...filter, status: 'completed' });
    const overdue = await Task.countDocuments({ 
      ...filter, 
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' }
    });

    res.json({
      total,
      completed,
      overdue,
      byStatus: stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;