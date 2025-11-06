// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// require('dotenv').config();

// const app = express();

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-crm')
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.log('❌ MongoDB Error:', err));

// // Middleware
// app.use(helmet());
// app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
//   message: 'Too many requests from this IP'
// });
// app.use(limiter);

// // Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/leads', require('./routes/leads'));
// app.use('/api/telecaller', require('./routes/telecaller'));

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'College CRM API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ success: false, message: 'Route not found' });
// });

// // Error handler
// app.use(require('./middleware/errorHandler'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Import User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-crm')
  .then(async () => {
    console.log('✅ MongoDB Connected');
    
    // Create default users if they don't exist
    await createDefaultUsers();
  })
  .catch(err => console.log('❌ MongoDB Error:', err));

// Function to create default users
const createDefaultUsers = async () => {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ email: 'admin@collegecrm.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@collegecrm.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        department: 'Administration'
      });
      console.log('✅ Default admin user created');
    }

    // Check if telecaller user exists
    const telecallerExists = await User.findOne({ email: 'telecaller@collegecrm.com' });
    if (!telecallerExists) {
      await User.create({
        name: 'Telecaller User',
        email: 'telecaller@collegecrm.com',
        password: 'telecaller123',
        role: 'telecaller',
        phone: '9876543211',
        department: 'Admissions'
      });
      console.log('✅ Default telecaller user created');
    }

    console.log('🎉 Default users are ready for login');
    
  } catch (error) {
    console.error('❌ Error creating default users:', error);
  }
};

// CORS Configuration - Multiple origins allow karein
const allowedOrigins = [
  'http://localhost:3000',
  'https://college-crm-one.vercel.app',
  'https://college-crm-one.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/telecaller', require('./routes/telecaller'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'College CRM API is running',
    timestamp: new Date().toISOString()
  });
});

// Test route to check users
app.get('/api/test-users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: https://college-crm.onrender.com`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`❤️  Health check: https://college-crm.onrender.com/api/health`);
});