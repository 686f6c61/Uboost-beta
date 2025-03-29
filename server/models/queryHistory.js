const mongoose = require('mongoose');

const QueryHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  queryType: {
    type: String,
    enum: ['simple_query', 'structured_summary', 'review_article'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  promptType: {
    type: String,
    enum: ['default_uboost', 'custom'],
    required: true
  },
  model: {
    type: String,
    required: true
  },
  configuration: {
    temperature: Number,
    maxTokens: Number,
    topP: Number,
    frequencyPenalty: Number,
    presencePenalty: Number,
    language: String
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
  processingTime: {
    type: Number,  // en milisegundos
    default: 0
  },
  processedFiles: [{
    filename: String,
    fileSize: Number,  // en bytes
    pageCount: Number
  }],
  response: {
    type: String,  // El texto completo de la respuesta
    required: true
  },
  // Para facilitar búsquedas por palabra clave
  keywords: [String],
  // Para permitir a los usuarios marcar consultas importantes
  starred: {
    type: Boolean,
    default: false
  }
});

// Índices para mejorar el rendimiento de búsqueda
QueryHistorySchema.index({ user: 1, timestamp: -1 });
QueryHistorySchema.index({ user: 1, queryType: 1 });
QueryHistorySchema.index({ user: 1, starred: 1 });
QueryHistorySchema.index({ keywords: 1 });

module.exports = mongoose.model('QueryHistory', QueryHistorySchema);
