// derivation_engine.js

const fs = require("fs");
const path = require("path");

// A simplified vowel map (index is the vowel form)
const vowelMap = {
"ሀ" : ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"] , 
"ለ" : ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"] , 
"ሐ" : ["ሐ", "ሑ", "ሒ","ሓ","ሔ","ሕ","ሖ"] , 
"መ" :["መ","ሙ","ሚ","ማ","ሜ","ም","ሞ"],
"ሠ" :["ሠ","ሡ","ሢ","ሣ","ሤ","ሥ","ሦ"] ,
"ረ" : ["ረ", "ሩ", "ሪ", "ራ", "ሬ", "ር", "ሮ"] , 
"ሰ" : ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"] , 
"ሸ" : ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"] , 
"ቀ" : ["ቀ", "ቁ", "ቂ", "ቃ", "ቄ", "ቅ", "ቆ"]  , 
"በ" : ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"] , 
"ተ" : ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"] , 
"ቸ" : ["ቸ", "ቹ", "ቺ", "ቻ", "ቼ", "ች", "ቾ"] , 
"ኀ" : ["ኀ", "ኁ", "ኂ", "ኃ", "ኄ", "ኅ", "ኆ"] , 
"ነ" : ["ነ", "ኑ", "ኒ", "ና", "ኔ", "ን", "ኖ"] , 
"ኘ" : ["ኘ", "ኙ", "ኚ", "ኛ", "ኜ", "ኝ", "ኞ"] , 
"አ" : ["አ", "ኡ", "ኢ", "ኣ", "ኤ", "እ", "ኦ"] , 
"ከ" : ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"] , 
"ኸ" :["ኸ","ኹ","ኺ","ኻ","ኼ","ኽ","ኾ"] ,
"ወ" : ["ወ", "ዉ", "ዊ", "ዋ","ዌ","ው","ዎ"] ,
"ዐ" : ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"] ,
"ዘ" : ["ዘ", "ዙ", "ዚ", "ዛ", "ዜ", "ዝ", "ዞ"] ,
"ዠ" : ["ዠ", "ዡ","ዢ","ዣ","ዤ","ዥ","ዦ"] ,
"የ" : ["የ", "ዩ", "ዪ", "ያ", "ዬ", "ይ", "ዮ"] ,
"ደ" : ["ደ", "ዱ", "ዲ", "ዳ", "ዴ", "ድ","ዶ"],
"ጀ" : ["ጀ", "ጁ", "ጂ", "ጃ","ጄ","ጅ","ጆ"] ,      
"ገ": ["ገ","ጉ","ጊ","ጋ","ጌ","ግ","ጎ"] ,
"ጠ" :["ጠ","ጡ","ጢ","ጣ","ጤ","ጥ","ጦ"],
"ጨ" :["ጨ","ጩ","ጪ","ጫ","ጬ","ጭ","ጮ"],
"ጰ" : ["ጰ", "ጱ", "ጲ", "ጳ", "ጴ", "ጵ", "ጶ"] ,
"ጸ" : ["ጸ", "ጹ", "ጺ", "ጻ", "ጼ", "ጽ", "ጾ"] ,
"ፀ" : ["ፀ", "ፁ", "ፂ", "ፃ", "ፄ", "ፅ", "ፆ"] ,
"ፈ" : ["ፈ", "ፉ", "ፊ", "ፋ", "ፌ", "ፍ", "ፎ"] ,
"ፐ" : ["ፐ", "ፑ", "ፒ", "ፓ", "ፔ", "ፕ", "ፖ"] , 
};

// Traverse the vowel map to identify the root and vowel index
// Inputs- A character
// Outputs- an Object with Base-Index pair
function getVowelInfo(char) {
  for (const [base, forms] of Object.entries(vowelMap)) {
    const idx = forms.indexOf(char);
    if (idx !== -1) return { base, index: idx };
  }
  return null;
}

// Decode Amharic word into base chars and vowels
// Inputs- A word
// Outputs- Objects with Base-Index pairs
function decomposeWord(word) {
  return word.split("").map(char => getVowelInfo(char));
}

// Apply rule to word
function applyRule(word, rule) {
  const letters = word.split(""); //An Array of the characters
  const decomposed = decomposeWord(word); //Objects with pair values

  // Match condition
  if (
    decomposed.length !== rule.conditions.length ||
    decomposed[0]?.index !== rule.conditions.firstVowelIndex
  ) {
    return null; // rule doesn't match
  }

  const derived = {};

  for (const form of ["pastTense", "futureTense", "infinitivePurposeConstruction", "jussive","infinitiveOrGerund"]) {
    const { prefix, suffix, vowelChange } = rule[form];
    let newLetters = [...letters];
    let newDecomposed = [...decomposed];

    if (vowelChange) {
      const changes = Array.isArray(vowelChange) ? vowelChange : [vowelChange];
      changes.forEach(change => {
        const info = newDecomposed[change.index];
        if (info && vowelMap[info.base]) {
          newLetters[change.index] = vowelMap[info.base][change.toVowel];
        }
      });
    }

    // Delete character(s) if any
    const deleteIndexes = rule[form].delete || [];
    deleteIndexes.sort((a, b) => b - a);
    deleteIndexes.forEach(index => {
      if (index >= 0 && index < newLetters.length) {
        newLetters.splice(index, 1);
      }
    });

    derived[form] = `${prefix || ""}${newLetters.join("")}${suffix || ""}`;
  }

  return derived;
}

// Load all rule JSONs
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

// Test
function deriveWord(word, ruleId = null) {
  const rules = loadAllRules();

  if (ruleId) {
    const rule = rules[ruleId];
    if (rule) {
      const derived = applyRule(word, rule);
      if (derived) {
        console.log(`✅ Word "${word}" derived using rule ID ${ruleId}`);
        console.table(derived);
        return;
      } else {
        console.log(`❌ Rule ID ${ruleId} does not match "${word}"`);
        return;
      }
    } else {
      console.log(`❌ Rule ID ${ruleId} not found.`);
      return;
    }
  }

  // Fallback: auto-match
  for (const id in rules) {
    const derived = applyRule(word, rules[id]);
    if (derived) {
      console.log(`✅ Word "${word}" auto-matched with rule ID ${id}`);
      console.table(derived);
      return;
    }
  }

  console.log(`❌ No matching rule found for "${word}"`);
}

// Example Tests
deriveWord("ቀተለ",1); // rule 1
deriveWord("ቀደሰ",2); // rule 2
deriveWord("ተንበለ",3); // rule 3
deriveWord("ባረከ",4); // rule 4
deriveWord("ማህረከ",5); // rule 5
deriveWord("ሴሰየ",6); // rule 6
deriveWord("ክህለ",7); // rule 7
deriveWord("ጦመረ",8); // rule 8
deriveWord("ሄደ",1);  // no match