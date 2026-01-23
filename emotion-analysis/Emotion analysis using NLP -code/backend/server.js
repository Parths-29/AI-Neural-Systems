// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Model
const Emotion = require('./models/Emotion');

// MongoDB Connection (Change URL if using MongoDB Atlas)
mongoose.connect('mongodb://127.0.0.1:27017/emotionDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- THE MAIN ROUTE ---
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    console.log(`Analyzing: "${text}"...`);

    // 1. Ask Python "Brain" for prediction
    // Note: Python server must be running on port 5000
    const pythonResponse = await axios.post('http://127.0.0.1:5000/predict', { text });
    
    const { emotion, confidence } = pythonResponse.data;

    // 2. Save result to MongoDB
    const newLog = new Emotion({
      inputText: text,
      detectedEmotion: emotion,
      confidenceScore: confidence
    });
    
    await newLog.save();
    console.log(`Saved result: ${emotion}`);

    // 3. Send back to User
    res.json({
      emotion,
      confidence,
      saved: true
    });

  } catch (error) {
    console.error("Error communicating with Python:", error.message);
    res.status(500).json({ error: "AI Service failed. Is Python running?" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Node Server running on http://localhost:${PORT}`);
});