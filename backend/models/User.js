const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'telecaller'],
    required: true
  },
  department: {
    type: String,
    enum: ['telecalling', 'web development', 'digital marketing', 'hr', 'admin'],
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  loginTime: {
    type: String,
    default: '10:00'
  },
  logoutTime: {
    type: String,
    default: '19:00'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  employeeId: {
    type: String,
    unique: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate employee ID
userSchema.pre('save', async function (next) {
  if (this.isNew && !this.employeeId) {
    const departmentCode = {
      'admin': 'ADM',
      'manager': 'MGR',
      'telecaller': 'TEL',
      'web development': 'WEB',
      'digital marketing': 'DGM',
      'hr': 'HR'
    }[this.department] || 'EMP';

    const count = await mongoose.model('User').countDocuments({ department: this.department });
    this.employeeId = `${departmentCode}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);