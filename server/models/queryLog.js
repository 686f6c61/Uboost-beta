const mongoose = require('mongoose');

/**
 * Modelo para registrar todas las consultas y su consumo de tokens
 */
const QueryLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  query: {
    type: String,
    required: true
  },
  response: {
    type: mongoose.Schema.Types.Mixed
  },
  model: {
    type: String,
    default: 'default'
  },
  tokens: {
    input: Number,
    output: Number,
    total: Number
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    required: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['simple_query', 'structured_summary', 'article_review', 'other'],
    default: 'simple_query'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('QueryLog', QueryLogSchema);
