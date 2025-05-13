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

  for (const form of ["pastTense", "futureTense", "infinitivePurposeConstruction", "jussive"]) {
    const { prefix, suffix, vowelChange } = rule[form];
    let newLetters = [...letters];
    let newDecomposed = [...decomposed];
/*
    if (vowelChange) {
      const change = decomposed[vowelChange.index];
      if (change) {
        const newChar = vowelMap[change.base]?.[vowelChange.toVowel];
        if (newChar) newLetters[vowelChange.index] = newChar;
      }
    }
*/
    if (vowelChange) {
      const changes = Array.isArray(vowelChange) ? vowelChange : [vowelChange];
      changes.forEach(change => {
        const info = newDecomposed[change.index];
        if (info && vowelMap[info.base]) {
          newLetters[change.index] = vowelMap[info.base][change.toVowel];
        }
      });
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
deriveWord("ቀተለ"); // rule 1
deriveWord("ቀደሰ"); // rule 2
deriveWord("ተንበለ"); // rule 3
deriveWord("ባረከ"); // rule 4
deriveWord("ሄደ");  // no match
