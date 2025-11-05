const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional)
    // await User.deleteMany({});

    // Create default users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@collegecrm.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        department: 'Administration'
      },
      {
        name: 'Telecaller User',
        email: 'telecaller@collegecrm.com',
        password: 'telecaller123',
        role: 'telecaller',
        phone: '9876543211',
        department: 'Admissions'
      },
      {
        name: 'John Telecaller',
        email: 'john@collegecrm.com',
        password: 'john123',
        role: 'telecaller',
        phone: '9876543212',
        department: 'Admissions'
      }
    ];

    for (let userData of users) {
      const userExists = await User.findOne({ email: userData.email });
      if (!userExists) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${userData.email}`);
      }
    }

    console.log('🎉 Seed completed successfully!');
    console.log('\n📋 Default Login Credentials:');
    console.log('Admin: admin@collegecrm.com / admin123');
    console.log('Telecaller: telecaller@collegecrm.com / telecaller123');
    console.log('Telecaller 2: john@collegecrm.com / john123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedUsers();