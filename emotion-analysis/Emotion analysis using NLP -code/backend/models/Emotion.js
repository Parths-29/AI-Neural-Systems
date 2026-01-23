// backend/models/Emotion.js
const mongoose = require('mongoose');

const EmotionSchema = new mongoose.Schema({
  inputText: {
    type: String,
    required: true
  },
  detectedEmotion: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Emotion', EmotionSchema);