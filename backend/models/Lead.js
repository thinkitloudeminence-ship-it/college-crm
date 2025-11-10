// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true
//   },
//   phone: {
//     type: String,
//     required: true
//   },
//   source: {
//     type: String,
//     enum: ['collegeform.in', 'manual', 'social_media', 'website', 'other'],
//     default: 'manual'
//   },
//   status: {
//     type: String,
//     enum: ['new', 'assigned', 'contacted', 'hot', 'converted', 'future', 'dead', 'pending'],
//     default: 'new'
//   },
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   remarks: {
//     type: String
//   },
//   followUpDate: {
//     type: Date
//   },
//   college: {
//     type: String
//   },
//   course: {
//     type: String
//   },
//   city: {
//     type: String
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
//   timeline: [{
//     action: String,
//     remarks: String,
//     date: {
//       type: Date,
//       default: Date.now
//     },
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],
//   conversionDate: {
//     type: Date
//   }
// }, {
//   timestamps: true
// });

// // Index for better query performance
// leadSchema.index({ assignedTo: 1, status: 1 });
// leadSchema.index({ createdAt: 1 });
// leadSchema.index({ followUpDate: 1 });

// module.exports = mongoose.model('Lead', leadSchema);


// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   alternatePhone: {
//     type: String,
//     trim: true
//   },

//   // Education Details
//   education: {
//     qualification: String,
//     college: String,
//     university: String,
//     course: String,
//     specialization: String,
//     yearOfPassing: Number,
//     percentage: Number
//   },

//   // Personal Details
//   personal: {
//     dateOfBirth: Date,
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other']
//     },
//     fatherName: String,
//     motherName: String
//   },

//   // Address
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     country: {
//       type: String,
//       default: 'India'
//     },
//     pincode: String
//   },

//   // Lead Source & Tracking
//   source: {
//     type: String,
//     enum: ['collegeform.in', 'website', 'social_media', 'referral', 'walkin', 'campaign', 'other'],
//     required: true
//   },
//   sourceDetails: {
//     campaign: String,
//     medium: String,
//     keyword: String,
//     referrer: String
//   },

//   // Assignment & Status
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['new', 'contacted', 'not_reachable', 'callback', 'hot', 'warm', 'cold', 'converted', 'rejected', 'dead'],
//     default: 'new'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium'
//   },

//   // Communication History
//   communications: [{
//     type: {
//       type: String,
//       enum: ['call', 'email', 'sms', 'meeting', 'whatsapp']
//     },
//     direction: {
//       type: String,
//       enum: ['inbound', 'outbound']
//     },
//     summary: String,
//     notes: String,
//     duration: Number, // in minutes
//     scheduledAt: Date,
//     completedAt: Date,
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],

//   // Follow-up & Reminders
//   followUps: [{
//     scheduledAt: Date,
//     type: String,
//     notes: String,
//     status: {
//       type: String,
//       enum: ['pending', 'completed', 'cancelled']
//     },
//     completedAt: Date
//   }],

//   // Conversion Details
//   conversion: {
//     convertedAt: Date,
//     convertedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     courseEnrolled: String,
//     batch: String,
//     fees: Number,
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'partial', 'paid', 'refunded']
//     }
//   },

//   // Analytics
//   score: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0
//   },
//   tags: [String],

//   // Audit
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
// }, {
//   timestamps: true
// });

// // Indexes for better performance
// leadSchema.index({ assignedTo: 1, status: 1 });
// leadSchema.index({ email: 1 }, { unique: true, sparse: true });
// leadSchema.index({ phone: 1 }, { unique: true, sparse: true });
// leadSchema.index({ createdAt: 1 });
// leadSchema.index({ 'followUps.scheduledAt': 1 });

// // Virtual for next follow-up
// leadSchema.virtual('nextFollowUp').get(function () {
//   const pendingFollowUps = this.followUps.filter(f => f.status === 'pending');
//   return pendingFollowUps.length > 0 ?
//     pendingFollowUps.reduce((earliest, current) =>
//       earliest.scheduledAt < current.scheduledAt ? earliest : current
//     ) : null;
// });

// module.exports = mongoose.model('Lead', leadSchema);


// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   // ===== BASIC INFORMATION =====
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   alternateNumber: {
//     type: String,
//     trim: true
//   },

//   // ===== EDUCATION DETAILS =====
//   college: String,
//   course: String,
//   twelfthSubject: String,
//   currentCourse: String,
//   examPreparation: String,
  
//   // Extended education details from second schema
//   education: {
//     qualification: String,
//     university: String,
//     specialization: String,
//     yearOfPassing: Number,
//     percentage: Number
//   },

//   // ===== PERSONAL DETAILS =====
//   personal: {
//     dateOfBirth: Date,
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other']
//     },
//     fatherName: String,
//     motherName: String
//   },

//   // ===== LOCATION DETAILS =====
//   city: String,
//   currentCity: String,
//   preferredCity: String,
  
//   // Extended address details
//   address: {
//     street: String,
//     state: String,
//     country: {
//       type: String,
//       default: 'India'
//     },
//     pincode: String
//   },

//   // ===== LEAD SOURCE & TRACKING =====
//   source: {
//     type: String,
//     enum: ['website', 'referral', 'walkin', 'social_media', 'collegeform.in', 'campaign', 'other'],
//     default: 'website'
//   },
//   reference: String,
//   sourceDetails: {
//     campaign: String,
//     medium: String,
//     keyword: String,
//     referrer: String
//   },

//   // ===== ASSIGNMENT & STATUS =====
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['new', 'assigned', 'contacted', 'not_reachable', 'callback', 'hot', 'warm', 'cold', 'converted', 'future', 'rejected', 'dead'],
//     default: 'new'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium'
//   },

//   // ===== CALL & INTERACTION DETAILS =====
//   remarks: String,
//   callDuration: Number,
//   interestLevel: {
//     type: String,
//     enum: ['high', 'medium', 'low', 'not_interested']
//   },
//   nextAction: {
//     type: String,
//     enum: ['callback', 'meeting', 'document', 'followup', 'closed']
//   },
//   followUpDate: Date,
//   budget: String,
//   timeline: String,

//   // ===== COMMUNICATION HISTORY =====
//   communications: [{
//     type: {
//       type: String,
//       enum: ['call', 'email', 'sms', 'meeting', 'whatsapp']
//     },
//     direction: {
//       type: String,
//       enum: ['inbound', 'outbound']
//     },
//     summary: String,
//     notes: String,
//     duration: Number, // in minutes
//     scheduledAt: Date,
//     completedAt: Date,
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],

//   // ===== TIMELINE & HISTORY =====
//   timeline: [{
//     action: String,
//     remarks: String,
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now
//     }
//   }],

//   // ===== FOLLOW-UP & REMINDERS =====
//   followUps: [{
//     scheduledAt: Date,
//     type: String,
//     notes: String,
//     status: {
//       type: String,
//       enum: ['pending', 'completed', 'cancelled']
//     },
//     completedAt: Date
//   }],

//   // ===== CONVERSION DETAILS =====
//   conversionDate: Date,
//   conversion: {
//     convertedAt: Date,
//     convertedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     courseEnrolled: String,
//     batch: String,
//     fees: Number,
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'partial', 'paid', 'refunded']
//     }
//   },

//   // ===== ANALYTICS & TAGGING =====
//   score: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0
//   },
//   tags: [String],

//   // ===== AUDIT FIELDS =====
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }

// }, {
//   timestamps: true
// });

// // ===== INDEXES FOR BETTER PERFORMANCE =====
// leadSchema.index({ assignedTo: 1, status: 1 });
// leadSchema.index({ email: 1 }, { unique: true, sparse: true });
// leadSchema.index({ phone: 1 }, { unique: true, sparse: true });
// leadSchema.index({ createdAt: 1 });
// leadSchema.index({ 'followUps.scheduledAt': 1 });
// leadSchema.index({ status: 1 });
// leadSchema.index({ source: 1 });

// // ===== VIRTUAL FIELDS =====
// leadSchema.virtual('nextFollowUp').get(function () {
//   const pendingFollowUps = this.followUps.filter(f => f.status === 'pending');
//   return pendingFollowUps.length > 0 ?
//     pendingFollowUps.reduce((earliest, current) =>
//       earliest.scheduledAt < current.scheduledAt ? earliest : current
//     ) : null;
// });

// // Virtual for age calculation
// leadSchema.virtual('age').get(function () {
//   if (!this.personal?.dateOfBirth) return null;
//   const today = new Date();
//   const birthDate = new Date(this.personal.dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// });

// // ===== INSTANCE METHODS =====
// leadSchema.methods.addCommunication = function(communicationData) {
//   this.communications.push({
//     ...communicationData,
//     completedAt: communicationData.completedAt || new Date()
//   });
//   return this.save();
// };

// leadSchema.methods.addTimelineEvent = function(action, remarks, userId) {
//   this.timeline.push({
//     action,
//     remarks,
//     updatedBy: userId,
//     timestamp: new Date()
//   });
//   return this.save();
// };

// // ===== STATIC METHODS =====
// leadSchema.statics.findByStatus = function(status) {
//   return this.find({ status }).populate('assignedTo', 'name email');
// };

// leadSchema.statics.getLeadStats = function(userId, role) {
//   let matchStage = {};
  
//   if (role === 'telecaller') {
//     matchStage.assignedTo = mongoose.Types.ObjectId(userId);
//   }
  
//   return this.aggregate([
//     { $match: matchStage },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 }
//       }
//     }
//   ]);
// };

// module.exports = mongoose.model('Lead', leadSchema);


// const mongoose = require('mongoose');

// const leadSchema = new mongoose.Schema({
//   // ===== BASIC INFORMATION =====
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     maxlength: 100
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   alternateNumber: {
//     type: String,
//     trim: true
//   },

//   // ===== EDUCATION DETAILS =====
//   college: String,
//   course: String,
//   twelfthSubject: String,
//   currentCourse: String,
//   examPreparation: String,
  
//   // Extended education details from second schema
//   education: {
//     qualification: String,
//     university: String,
//     specialization: String,
//     yearOfPassing: Number,
//     percentage: Number
//   },

//   // ===== PERSONAL DETAILS =====
//   personal: {
//     dateOfBirth: Date,
//     gender: {
//       type: String,
//       enum: ['male', 'female', 'other']
//     },
//     fatherName: String,
//     motherName: String
//   },

//   // ===== LOCATION DETAILS =====
//   city: String,
//   currentCity: String,
//   preferredCity: String,
  
//   // Extended address details
//   address: {
//     street: String,
//     state: String,
//     country: {
//       type: String,
//       default: 'India'
//     },
//     pincode: String
//   },

//   // ===== LEAD SOURCE & TRACKING =====
//   source: {
//     type: String,
//     enum: ['website', 'referral', 'walkin', 'social_media', 'collegeform.in', 'campaign', 'other'],
//     default: 'website'
//   },
//   reference: String,
//   sourceDetails: {
//     campaign: String,
//     medium: String,
//     keyword: String,
//     referrer: String
//   },

//   // ===== ASSIGNMENT & STATUS =====
//   assignedTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   assignedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['new', 'assigned', 'contacted', 'not_reachable', 'callback', 'hot', 'warm', 'cold', 'converted', 'future', 'rejected', 'dead'],
//     default: 'new'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium'
//   },

//   // ===== CALL & INTERACTION DETAILS =====
//   remarks: String,
//   callDuration: Number,
//   interestLevel: {
//     type: String,
//     enum: ['high', 'medium', 'low', 'not_interested']
//   },
//   nextAction: {
//     type: String,
//     enum: ['callback', 'meeting', 'document', 'followup', 'closed']
//   },
//   followUpDate: Date,
//   budget: String,
//   // REMOVED: timeline (string) - conflicting with timeline array

//   // ===== COMMUNICATION HISTORY =====
//   communications: [{
//     type: {
//       type: String,
//       enum: ['call', 'email', 'sms', 'meeting', 'whatsapp']
//     },
//     direction: {
//       type: String,
//       enum: ['inbound', 'outbound']
//     },
//     summary: String,
//     notes: String,
//     duration: Number, // in minutes
//     scheduledAt: Date,
//     completedAt: Date,
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }
//   }],

//   // ===== TIMELINE & HISTORY =====
//   timeline: [{
//     action: String,
//     remarks: String,
//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now
//     }
//   }],

//   // ===== FOLLOW-UP & REMINDERS =====
//   followUps: [{
//     scheduledAt: Date,
//     type: String,
//     notes: String,
//     status: {
//       type: String,
//       enum: ['pending', 'completed', 'cancelled']
//     },
//     completedAt: Date
//   }],

//   // ===== CONVERSION DETAILS =====
//   conversionDate: Date,
//   conversion: {
//     convertedAt: Date,
//     convertedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     courseEnrolled: String,
//     batch: String,
//     fees: Number,
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'partial', 'paid', 'refunded']
//     }
//   },

//   // ===== ANALYTICS & TAGGING =====
//   score: {
//     type: Number,
//     min: 0,
//     max: 100,
//     default: 0
//   },
//   tags: [String],

//   // ===== AUDIT FIELDS =====
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }

// }, {
//   timestamps: true
// });

// // ===== INDEXES FOR BETTER PERFORMANCE =====
// leadSchema.index({ assignedTo: 1, status: 1 });
// leadSchema.index({ email: 1 }, { unique: true, sparse: true });
// leadSchema.index({ phone: 1 }, { unique: true, sparse: true });
// leadSchema.index({ createdAt: 1 });
// leadSchema.index({ 'followUps.scheduledAt': 1 });
// leadSchema.index({ status: 1 });
// leadSchema.index({ source: 1 });

// // ===== VIRTUAL FIELDS =====
// leadSchema.virtual('nextFollowUp').get(function () {
//   const pendingFollowUps = this.followUps.filter(f => f.status === 'pending');
//   return pendingFollowUps.length > 0 ?
//     pendingFollowUps.reduce((earliest, current) =>
//       earliest.scheduledAt < current.scheduledAt ? earliest : current
//     ) : null;
// });

// // Virtual for age calculation
// leadSchema.virtual('age').get(function () {
//   if (!this.personal?.dateOfBirth) return null;
//   const today = new Date();
//   const birthDate = new Date(this.personal.dateOfBirth);
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const monthDiff = today.getMonth() - birthDate.getMonth();
//   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// });

// // ===== INSTANCE METHODS =====
// leadSchema.methods.addCommunication = function(communicationData) {
//   this.communications.push({
//     ...communicationData,
//     completedAt: communicationData.completedAt || new Date()
//   });
//   return this.save();
// };

// leadSchema.methods.addTimelineEvent = function(action, remarks, userId) {
//   this.timeline.push({
//     action,
//     remarks,
//     updatedBy: userId,
//     timestamp: new Date()
//   });
//   return this.save();
// };

// // ===== STATIC METHODS =====
// leadSchema.statics.findByStatus = function(status) {
//   return this.find({ status }).populate('assignedTo', 'name email');
// };

// leadSchema.statics.getLeadStats = function(userId, role) {
//   let matchStage = {};
  
//   if (role === 'telecaller') {
//     matchStage.assignedTo = mongoose.Types.ObjectId(userId);
//   }
  
//   return this.aggregate([
//     { $match: matchStage },
//     {
//       $group: {
//         _id: '$status',
//         count: { $sum: 1 }
//       }
//     }
//   ]);
// };

// module.exports = mongoose.model('Lead', leadSchema);


const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  // ===== BASIC INFORMATION =====
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  alternateNumber: {
    type: String,
    trim: true
  },

  // ===== EDUCATION DETAILS =====
  college: String,
  course: String,
  twelfthSubject: String,
  currentCourse: String,
  examPreparation: String,
  
  // Extended education details from second schema
  education: {
    qualification: String,
    university: String,
    specialization: String,
    yearOfPassing: Number,
    percentage: Number
  },

  // ===== PERSONAL DETAILS =====
  personal: {
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    },
    fatherName: String,
    motherName: String
  },

  // ===== LOCATION DETAILS =====
  city: String,
  currentCity: String,
  preferredCity: String,
  
  // Extended address details
  address: {
    street: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    pincode: String
  },

  // ===== LEAD SOURCE & TRACKING =====
  source: {
    type: String,
    enum: ['website', 'referral', 'walkin', 'social_media', 'collegeform.in', 'campaign', 'other'],
    default: 'website'
  },
  reference: String,
  sourceDetails: {
    campaign: String,
    medium: String,
    keyword: String,
    referrer: String
  },

  // ===== ASSIGNMENT & STATUS =====
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['new', 'assigned', 'contacted', 'not_reachable', 'callback', 'hot', 'warm', 'cold', 'converted', 'future', 'rejected', 'dead'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  // ===== CALL & INTERACTION DETAILS =====
  remarks: String,
  callDuration: Number,
  interestLevel: {
    type: String,
    enum: ['high', 'medium', 'low', 'not_interested']
  },
  nextAction: {
    type: String,
    enum: ['callback', 'meeting', 'document', 'followup', 'closed']
  },
  followUpDate: Date,
  budget: String,

  // ===== FORWARD TRACKING =====
  forwardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  forwardedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  forwardReason: String,
  forwardNotes: String,
  forwardedAt: Date,
  forwardHistory: [{
    forwardedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    forwardedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    notes: String,
    forwardedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // ===== COMMUNICATION HISTORY =====
  communications: [{
    type: {
      type: String,
      enum: ['call', 'email', 'sms', 'meeting', 'whatsapp']
    },
    direction: {
      type: String,
      enum: ['inbound', 'outbound']
    },
    summary: String,
    notes: String,
    duration: Number, // in minutes
    scheduledAt: Date,
    completedAt: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],

  // ===== TIMELINE & HISTORY =====
  timeline: [{
    action: String,
    remarks: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // ===== FOLLOW-UP & REMINDERS =====
  followUps: [{
    scheduledAt: Date,
    type: String,
    notes: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled']
    },
    completedAt: Date
  }],

  // ===== CONVERSION DETAILS =====
  conversionDate: Date,
  conversion: {
    convertedAt: Date,
    convertedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    courseEnrolled: String,
    batch: String,
    fees: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded']
    }
  },

  // ===== ANALYTICS & TAGGING =====
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  tags: [String],

  // ===== AUDIT FIELDS =====
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
});

// ===== INDEXES FOR BETTER PERFORMANCE =====
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ email: 1 }, { unique: true, sparse: true });
leadSchema.index({ phone: 1 }, { unique: true, sparse: true });
leadSchema.index({ createdAt: 1 });
leadSchema.index({ 'followUps.scheduledAt': 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ forwardedBy: 1 });
leadSchema.index({ forwardedTo: 1 });
leadSchema.index({ forwardedAt: 1 });

// ===== VIRTUAL FIELDS =====
leadSchema.virtual('nextFollowUp').get(function () {
  const pendingFollowUps = this.followUps.filter(f => f.status === 'pending');
  return pendingFollowUps.length > 0 ?
    pendingFollowUps.reduce((earliest, current) =>
      earliest.scheduledAt < current.scheduledAt ? earliest : current
    ) : null;
});

// Virtual for age calculation
leadSchema.virtual('age').get(function () {
  if (!this.personal?.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personal.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// ===== INSTANCE METHODS =====
leadSchema.methods.addCommunication = function(communicationData) {
  this.communications.push({
    ...communicationData,
    completedAt: communicationData.completedAt || new Date()
  });
  return this.save();
};

leadSchema.methods.addTimelineEvent = function(action, remarks, userId) {
  this.timeline.push({
    action,
    remarks,
    updatedBy: userId,
    timestamp: new Date()
  });
  return this.save();
};

// ===== STATIC METHODS =====
leadSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('assignedTo', 'name email');
};

leadSchema.statics.getLeadStats = function(userId, role) {
  let matchStage = {};
  
  if (role === 'telecaller') {
    matchStage.assignedTo = mongoose.Types.ObjectId(userId);
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Lead', leadSchema);