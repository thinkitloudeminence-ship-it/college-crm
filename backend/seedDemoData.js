const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Task = require('./models/Task');
require('dotenv').config();

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional)
    // await User.deleteMany({});
    // await Lead.deleteMany({});
    // await Task.deleteMany({});

    // Create demo users if they don't exist
    const admin = await User.findOne({ email: 'admin@crm.com' });
    if (!admin) {
      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@crm.com',
        password: 'admin123',
        role: 'admin',
        department: 'admin',
        phone: '+91 9876543210',
        address: 'Corporate Office, Mumbai'
      });
      await adminUser.save();
      console.log('Admin user created: admin@crm.com / admin123');
    }

    const manager = await User.findOne({ email: 'manager@crm.com' });
    if (!manager) {
      const managerUser = new User({
        name: 'Web Development Manager',
        email: 'manager@crm.com',
        password: 'manager123',
        role: 'manager',
        department: 'web development',
        phone: '+91 9876543211',
        address: 'Development Center, Bangalore'
      });
      await managerUser.save();
      console.log('Manager user created: manager@crm.com / manager123');
    }

    const employee = await User.findOne({ email: 'employee@crm.com' });
    if (!employee) {
      const employeeUser = new User({
        name: 'John Developer',
        email: 'employee@crm.com',
        password: 'employee123',
        role: 'employee',
        department: 'web development',
        manager: (await User.findOne({ email: 'manager@crm.com' }))._id,
        phone: '+91 9876543212',
        address: 'Developer Hub, Pune'
      });
      await employeeUser.save();
      console.log('Employee user created: employee@crm.com / employee123');
    }

    const telecaller = await User.findOne({ email: 'telecaller@crm.com' });
    if (!telecaller) {
      const telecallerUser = new User({
        name: 'Sarah Telecaller',
        email: 'telecaller@crm.com',
        password: 'telecaller123',
        role: 'telecaller',
        department: 'telecalling',
        phone: '+91 9876543213',
        address: 'Call Center, Delhi'
      });
      await telecallerUser.save();
      console.log('Telecaller user created: telecaller@crm.com / telecaller123');
    }

    // Create sample leads
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      const sampleLeads = [
        {
          name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '9876543210',
          college: 'IIT Bombay',
          course: 'Computer Science',
          city: 'Mumbai',
          source: 'collegeform.in',
          status: 'assigned',
          assignedTo: (await User.findOne({ email: 'telecaller@crm.com' }))._id,
          remarks: 'Interested in B.Tech program'
        },
        {
          name: 'Priya Patel',
          email: 'priya.patel@example.com',
          phone: '9876543211',
          college: 'Delhi University',
          course: 'Business Administration',
          city: 'Delhi',
          source: 'manual',
          status: 'hot',
          assignedTo: (await User.findOne({ email: 'telecaller@crm.com' }))._id,
          remarks: 'Very interested, follow up required'
        },
        {
          name: 'Rahul Kumar',
          email: 'rahul.kumar@example.com',
          phone: '9876543212',
          college: 'MIT Pune',
          course: 'Mechanical Engineering',
          city: 'Pune',
          source: 'website',
          status: 'converted',
          assignedTo: (await User.findOne({ email: 'telecaller@crm.com' }))._id,
          remarks: 'Successfully converted to admission'
        }
      ];

      await Lead.insertMany(sampleLeads);
      console.log('Sample leads created');
    }

    // Create sample tasks
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      const managerUser = await User.findOne({ email: 'manager@crm.com' });
      const employeeUser = await User.findOne({ email: 'employee@crm.com' });

      const sampleTasks = [
        {
          title: 'Develop Login Page',
          description: 'Create responsive login page with authentication',
          assignedTo: employeeUser._id,
          assignedBy: managerUser._id,
          department: 'web development',
          status: 'in_progress',
          priority: 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          progress: 60,
          project: 'CRM System',
          estimatedHours: 16
        },
        {
          title: 'Design User Dashboard',
          description: 'Design and implement user dashboard with charts and stats',
          assignedTo: employeeUser._id,
          assignedBy: managerUser._id,
          department: 'web development',
          status: 'pending',
          priority: 'medium',
          dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          progress: 0,
          project: 'CRM System',
          estimatedHours: 24
        },
        {
          title: 'Fix Mobile Responsiveness',
          description: 'Fix mobile responsiveness issues on lead management page',
          assignedTo: employeeUser._id,
          assignedBy: managerUser._id,
          department: 'web development',
          status: 'completed',
          priority: 'medium',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          progress: 100,
          project: 'CRM System',
          estimatedHours: 8
        }
      ];

      await Task.insertMany(sampleTasks);
      console.log('Sample tasks created');
    }

    console.log('Demo data seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
};

seedDemoData();