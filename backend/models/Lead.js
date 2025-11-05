const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add student name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    match: [/^[6-9]\d{9}$/, 'Please add valid Indian phone number']
  },
  email: {
    type: String,
    lowercase: true
  },
  currentEducation: {
    qualification: String,
    stream: String,
    passingYear: Number,
    percentage: String
  },
  interestedIn: {
    type: String,
    enum: ['domestic', 'abroad'],
    default: 'domestic'
  },
  preferredCourses: [String],
  source: {
    type: String,
    enum: ['manual', 'website', 'facebook', 'instagram', 'reference'],
    default: 'manual'
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'not_interested', 'converted'],
    default: 'new'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  callHistory: [{
    calledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    callDate: {
      type: Date,
      default: Date.now
    },
    outcome: String,
    duration: Number,
    notes: String,
    nextFollowUp: Date
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);