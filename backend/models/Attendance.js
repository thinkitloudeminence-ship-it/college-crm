const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  loginTime: {
    type: Date
  },
  logoutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half_day', 'leave', 'weekend'],
    default: 'absent'
  },
  lateBy: {
    type: Number, // minutes
    default: 0
  },
  workingHours: {
    type: Number, // minutes
    default: 0
  },
  breaks: [{
    type: {
      type: String,
      enum: ['lunch', 'tea', 'meeting', 'washroom', 'other']
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // minutes
    reason: String
  }],
  totalBreakTime: {
    type: Number, // minutes
    default: 0
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  leaves: [{
    type: {
      type: String,
      enum: ['sick', 'casual', 'emergency', 'planned']
    },
    hours: Number,
    reason: String,
    approved: {
      type: Boolean,
      default: false
    }
  }],
  location: {
    type: String
  },
  deviceInfo: {
    type: String
  }
});

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

// Calculate working hours before save
attendanceSchema.pre('save', function(next) {
  if (this.loginTime && this.logoutTime) {
    const workingMs = this.logoutTime - this.loginTime;
    const breakMs = this.totalBreakTime * 60 * 1000;
    const actualWorkingMs = workingMs - breakMs;
    this.workingHours = Math.round(actualWorkingMs / (1000 * 60)); // minutes
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);