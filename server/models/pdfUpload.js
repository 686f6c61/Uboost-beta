const mongoose = require('mongoose');

const PDFUploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  storagePath: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  contentType: {
    type: String,
    default: 'application/pdf'
  },
  processed: {
    type: Boolean,
    default: false
  },
  processingResults: {
    title: String,
    summary: String,
    keywords: [String],
    language: String,
    suggestedTags: [String]
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessDate: {
    type: Date
  }
});

// Índices para mejorar el rendimiento de consultas frecuentes
PDFUploadSchema.index({ userId: 1, uploadDate: -1 });
PDFUploadSchema.index({ processed: 1 });

module.exports = mongoose.model('PDFUpload', PDFUploadSchema);
