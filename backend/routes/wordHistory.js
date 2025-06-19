const express = require('express');
const WordHistory = require('../models/WordHistory');
const router = express.Router();

// Get all word history
router.get('/', async (req, res) => {
  try {
    const history = await WordHistory.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save word history
router.post('/', async (req, res) => {
  try {
    const { originalWord, derivedWord, pattern } = req.body;
    if (!originalWord || !derivedWord || !pattern) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const history = await WordHistory.findOneAndUpdate(
      { originalWord, pattern },
      { $set: { derivedWord, timestamp: new Date() } },
      { upsert: true, new: true }
    );
    res.status(201).json(history);
  } catch (err) {
    console.error('Error saving word history:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete all word history
router.delete('/', async (req, res) => {
  try {
    await WordHistory.deleteMany({});
    res.status(200).json({ message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;