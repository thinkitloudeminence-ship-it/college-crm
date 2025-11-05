const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Please add employee name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true,
    match: [
      /^[6-9]\d{9}$/,
      'Please add a valid 10-digit Indian phone number'
    ]
  },
  designation: {
    type: String,
    required: [true, 'Please add designation'],
    enum: {
      values: ['telecaller', 'counsellor', 'developer', 'hr', 'manager', 'coordinator'],
      message: 'Designation must be telecaller, counsellor, developer, hr, manager, or coordinator'
    }
  },
  department: {
    type: String,
    required: true,
    enum: {
      values: ['admissions', 'counselling', 'abroad_studies', 'technical', 'hr', 'operations'],
      message: 'Department must be admissions, counselling, abroad_studies, technical, hr, or operations'
    }
  },
  password: {
    type: String,
    required: [true, 'Please add password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    dateOfJoining: {
      type: Date,
      default: Date.now
    },
    salary: Number,
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  performance: {
    totalCalls: { type: Number, default: 0 },
    successfulCalls: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    totalLeads: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  leaves: {
    total: { type: Number, default: 18 },
    taken: { type: Number, default: 0 },
    remaining: { type: Number, default: 18 }
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for checking if account is locked
employeeSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full designation
employeeSchema.virtual('fullDesignation').get(function() {
  return `${this.designation.charAt(0).toUpperCase() + this.designation.slice(1)} - ${this.department}`;
});

// Generate employee ID before saving
employeeSchema.pre('save', async function(next) {
  if (this.isNew && !this.employeeId) {
    const namePart = this.name.split(' ')[0].toLowerCase();
    const desigPart = this.designation.toLowerCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.employeeId = `${namePart}${desigPart}${randomNum}`.toUpperCase();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Update remaining leaves when taken leaves are modified
employeeSchema.pre('save', function(next) {
  if (this.isModified('leaves.taken')) {
    this.leaves.remaining = this.leaves.total - this.leaves.taken;
  }
  next();
});

// Match password method
employeeSchema.methods.matchPassword = async function(enteredPassword) {
  if (this.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }

  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  
  if (!isMatch) {
    await this.incLoginAttempts();
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLogin = new Date();
  await this.save();

  return isMatch;
};

// Increment login attempts
employeeSchema.methods.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // 30 minutes lock
  }
  
  return this.updateOne(updates);
};

// Get signed JWT token
employeeSchema.methods.getSignedJwtToken = function() {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      id: this._id,
      employeeId: this.employeeId,
      role: this.designation,
      department: this.department 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Update performance metrics
employeeSchema.methods.updatePerformance = async function(metrics) {
  const updates = {};
  
  if (metrics.totalCalls) updates['performance.totalCalls'] = metrics.totalCalls;
  if (metrics.successfulCalls) updates['performance.successfulCalls'] = metrics.successfulCalls;
  if (metrics.conversions) updates['performance.conversions'] = metrics.conversions;
  if (metrics.totalLeads) updates['performance.totalLeads'] = metrics.totalLeads;
  if (metrics.rating !== undefined) updates['performance.rating'] = metrics.rating;

  return this.updateOne({ $inc: updates });
};

// Index for better query performance
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ email: 1 });
employeeSchema.index({ designation: 1, department: 1 });
employeeSchema.index({ isActive: 1 });

module.exports = mongoose.model('Employee', employeeSchema);