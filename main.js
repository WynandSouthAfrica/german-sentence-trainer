console.log("MAIN JS LOADED");

import { VERBS } from "../data/verb_list.js";
import { NOUNS } from "../data/noun_list.js";
import { SPELLING_RULES } from "../data/spelling_rules.js";
import { ARTICLE_RULES, ALL_SUPPORTED_ARTICLES } from "../data/article_rules.js";
import { ADJECTIVE_ENDINGS } from "../data/adjective_rules.js";
import {
  CASE_ARTICLES,
  SUBJECT_PRONOUNS,
  TIME_WORDS,
  PREPOSITIONS
} from "../data/rules.js";

// -------------------- BASIC HELPERS --------------------

function normalize(word) {
  return String(word).replace(/[.,!?;:]/g, "").trim();
}

function lower(word) {
  return normalize(word).toLowerCase();
}

function tokenize(sentence) {
  return sentence
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);
}

function addNote(result, message) {
  if (!result.notes.includes(message)) {
    result.notes.push(message);
  }
}

function addSuggestion(result, message) {
  if (!result.suggestions.includes(message)) {
    result.suggestions.push(message);
  }
}

// -------------------- VERB HELPERS --------------------

function findVerb(word) {
  const clean = lower(word);

  for (const verb of VERBS) {
    if (lower(verb.infinitive) === clean) return verb;

    for (const form of Object.values(verb.conjugation)) {
      if (lower(form) === clean) return verb;
    }
  }

  return null;
}

function findInfinitive(word) {
  const clean = lower(word);
  return VERBS.find(v => lower(v.infinitive) === clean) || null;
}

function isModal(verb) {
  return Boolean(verb && verb.type === "modal");
}

function findModalInfinitive(tokens, usedIndexes, modalIndex) {
  let bestMatch = null;

  // German modal constructions usually place the infinitive after the modal.
  for (let i = modalIndex + 1; i < tokens.length; i += 1) {
    if (usedIndexes.has(i)) continue;

    const infinitiveVerb = findInfinitive(tokens[i]);
    if (infinitiveVerb) {
      bestMatch = {
        index: i,
        verb: infinitiveVerb
      };
    }
  }

  if (bestMatch) return bestMatch;

  // Fallback: search anywhere else in case the sentence is incomplete or unusual.
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    if (usedIndexes.has(i)) continue;

    const infinitiveVerb = findInfinitive(tokens[i]);
    if (infinitiveVerb) {
      return {
        index: i,
        verb: infinitiveVerb
      };
    }
  }

  return null;
}

// -------------------- NOUN HELPERS --------------------

function findNoun(word) {
  const clean = lower(word);

  return (
    NOUNS.find(noun => {
      if (lower(noun.word) === clean) return true;

      if (Array.isArray(noun.forms)) {
        return noun.forms.some(form => lower(form) === clean);
      }

      return false;
    }) || null
  );
}

function isCapitalized(word) {
  const clean = normalize(word);
  if (!clean) return false;

  const first = clean.charAt(0);
  return first === first.toUpperCase() && first !== first.toLowerCase();
}

function isLikelyBareObject(word) {
  const clean = normalize(word);
  if (!clean) return false;

  const first = clean.charAt(0);
  return first === first.toUpperCase() && first !== first.toLowerCase();
}

// -------------------- ARTICLE HELPERS --------------------

function getExpectedArticle(gender, caseName) {
  return CASE_ARTICLES?.[caseName]?.[gender] || null;
}

function getArticleFamily(article) {
  const clean = lower(article);

  for (const [familyName, familyData] of Object.entries(ARTICLE_RULES)) {
    for (const caseName of Object.keys(familyData)) {
      const values = Object.values(familyData[caseName]);
      if (values.includes(clean)) {
        return familyName;
      }
    }
  }

  return null;
}

function getExpectedFromFamily(article, gender, caseName) {
  const family = getArticleFamily(article);
  if (!family) return null;

  return ARTICLE_RULES?.[family]?.[caseName]?.[gender] || null;
}

function getExpectedAdjectiveEnding(article, gender, caseName) {
  const family = getArticleFamily(article);
  if (!family) return null;

  return ADJECTIVE_ENDINGS?.[family]?.[caseName]?.[gender] || null;
}

function formatCaseName(caseName) {
  if (!caseName) return "";
  return caseName.charAt(0).toUpperCase() + caseName.slice(1);
}

function getSugarTableRow(caseName) {
  const row = ARTICLE_RULES?.definite?.[caseName];
  if (!row) return null;

  const parts = [
    `der=${row.masculine}`,
    `die=${row.feminine}`,
    `das=${row.neuter}`
  ];

  if (row.plural) {
    parts.push(`Plural=${row.plural}`);
  }

  return `${formatCaseName(caseName)} row: ${parts.join(", ")}.`;
}

function getFamilyLabel(family) {
  if (family === "definite") return "definite article";
  if (family === "indefinite") return "ein-word";
  if (family === "mein") return "mein-word";
  return family;
}

function buildAdjectiveCorrection(adjectiveWord, expectedEnding) {
  const clean = normalize(adjectiveWord);
  if (!clean) return clean;

  const lowerClean = clean.toLowerCase();
  const knownEndings = ["en", "er", "es", "e"];
  const matchedEnding = knownEndings.find(ending => lowerClean.endsWith(ending));

  if (!matchedEnding) {
    return `${clean}${expectedEnding}`;
  }

  return `${clean.slice(0, clean.length - matchedEnding.length)}${expectedEnding}`;
}

function buildCorrectAdjectivePhrase(articleWord, adjectiveWord, noun, nounWord, expectedCase) {
  const expectedArticle =
    getExpectedFromFamily(articleWord, noun.gender, expectedCase) ||
    getExpectedArticle(noun.gender, expectedCase) ||
    normalize(articleWord);

  const expectedEnding =
    getExpectedAdjectiveEnding(expectedArticle, noun.gender, expectedCase) ||
    getExpectedAdjectiveEnding(articleWord, noun.gender, expectedCase);

  const correctedAdjective = expectedEnding
    ? buildAdjectiveCorrection(adjectiveWord, expectedEnding)
    : normalize(adjectiveWord);

  const correctedNoun = noun.word || normalize(nounWord);

  return `${expectedArticle} ${correctedAdjective} ${correctedNoun}`;
}

function explainAdjectiveEnding(articleWord, family, noun, expectedCase, expectedEnding) {
  const sugarRow = getSugarTableRow(expectedCase);
  const article = normalize(articleWord);
  const familyLabel = getFamilyLabel(family);
  const genderLabel = noun.gender === "plural" ? "plural" : noun.gender;

  const explanation = [];

  if (sugarRow) {
    explanation.push(`Sugar Table: ${sugarRow}`);
  }

  explanation.push(
    `${formatCaseName(expectedCase)} + ${genderLabel} noun + ${article} (${familyLabel}) -> adjective ending "-${expectedEnding}".`
  );

  if (family === "definite") {
    explanation.push("The article already shows the case clearly, so the adjective usually takes the lighter weak ending.");
  }

  if (family === "indefinite" || family === "mein") {
    explanation.push("ein/mein words do not always show the full Sugar Table signal, so the adjective carries more of the case/gender ending.");
  }

  if (expectedCase === "dativ") {
    explanation.push("Sugar Table shortcut: in dative, adjective endings here are usually -en.");
  }

  if (expectedCase === "akkusativ" && noun.gender === "masculine") {
    explanation.push("Sugar Table shortcut: accusative masculine is the big change row, so the adjective ends in -en.");
  }

  return explanation;
}

// -------------------- SIMPLE DETECTORS --------------------

function isSubject(word) {
  return SUBJECT_PRONOUNS.includes(lower(word));
}

function isTime(word) {
  return TIME_WORDS.includes(lower(word));
}

function getPrep(word) {
  const clean = lower(word);

  if (PREPOSITIONS.dativ.includes(clean)) return "dativ";
  if (PREPOSITIONS.akkusativ.includes(clean)) return "akkusativ";
  if (PREPOSITIONS.wechsel.includes(clean)) return "wechsel";

  return null;
}

// -------------------- SPELLING + CAPITALIZATION --------------------

function findSpellingRule(word) {
  const clean = lower(word);
  return SPELLING_RULES.find(rule => rule.wrong.toLowerCase() === clean) || null;
}

function checkSpelling(tokens, result) {
  for (const token of tokens) {
    const clean = normalize(token);
    if (!clean) continue;

    const rule = findSpellingRule(clean);
    if (!rule) continue;
    if (rule.type === "preferred") continue;

    addNote(result, `Possible spelling issue: "${clean}".`);
    addSuggestion(result, `Try: "${rule.correct}".`);
  }
}

function checkNounCapitalization(tokens, result) {
  for (let i = 0; i < tokens.length - 1; i += 1) {
    const article = lower(tokens[i]);
    const nextWord = normalize(tokens[i + 1]);
    const noun = findNoun(nextWord);

    if (!noun) continue;
    if (!ALL_SUPPORTED_ARTICLES.includes(article)) continue;

    if (!isCapitalized(tokens[i + 1])) {
      addNote(result, `Noun should be capitalized: "${nextWord}".`);
      addSuggestion(result, `Write: "${noun.article} ${noun.word}".`);
    }
  }
}

// -------------------- VALIDATION --------------------

function validateArticleForCase(result, articleWord, nounWord, expectedCase) {
  const noun = findNoun(nounWord);
  if (!noun) return;

  const actualArticle = lower(articleWord);

  const expectedArticle =
    getExpectedFromFamily(articleWord, noun.gender, expectedCase) ||
    getExpectedArticle(noun.gender, expectedCase);

  if (!expectedArticle) return;

  if (actualArticle !== expectedArticle) {
    addNote(
      result,
      `Wrong article-case combination: "${normalize(articleWord)} ${normalize(nounWord)}".`
    );
    addSuggestion(
      result,
      `Expected ${expectedCase}: "${expectedArticle} ${normalize(nounWord)}".`
    );
  }
}

function validateAdjectiveEnding(result, articleWord, adjectiveWord, nounWord, expectedCase) {
  const noun = findNoun(nounWord);
  if (!noun) return;

  const family = getArticleFamily(articleWord);
  if (!family) return;

  const expectedEnding = getExpectedAdjectiveEnding(articleWord, noun.gender, expectedCase);
  if (!expectedEnding) return;

  const adjective = lower(adjectiveWord);

  if (!adjective.endsWith(expectedEnding)) {
    addNote(
      result,
      `Adjective ending issue: "${normalize(articleWord)} ${normalize(adjectiveWord)} ${normalize(nounWord)}".`
    );

    for (const message of explainAdjectiveEnding(
      articleWord,
      family,
      noun,
      expectedCase,
      expectedEnding
    )) {
      addSuggestion(result, message);
    }

    addSuggestion(
      result,
      `Try: "${buildCorrectAdjectivePhrase(articleWord, adjectiveWord, noun, nounWord, expectedCase)}".`
    );
  }
}

// -------------------- SPECIAL PHRASES --------------------

function detectSpecialPhrase(tokens, index) {
  const current = lower(tokens[index]);
  const next = lower(tokens[index + 1] || "");

  if (current === "zu" && next === "hause") {
    return {
      text: `${tokens[index]} ${tokens[index + 1]}`,
      blockType: "place",
      caseType: "dativ",
      endIndex: index + 1
    };
  }

  return null;
}

function expectedCaseFromVerbPattern(casePattern, prep) {
  if (casePattern === "an+akkusativ" && prep === "an") return "akkusativ";
  if (casePattern === "auf+akkusativ" && prep === "auf") return "akkusativ";
  if (casePattern === "mit+dativ" && prep === "mit") return "dativ";
  return null;
}

// -------------------- PREPOSITION DETECTION --------------------

function detectPrepositionalPhrase(tokens, index, activeCasePattern, result) {
  const special = detectSpecialPhrase(tokens, index);
  if (special) return special;

  const prep = lower(tokens[index]);
  const prepType = getPrep(prep);

  if (!prepType) return null;

  const article = tokens[index + 1];
  const maybeAdjective = tokens[index + 2];
  const maybeNoun = tokens[index + 3];
  const nounAfterArticle = tokens[index + 2];

  // prep + article + adjective + noun
  if (article && maybeAdjective && maybeNoun && findNoun(maybeNoun)) {
    const phrase = `${tokens[index]} ${article} ${maybeAdjective} ${maybeNoun}`;

    let blockType = "preposition";
    let resolvedCase = prepType;

    if (prep === "mit") {
      blockType = "preposition";
      resolvedCase = "dativ";
    } else if (activeCasePattern === "an+akkusativ" && prep === "an") {
      blockType = "preposition";
      resolvedCase = "akkusativ";
    } else if (activeCasePattern === "auf+akkusativ" && prep === "auf") {
      blockType = "preposition";
      resolvedCase = "akkusativ";
    } else if (prepType === "wechsel") {
      blockType = "place";
      resolvedCase = "wechsel";
    } else {
      blockType = "place";
    }

    const verbDrivenCase = expectedCaseFromVerbPattern(activeCasePattern, prep);
    if (verbDrivenCase) {
      validateArticleForCase(result, article, maybeNoun, verbDrivenCase);
      validateAdjectiveEnding(result, article, maybeAdjective, maybeNoun, verbDrivenCase);
    }

    return {
      text: phrase,
      preposition: prep,
      caseType: resolvedCase,
      blockType,
      endIndex: index + 3
    };
  }

  // prep + article + noun
  if (article && nounAfterArticle) {
    const phrase = `${tokens[index]} ${article} ${nounAfterArticle}`;

    let blockType = "preposition";
    let resolvedCase = prepType;

    if (prep === "mit") {
      blockType = "preposition";
      resolvedCase = "dativ";
    } else if (activeCasePattern === "an+akkusativ" && prep === "an") {
      blockType = "preposition";
      resolvedCase = "akkusativ";
    } else if (activeCasePattern === "auf+akkusativ" && prep === "auf") {
      blockType = "preposition";
      resolvedCase = "akkusativ";
    } else if (prepType === "wechsel") {
      blockType = "place";
      resolvedCase = "wechsel";
    } else {
      blockType = "place";
    }

    const verbDrivenCase = expectedCaseFromVerbPattern(activeCasePattern, prep);
    if (verbDrivenCase) {
      validateArticleForCase(result, article, nounAfterArticle, verbDrivenCase);
    }

    return {
      text: phrase,
      preposition: prep,
      caseType: resolvedCase,
      blockType,
      endIndex: index + 2
    };
  }

  return {
    text: tokens[index],
    preposition: prep,
    caseType: prepType,
    blockType: "preposition",
    endIndex: index
  };
}

// -------------------- MAIN ANALYZER --------------------

function analyzeSentence(sentence) {
  const tokens = tokenize(sentence);

  const result = {
    sentence,
    subject: null,
    verb: null,
    verb2: null,
    time: [],
    object: null,
    dativeBlock: null,
    prepositionBlock: null,
    placeBlock: null,
    manner: [],
    notes: [],
    suggestions: []
  };

  // Pre-checks
  checkSpelling(tokens, result);
  checkNounCapitalization(tokens, result);

  // PASS 1: subject, main verb, time
  for (let i = 0; i < tokens.length; i += 1) {
    const raw = tokens[i];

    if (!result.subject && isSubject(raw)) {
      result.subject = normalize(raw);
      continue;
    }

    if (!result.verb) {
      const verb = findVerb(raw);
      if (verb) {
        result.verb = {
          found: normalize(raw),
          infinitive: verb.infinitive,
          casePattern: verb.casePattern,
          type: verb.type
        };
        continue;
      }
    }

    if (isTime(raw)) {
      result.time.push(normalize(raw));
    }
  }

  if (!result.verb) {
    addNote(result, "No known verb found.");
    return result;
  }

  const usedIndexes = new Set();
  let mainVerbIndex = -1;

  // mark subject
  for (let i = 0; i < tokens.length; i += 1) {
    if (result.subject && lower(tokens[i]) === lower(result.subject)) {
      usedIndexes.add(i);
      break;
    }
  }

  // mark main verb
  for (let i = 0; i < tokens.length; i += 1) {
    if (lower(tokens[i]) === lower(result.verb.found) && !usedIndexes.has(i)) {
      usedIndexes.add(i);
      mainVerbIndex = i;
      break;
    }
  }

  // mark time
  for (let i = 0; i < tokens.length; i += 1) {
    if (isTime(tokens[i])) {
      usedIndexes.add(i);
    }
  }

  let activeCasePattern = result.verb.casePattern;

  // PASS 2: modal verb -> detect infinitive and use its pattern
  if (isModal(result.verb) && mainVerbIndex >= 0) {
    const modalInfinitive = findModalInfinitive(tokens, usedIndexes, mainVerbIndex);

    if (modalInfinitive) {
      result.verb2 = normalize(tokens[modalInfinitive.index]);
      usedIndexes.add(modalInfinitive.index);
      activeCasePattern = modalInfinitive.verb.casePattern;
    }
  }

  // PASS 3: prepositions
  for (let i = 0; i < tokens.length; i += 1) {
    if (usedIndexes.has(i)) continue;

    const prepInfo = detectPrepositionalPhrase(tokens, i, activeCasePattern, result);
    if (!prepInfo) continue;

    if (prepInfo.blockType === "preposition" && !result.prepositionBlock) {
      result.prepositionBlock = prepInfo.text;
    } else if (prepInfo.blockType === "place" && !result.placeBlock) {
      result.placeBlock = prepInfo.text;
    }

    for (let j = i; j <= prepInfo.endIndex; j += 1) {
      usedIndexes.add(j);
    }

    i = prepInfo.endIndex;
  }

  // PASS 4: noun phrases and adjective+noun phrases
  for (let i = 0; i < tokens.length; i += 1) {
    if (usedIndexes.has(i)) continue;

    const prev = i > 0 ? tokens[i - 1] : null;
    const current = tokens[i];
    const next = i + 1 < tokens.length ? tokens[i + 1] : null;

    // article + adjective + noun
    if (prev && next && findNoun(next) && ALL_SUPPORTED_ARTICLES.includes(lower(prev))) {
      const phrase = `${normalize(prev)} ${normalize(current)} ${normalize(next)}`;
      const noun = findNoun(next);

      if (activeCasePattern === "dativ") {
        if (!result.dativeBlock) {
          result.dativeBlock = phrase;
          validateArticleForCase(result, prev, next, "dativ");
          validateAdjectiveEnding(result, prev, current, next, "dativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
        }
        continue;
      }

      if (activeCasePattern === "akkusativ") {
        if (!result.object) {
          result.object = phrase;
          validateArticleForCase(result, prev, next, "akkusativ");
          validateAdjectiveEnding(result, prev, current, next, "akkusativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
        }
        continue;
      }

      if (activeCasePattern === "dativ+akkusativ") {
        const actualArticle = lower(prev);
        const expectedDativ =
          getExpectedFromFamily(prev, noun.gender, "dativ") ||
          getExpectedArticle(noun.gender, "dativ");

        const expectedAkk =
          getExpectedFromFamily(prev, noun.gender, "akkusativ") ||
          getExpectedArticle(noun.gender, "akkusativ");

        // 1. lock Dativ first
        if (!result.dativeBlock && actualArticle === expectedDativ) {
          result.dativeBlock = phrase;
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
          continue;
        }

        // 2. then Akkusativ
        if (!result.object && actualArticle === expectedAkk) {
          result.object = phrase;
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
          continue;
        }

        // 3. fallback
        if (!result.dativeBlock) {
          result.dativeBlock = phrase;
          validateArticleForCase(result, prev, next, "dativ");
          validateAdjectiveEnding(result, prev, current, next, "dativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
          continue;
        }

        if (!result.object) {
          result.object = phrase;
          validateArticleForCase(result, prev, next, "akkusativ");
          validateAdjectiveEnding(result, prev, current, next, "akkusativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          usedIndexes.add(i + 1);
          continue;
        }
      }
    }

    // article + noun
    const noun = findNoun(current);

    if (noun && prev) {
      const phrase = `${normalize(prev)} ${normalize(current)}`;

      if (activeCasePattern === "dativ") {
        if (!result.dativeBlock) {
          result.dativeBlock = phrase;
          validateArticleForCase(result, prev, current, "dativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
        }
        continue;
      }

      if (activeCasePattern === "akkusativ") {
        if (!result.object) {
          result.object = phrase;
          validateArticleForCase(result, prev, current, "akkusativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
        }
        continue;
      }

      if (activeCasePattern === "dativ+akkusativ") {
        const actualArticle = lower(prev);
        const expectedDativ =
          getExpectedFromFamily(prev, noun.gender, "dativ") ||
          getExpectedArticle(noun.gender, "dativ");

        const expectedAkk =
          getExpectedFromFamily(prev, noun.gender, "akkusativ") ||
          getExpectedArticle(noun.gender, "akkusativ");

        // 1. lock Dativ first
        if (!result.dativeBlock && actualArticle === expectedDativ) {
          result.dativeBlock = phrase;
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          continue;
        }

        // 2. then Akkusativ
        if (!result.object && actualArticle === expectedAkk) {
          result.object = phrase;
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          continue;
        }

        // 3. fallback
        if (!result.dativeBlock) {
          result.dativeBlock = phrase;
          validateArticleForCase(result, prev, current, "dativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          continue;
        }

        if (!result.object) {
          result.object = phrase;
          validateArticleForCase(result, prev, current, "akkusativ");
          usedIndexes.add(i - 1);
          usedIndexes.add(i);
          continue;
        }
      }
    }

    // bare noun object
    if (!noun && isLikelyBareObject(current)) {
      if ((activeCasePattern === "akkusativ" || activeCasePattern === "dativ+akkusativ") && !result.object) {
        result.object = normalize(current);
        usedIndexes.add(i);
      }
    }
  }

  // PASS 5: friendly rule notes
  if (activeCasePattern === "mit+dativ" && result.prepositionBlock) {
    addNote(result, 'Verb rule: "mit + Dativ".');
  }

  if (activeCasePattern === "an+akkusativ" && result.prepositionBlock) {
    addNote(result, 'Verb rule: "an + Akkusativ".');
  }

  if (activeCasePattern === "auf+akkusativ" && result.prepositionBlock) {
    addNote(result, 'Verb rule: "auf + Akkusativ".');
  }

  if (activeCasePattern === "movement" && result.placeBlock) {
    addNote(result, "Movement pattern detected: destination block.");
  }

  if (result.verb2) {
    addNote(result, `Verb 2 / Infinitiv detected: "${result.verb2}".`);
  }

  return result;
}

// -------------------- TESTS --------------------

function testSystem() {
  const testSentences = [
    "Ich sehe ein schönes Buch.",
    "Ich sehe einen guten Mann.",
    "Ich helfe meiner netten Frau.",
    "Ich gebe meinem Jungen das schöne Buch.",
    "Ich helfe meine nette Frau."
  ];

  console.log("=== TEST START ===");
  for (const sentence of testSentences) {
    console.log(analyzeSentence(sentence));
  }
  console.log("=== TEST END ===");
}

testSystem();

export { analyzeSentence };
