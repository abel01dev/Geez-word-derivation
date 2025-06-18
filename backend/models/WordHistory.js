const mongoose = require('mongoose');

const wordHistorySchema = new mongoose.Schema({
  originalWord: {
    type: String,
    required: true
  },
  derivedWord: {
    type: String,
    required: true
  },
  pattern: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Create a compound unique index on originalWord and pattern
wordHistorySchema.index({ originalWord: 1, pattern: 1 }, { unique: true });

module.exports = mongoose.model('WordHistory', wordHistorySchema);