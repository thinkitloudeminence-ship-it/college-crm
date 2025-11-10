const User = require('../models/User');

const setupStatusHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected for status updates:', socket.id);

    // User joins their personal room
    socket.on('join_user', async (userId) => {
      socket.join(userId);
      
      // Update user as active
      await User.findByIdAndUpdate(userId, { 
        isActive: true,
        lastActive: new Date()
      });
      
      // Notify others about user coming online
      socket.broadcast.emit('user_online', { userId });
      
      console.log(`User ${userId} joined status room`);
    });

    // User activity ping
    socket.on('user_activity', async (userId) => {
      await User.findByIdAndUpdate(userId, { 
        lastActive: new Date() 
      });
    });

    // User goes offline
    socket.on('user_offline', async (userId) => {
      await User.findByIdAndUpdate(userId, { 
        isActive: false 
      });
      
      socket.broadcast.emit('user_offline', { userId });
    });

    // Break status updates
    socket.on('break_started', (data) => {
      const { userId, breakType } = data;
      socket.broadcast.emit('user_on_break', { 
        userId, 
        breakType,
        startTime: new Date()
      });
    });

    socket.on('break_ended', (data) => {
      const { userId } = data;
      socket.broadcast.emit('user_back_from_break', { userId });
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected from status updates:', socket.id);
    });
  });
};

module.exports = setupStatusHandlers;