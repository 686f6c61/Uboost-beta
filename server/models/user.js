const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  countryCode: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  geoInfo: {
    lastLogin: {
      ip: String,
      city: String,
      country: String,
      countryCode: String,
      timestamp: Date
    },
    registrationIp: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paused', 'deleted'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Campos para seguimiento de uso
  usage: {
    pdfsProcessed: {
      type: Number,
      default: 0
    },
    tokens: {
      input: {
        type: Number,
        default: 0
      },
      output: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      }
    },
    estimatedCostUSD: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Gestión de almacenamiento
  storage: {
    // Límite en megabytes (200 MB por defecto)
    limitMB: {
      type: Number,
      default: 200
    },
    // Uso actual en bytes
    usedBytes: {
      type: Number,
      default: 0
    },
    // Historial de uso
    history: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      action: {
        type: String,
        enum: ['upload', 'delete', 'delete_all', 'admin_adjustment']
      },
      bytes: Number,
      fileName: String,
      fileId: String
    }]
  },
  // Gestión de almacenamiento
  storage: {
    // Límite en megabytes (200 MB por defecto)
    limitMB: {
      type: Number,
      default: 200
    },
    // Uso actual en bytes
    usedBytes: {
      type: Number,
      default: 0
    },
    // Historial de uso
    history: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      action: {
        type: String,
        enum: ['upload', 'delete', 'delete_all', 'admin_adjustment']
      },
      bytes: Number,
      fileName: String,
      fileId: String
    }]
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
