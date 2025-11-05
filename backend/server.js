// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const mongoSanitize = require('express-mongo-sanitize');
// const compression = require('compression');
// const cookieParser = require('cookie-parser');
// require('dotenv').config();

// // Import database connection
// const { connectDB } = require('./config/database');

// // Import routes
// const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');
// const telecallerRoutes = require('./routes/telecaller');
// const leadsRoutes = require('./routes/leads');
// const reportsRoutes = require('./routes/reports');
// const webhookRoutes = require('./routes/webhooks');

// // Import middleware
// const errorHandler = require('./middleware/errorHandler');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Security middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(compression());
// app.use(mongoSanitize());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // limit each IP to 1000 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });
// app.use(limiter);

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // Static files
// app.use('/uploads', express.static('uploads'));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/telecaller', telecallerRoutes);
// app.use('/api/leads', leadsRoutes);
// app.use('/api/reports', reportsRoutes);
// app.use('/api/webhooks', webhookRoutes);

// // Health check route
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true,
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development'
//   });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'College CRM Backend API', 
//     version: '1.0.0',
//     documentation: '/api/docs'
//   });
// });

// // Error handling middleware (should be last)
// app.use(errorHandler);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ 
//     success: false,
//     message: 'Route not found' 
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 API URL: http://localhost:${PORT}/api`);
//   console.log(`❤️ Health check: http://localhost:${PORT}/api/health`);
// });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-crm')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err));

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
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
});