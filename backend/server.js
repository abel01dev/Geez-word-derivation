const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

const { deriveWord, loadAllRules } = require('./derivation_engine');

app.use(cors());
app.use(express.json());

app.post('/derive', (req, res) => {
  console.log('🔍 Received body:', req.body);

  const { word: root, ruleId } = req.body;

  if (!root || !ruleId) {
    return res.status(400).json({ error: 'Missing word or ruleId' });
  }

  const ruleIdNum = parseInt(ruleId, 10);

  try {
    const result = deriveWord(root, ruleIdNum);

    console.log("🛠️ Derived result:", result);

    if (result) {
      res.json(result); // ✅ simplified to match frontend expectation
    } else {
      res.status(404).json({ error: `Rule ID ${ruleIdNum} does not match "${root}"` });
    }
  } catch (err) {
    console.error("❌ Backend error:", err);
    res.status(500).json({ error: err.message || 'Server error' });
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
