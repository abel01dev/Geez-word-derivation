const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { deriveWord, loadAllRules } = require('./derivation_engine');
const WordHistory = require('./models/WordHistory');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/geez-word-derivation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

// Word History Routes
app.get('/api/words', async (req, res) => {
  try {
    const history = await WordHistory.find().sort({ timestamp: -1 }).limit(10);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add DELETE endpoint for clearing history
app.delete('/api/words', async (req, res) => {
  try {
    await WordHistory.deleteMany({});
    res.status(200).json({ message: 'History cleared successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/words', async (req, res) => {
  try {
    const wordHistory = new WordHistory({
      originalWord: req.body.originalWord,
      derivedWord: req.body.derivedWord,
      pattern: req.body.pattern
    });
    const savedHistory = await wordHistory.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Derivation endpoint
app.post('/derive', async (req, res) => {
  const { word: root, ruleId } = req.body;

  if (!root || !ruleId) {
    return res.status(400).json({ error: 'Missing word or ruleId' });
  }

  const ruleIdNum = parseInt(ruleId, 10);

  try {
    const result = deriveWord(root, ruleIdNum);

    if (result) {
      try {
        // Save to history
        await WordHistory.findOneAndUpdate(
          {
            originalWord: root,
            pattern: `Rule ${ruleIdNum}`
          },
          {
            $set: {
              derivedWord: result.pastTense || Object.values(result)[0],
              timestamp: new Date()
            }
          },
          {
            upsert: true,
            new: true
          }
        );
        
        res.json(result);
      } catch (historyError) {
        // If history fails, still return the derivation
        res.json(result);
      }
    } else {
      res.status(404).json({ 
        error: `Could not derive words for "${root}" using Rule ${ruleIdNum}. Please check if you're using the correct rule for this word type.`
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error occurred during word derivation.' });
  }
});

app.get("/api/rules", (req, res) => {
  const rules = loadAllRules();
  const list = Object.keys(rules).map(id => ({
    id,
    name: rules[id].name || `Rule ${id}`
  }));
  res.json(list);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});
