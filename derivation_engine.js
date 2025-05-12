// derivation_engine.js

const fs = require("fs");
const path = require("path");

// A simplified vowel map (index is the vowel form)
const vowelMap = {
  "መ": ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  "ባ": ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"],
  "ተ": ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"],
  "ካ": ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"],
  "ማ": ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  "መ": ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"]
};

// Invert the vowel map to identify the root and vowel index
function getVowelInfo(char) {
  for (const [base, forms] of Object.entries(vowelMap)) {
    const idx = forms.indexOf(char);
    if (idx !== -1) return { base, index: idx };
  }
  return null;
}

// Decode Amharic word into base chars and vowels
function decomposeWord(word) {
  return word.split("").map(char => getVowelInfo(char));
}

// Apply rule to word
function applyRule(word, rule) {
  const letters = word.split("");
  const decomposed = decomposeWord(word);

  // Match condition
  if (
    decomposed.length !== rule.conditions.length ||
    decomposed[0]?.index !== rule.conditions.firstVowelIndex
  ) {
    return null; // rule doesn't match
  }

  const derived = {};

  for (const form of ["infinitive", "past", "jussive", "future"]) {
    const { prefix, suffix, vowelChange } = rule[form];
    let newLetters = [...letters];

    if (vowelChange) {
      const change = decomposed[vowelChange.index];
      if (change) {
        const newChar = vowelMap[change.base]?.[vowelChange.toVowel];
        if (newChar) newLetters[vowelChange.index] = newChar;
      }
    }

    derived[form] = `${prefix || ""}${newLetters.join("")}${suffix || ""}`;
  }

  return derived;
}

// Load all rule JSONs
function loadAllRules() {
  const ruleDir = __dirname;
  const ruleFiles = ["rules/rules_r1.json", "rules/rules_r2.json", "rules/rules_r3.json", "rules/rules_r4.json"];
  return ruleFiles.map(file => JSON.parse(fs.readFileSync(path.join(ruleDir, file), "utf-8")));
}

// Test
function deriveWord(word) {
  const rules = loadAllRules();
  for (const rule of rules) {
    const derived = applyRule(word, rule);
    if (derived) {
      console.log(`✅ Word "${word}" matched rule:`);
      console.table(derived);
      return;
    }
  }
  console.log(`❌ No rule matched for "${word}".`);
}

// Example Tests
deriveWord("መጣ");  // rule 1
deriveWord("ካደ");  // rule 2
deriveWord("ተኮሰ"); // rule 3
deriveWord("ባረከ"); // rule 4
deriveWord("ሄደ");  // no match
