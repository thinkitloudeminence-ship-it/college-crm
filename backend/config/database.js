// const mongoose = require('mongoose');

// // Database connection with advanced configuration
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000, // 30 seconds
//       socketTimeoutMS: 45000, // 45 seconds
//       maxPoolSize: 10,
//       minPoolSize: 5,
//       maxIdleTimeMS: 30000,
//       retryWrites: true,
//       w: 'majority'
//     });

//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//     console.log(`📊 Database: ${conn.connection.name}`);

//     // Connection event handlers
//     mongoose.connection.on('error', (err) => {
//       console.error('❌ MongoDB connection error:', err);
//     });

//     mongoose.connection.on('disconnected', () => {
//       console.log('ℹ️ MongoDB disconnected');
//     });

//     mongoose.connection.on('reconnected', () => {
//       console.log('✅ MongoDB reconnected');
//     });

//     mongoose.connection.on('connecting', () => {
//       console.log('🔄 Connecting to MongoDB...');
//     });

//     mongoose.connection.on('connected', () => {
//       console.log('✅ MongoDB connected successfully');
//     });

//     // Handle graceful shutdown
//     process.on('SIGINT', async () => {
//       try {
//         await mongoose.connection.close();
//         console.log('📦 MongoDB connection closed through app termination');
//         process.exit(0);
//       } catch (error) {
//         console.error('❌ Error closing MongoDB connection:', error);
//         process.exit(1);
//       }
//     });

//     return conn;

//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
    
//     // Enhanced error handling
//     if (error.name === 'MongoServerSelectionError') {
//       console.error('🔧 Troubleshooting tips:');
//       console.error('1. Check if MongoDB is running');
//       console.error('2. Verify MONGODB_URI in .env file');
//       console.error('3. Check network connectivity');
//       console.error('4. Verify database credentials');
//     }

//     process.exit(1);
//   }
// };

// // Get database stats
// const getDBStats = async () => {
//   try {
//     const stats = await mongoose.connection.db.stats();
//     return {
//       database: stats.db,
//       collections: stats.collections,
//       objects: stats.objects,
//       dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
//       storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
//       indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`
//     };
//   } catch (error) {
//     console.error('Error getting database stats:', error);
//     return null;
//   }
// };

// // Check database health
// const checkDBHealth = async () => {
//   try {
//     await mongoose.connection.db.admin().ping();
//     return {
//       status: 'healthy',
//       timestamp: new Date().toISOString()
//     };
//   } catch (error) {
//     return {
//       status: 'unhealthy',
//       error: error.message,
//       timestamp: new Date().toISOString()
//     };
//   }
// };

// module.exports = {
//   connectDB,
//   getDBStats,
//   checkDBHealth
// };


const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;