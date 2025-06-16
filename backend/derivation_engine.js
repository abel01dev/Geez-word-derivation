// 📁 backend/derivation_engine.js

const fs = require("fs");
const path = require("path");

const vowelMap = {
  "ሀ": ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"],
  "ለ": ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"],
  "ሐ": ["ሐ", "ሑ", "ሒ", "ሓ", "ሔ", "ሕ", "ሖ"],
  "መ": ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"],
  "ሠ": ["ሠ", "ሡ", "ሢ", "ሣ", "ሤ", "ሥ", "ሦ"],
  "ረ": ["ረ", "ሩ", "ሪ", "ራ", "ሬ", "ር", "ሮ"],
  "ሰ": ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"],
  "ሸ": ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"],
  "ቀ": ["ቀ", "ቁ", "ቂ", "ቃ", "ቄ", "ቅ", "ቆ"],
  "በ": ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"],
  "ተ": ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"],
  "ቸ": ["ቸ", "ቹ", "ቺ", "ቻ", "ቼ", "ች", "ቾ"],
  "ኀ": ["ኀ", "ኁ", "ኂ", "ኃ", "ኄ", "ኅ", "ኆ"],
  "ነ": ["ነ", "ኑ", "ኒ", "ና", "ኔ", "ን", "ኖ"],
  "ኘ": ["ኘ", "ኙ", "ኚ", "ኛ", "ኜ", "ኝ", "ኞ"],
  "አ": ["አ", "ኡ", "ኢ", "ኣ", "ኤ", "እ", "ኦ"],
  "ከ": ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"],
  "ኸ": ["ኸ", "ኹ", "ኺ", "ኻ", "ኼ", "ኽ", "ኾ"],
  "ወ": ["ወ", "ዉ", "ዊ", "ዋ", "ዌ", "ው", "ዎ"],
  "ዐ": ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"],
  "ዘ": ["ዘ", "ዙ", "ዚ", "ዛ", "ዜ", "ዝ", "ዞ"],
  "ዠ": ["ዠ", "ዡ", "ዢ", "ዣ", "ዤ", "ዥ", "ዦ"],
  "የ": ["የ", "ዩ", "ዪ", "ያ", "ዬ", "ይ", "ዮ"],
  "ደ": ["ደ", "ዱ", "ዲ", "ዳ", "ዴ", "ድ", "ዶ"],
  "ጀ": ["ጀ", "ጁ", "ጂ", "ጃ", "ጄ", "ጅ", "ጆ"],
  "ገ": ["ገ", "ጉ", "ጊ", "ጋ", "ጌ", "ግ", "ጎ"],
  "ጠ": ["ጠ", "ጡ", "ጢ", "ጣ", "ጤ", "ጥ", "ጦ"],
  "ጨ": ["ጨ", "ጩ", "ጪ", "ጫ", "ጬ", "ጭ", "ጮ"],
  "ጰ": ["ጰ", "ጱ", "ጲ", "ጳ", "ጴ", "ጵ", "ጶ"],
  "ጸ": ["ጸ", "ጹ", "ጺ", "ጻ", "ጼ", "ጽ", "ጾ"],
  "ፀ": ["ፀ", "ፁ", "ፂ", "ፃ", "ፄ", "ፅ", "ፆ"],
  "ፈ": ["ፈ", "ፉ", "ፊ", "ፋ", "ፌ", "ፍ", "ፎ"],
  "ፐ": ["ፐ", "ፑ", "ፒ", "ፓ", "ፔ", "ፕ", "ፖ"]
};

function getVowelInfo(char) {
  for (const [base, forms] of Object.entries(vowelMap)) {
    const idx = forms.indexOf(char);
    if (idx !== -1) return { base, index: idx };
  }
  return null;
}

function decomposeWord(word) {
  return word.split("").map(char => getVowelInfo(char));
}

function applyRule(word, rule) {
  const letters = word.split("");
  const decomposed = decomposeWord(word);

  // Check if the word matches the rule conditions
  if (decomposed.some(info => !info) || 
      decomposed.length !== rule.conditions.length ||
      decomposed[0]?.index !== rule.conditions.firstVowelIndex) {
    return null;
  }

  const derived = {};

  for (const form of [
    "pastTense", 
    "futureTense", 
    "infinitivePurposeConstruction", 
    "jussive",
    "infinitiveOrGerund",
    "converb",
    "descriptiveNounSingleMen",
    "descriptiveNounPluralMen",
    "descriptiveNounSingleWoman",
    "descriptiveNounPluralWoman",
    "nominalAdjectiveSingleMen",
    "nominalAdjectivePluralMen",
    "nominalAdjectiveSingleWoman",
    "nominalAdjectivePluralWoman"
  ]) {
    // Get the transformation rules for this form
    const { prefix = "", suffix = "", vowelChange = null } = rule[form] || {};
    
    // Create copies of the letters and decomposed info
    let newLetters = [...letters];
    let newDecomposed = [...decomposed];

    // Apply vowel changes if any
    if (vowelChange) {
      const changes = Array.isArray(vowelChange) ? vowelChange : [vowelChange];
      
      // Apply each vowel change
      changes.forEach(change => {
        if (change.index >= 0 && change.index < newDecomposed.length) {
          const info = newDecomposed[change.index];
          if (info && vowelMap[info.base] && 
              change.toVowel >= 0 && 
              change.toVowel < vowelMap[info.base].length) {
            newLetters[change.index] = vowelMap[info.base][change.toVowel];
          }
        }
      });
    }

    // Apply any deletions
    const deleteIndexes = (rule[form] && rule[form].delete) || [];
    if (deleteIndexes.length > 0) {
      deleteIndexes
        .sort((a, b) => b - a) // Sort in descending order to delete from end to start
        .forEach(index => {
          if (index >= 0 && index < newLetters.length) {
            newLetters.splice(index, 1);
          }
        });
    }

    // Construct the derived word
    const derivedWord = `${prefix}${newLetters.join("")}${suffix}`;
    if (derivedWord) {
      derived[form] = derivedWord;
    }
  }

  return Object.keys(derived).length > 0 ? derived : null;
}

function loadAllRules() {
  const ruleDir = path.join(__dirname, "rules");
  const ruleFiles = fs.readdirSync(ruleDir);
  const rules = {};

  ruleFiles.forEach(file => {
    const rule = JSON.parse(fs.readFileSync(path.join(ruleDir, file), "utf-8"));
    if (rule.id) rules[rule.id] = rule;
  });

  return rules;
}

function deriveWord(word, ruleId = null) {
  const rules = loadAllRules();

  if (ruleId) {
    const rule = rules[ruleId];
    if (rule) {
      const derived = applyRule(word, rule);
      return derived || null;
    } else {
      return null;
    }
  }

  for (const id in rules) {
    const derived = applyRule(word, rules[id]);
    if (derived) return derived;
  }

  return null;
}

module.exports = { deriveWord };