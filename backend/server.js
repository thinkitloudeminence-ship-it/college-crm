// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const http = require('http');
// const socketIo = require('socket.io');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// dotenv.config();

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     methods: ['GET', 'POST']
//   }
// });

// // Security Middleware
// app.use(helmet());
// app.use(cors());
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use('/api/', limiter);

// // Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected successfully'))
// .catch(err => console.log('MongoDB connection error:', err));

// const createDemoUsers = require('./utils/createDemoUsers');
// createDemoUsers();

// // Socket.io for real-time features
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join_user', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined room`);
//   });

//   socket.on('send_message', (messageData) => {
//     socket.to(messageData.receiver).emit('receive_message', messageData);
//     socket.emit('message_sent', messageData);
//   });

//   socket.on('user_activity', (data) => {
//     socket.broadcast.emit('user_status_changed', data);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/leads', require('./routes/leadRoutes'));
// app.use('/api/tasks', require('./routes/taskRoutes'));
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/chat', require('./routes/chatRoutes'));
// app.use('/api/reports', require('./routes/reportRoutes'));
// app.use('/api/upload', require('./routes/uploadRoutes'));

// // CollegeForm.in integration endpoint
// app.post('/api/external/collegeform', require('./controllers/externalController').collegeFormWebhook);

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'CRM API is working!' });
// });

// // Auto logout system
// require('./utils/autoLogout');

// // Create default admin
// const createDefaultAdmin = async () => {
//   try {
//     const User = require('./models/User');
//     const adminExists = await User.findOne({ email: 'admin@crm.com' });
    
//     if (!adminExists) {
//       const admin = new User({
//         name: 'System Admin',
//         email: 'admin@crm.com',
//         password: 'admin123',
//         role: 'admin',
//         department: 'admin',
//         isActive: true
//       });
//       await admin.save();
//       console.log('Default admin created: admin@crm.com / admin123');
//     }

//     // Create sample manager
//     const managerExists = await User.findOne({ email: 'manager@crm.com' });
//     if (!managerExists) {
//       const manager = new User({
//         name: 'Sample Manager',
//         email: 'manager@crm.com',
//         password: 'manager123',
//         role: 'manager',
//         department: 'web development',
//         isActive: true
//       });
//       await manager.save();
//       console.log('Sample manager created: manager@crm.com / manager123');
//     }
//   } catch (error) {
//     console.error('Error creating default users:', error);
//   }
// };

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
//   await createDefaultAdmin();
// });



const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const leadRoutes = require('./routes/leadRoutes');
const uploadRoutes = require('./routes/uploadRoutes'); 

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST']
  }
});

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - Development ke liye relaxed settings
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Development mein zyada requests allow karo
  message: {
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sirf API routes par rate limiting lagao
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('MongoDB connection error:', err));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('send_message', (messageData) => {
    socket.to(messageData.receiver).emit('receive_message', messageData);
    socket.emit('message_sent', messageData);
  });

  socket.on('user_activity', (data) => {
    socket.broadcast.emit('user_status_changed', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// CollegeForm.in integration endpoint
app.post('/api/external/collegeform', require('./controllers/externalController').collegeFormWebhook);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'CRM API is working!' });
});

// Create default admin
const createDefaultAdmin = async () => {
  try {
    const User = require('./models/User');
    const adminExists = await User.findOne({ email: 'admin@crm.com' });
    
    if (!adminExists) {
      const admin = new User({
        name: 'System Admin',
        email: 'admin@crm.com',
        password: 'admin123',
        role: 'admin',
        department: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('Default admin created: admin@crm.com / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createDefaultAdmin();
});