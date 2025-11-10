const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'image'],
    default: 'text'
  },
  fileUrl: {
    type: String
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  roomId: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
chatSchema.index({ sender: 1, receiver: 1 });
chatSchema.index({ createdAt: 1 });
chatSchema.index({ roomId: 1 });

module.exports = mongoose.model('Chat', chatSchema);