const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'query', 'pdf_upload', 'pdf_process']
  },
  details: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sessionDuration: {
    type: Number, // Duración en segundos
    default: 0
  },
  tokensConsumed: {
    type: Number,
    default: 0
  },
  model: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);
