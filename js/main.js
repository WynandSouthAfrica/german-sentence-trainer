console.log("MAIN JS LOADED");

import { VERBS } from "../data/verb_list.js";
import { NOUNS } from "../data/noun_list.js";
import { SPELLING_RULES } from "./spelling_rules.js";
import { ARTICLE_RULES, ALL_SUPPORTED_ARTICLES } from "./article_rules.js";
import { ADJECTIVE_ENDINGS } from "./adjective_rules.js";
import {
  CASE_ARTICLES,
  SUBJECT_PRONOUNS,
  TIME_WORDS,
  PREPOSITIONS
} from "./rules.js";

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

function isLikelyNounToken(word) {
  return Boolean(word) && (Boolean(findNoun(word)) || isCapitalized(word));
}

function isArticle(word) {
  return Boolean(word) && ALL_SUPPORTED_ARTICLES.includes(lower(word));
}

function classifyArticleCase(articleWord, noun) {
  const article = lower(articleWord);
  if (!article || !noun) return null;

  if (article === "dem") return "dativ";
  if (article === "das") return "akkusativ";
  if (article === "die") return "akkusativ";
  if (article === "den") {
    return noun.gender === "plural" ? "dativ" : "akkusativ";
  }
  if (article === "der") {
    return noun.gender === "feminine" || noun.gender === "plural" ? "dativ" : "nominativ";
  }

  return null;
}

function buildBareNounPhrase(tokens, nounIndex) {
  const nounWord = normalize(tokens[nounIndex]);
  if (!nounWord) return null;

  return {
    text: nounWord,
    start: nounIndex,
    end: nounIndex,
    nounIndex,
    nounWord,
    articleWord: null,
    adjectiveWord: null,
    noun: findNoun(nounWord),
    hasArticle: false,
    articleCase: null,
    isBare: true
  };
}

function buildArticleNounPhrase(tokens, articleIndex, nounIndex, adjectiveIndex = null) {
  const articleWord = normalize(tokens[articleIndex]);
  const nounWord = normalize(tokens[nounIndex]);
  const noun = findNoun(nounWord) || { word: nounWord, gender: null };

  if (!articleWord || !nounWord) return null;

  const parts = [articleWord];
  let end = nounIndex;
  let adjectiveWord = null;

  if (adjectiveIndex !== null) {
    adjectiveWord = normalize(tokens[adjectiveIndex]);
    parts.push(adjectiveWord);
    end = nounIndex;
  }

  parts.push(nounWord);

  return {
    text: parts.join(" "),
    start: articleIndex,
    end,
    nounIndex,
    nounWord,
    articleWord,
    adjectiveWord,
    noun,
    hasArticle: true,
    articleCase: classifyArticleCase(articleWord, noun),
    isBare: false
  };
}

function detectNounPhraseAt(tokens, index) {
  const current = tokens[index];
  const next = tokens[index + 1];
  const third = tokens[index + 2];

  if (isArticle(current) && next && third && isLikelyNounToken(third)) {
    return buildArticleNounPhrase(tokens, index, index + 2, index + 1);
  }

  if (isArticle(current) && next && isLikelyNounToken(next)) {
    return buildArticleNounPhrase(tokens, index, index + 1);
  }

  if (findNoun(current)) {
    return buildBareNounPhrase(tokens, index);
  }

  if (!findNoun(current) && isLikelyBareObject(current)) {
    return buildBareNounPhrase(tokens, index);
  }

  return null;
}

function markPhraseIndexes(usedIndexes, phrase) {
  for (let i = phrase.start; i <= phrase.end; i += 1) {
    usedIndexes.add(i);
  }
}

function validatePhraseForCase(result, phrase, expectedCase) {
  if (!phrase || !phrase.hasArticle) return;

  validateArticleForCase(result, phrase.articleWord, phrase.nounWord, expectedCase);

  if (phrase.adjectiveWord) {
    validateAdjectiveEnding(
      result,
      phrase.articleWord,
      phrase.adjectiveWord,
      phrase.nounWord,
      expectedCase
    );
  }
}

function assignPhraseToRole(result, phrase, role, expectedCase = null) {
  if (!phrase || !role || result[role]) return false;

  result[role] = phrase.text;

  if (expectedCase) {
    validatePhraseForCase(result, phrase, expectedCase);
  }

  return true;
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

function findSubjectPhrase(tokens, usedIndexes, boundaryIndex = tokens.length) {
  for (let i = 0; i < boundaryIndex; i += 1) {
    if (usedIndexes.has(i)) continue;

    const phrase = detectNounPhraseAt(tokens, i);
    if (!phrase) continue;
    if (phrase.end >= boundaryIndex) continue;

    return phrase;
  }

  return null;
}

function collectRemainingNounPhrases(tokens, usedIndexes) {
  const phrases = [];

  for (let i = 0; i < tokens.length; i += 1) {
    if (usedIndexes.has(i)) continue;

    const phrase = detectNounPhraseAt(tokens, i);
    if (!phrase) continue;

    phrases.push(phrase);
    i = phrase.end;
  }

  return phrases;
}

function assignByCasePattern(result, phrases, activeCasePattern) {
  const ambiguous = [];

  for (const phrase of phrases) {
    if (activeCasePattern === "dativ") {
      if (assignPhraseToRole(result, phrase, "dativeBlock", "dativ")) continue;
      continue;
    }

    if (activeCasePattern === "akkusativ") {
      if (assignPhraseToRole(result, phrase, "object", "akkusativ")) continue;
      continue;
    }

    if (activeCasePattern === "dativ+akkusativ") {
      if (phrase.articleCase === "dativ" && assignPhraseToRole(result, phrase, "dativeBlock", "dativ")) {
        continue;
      }

      if (phrase.articleCase === "akkusativ" && assignPhraseToRole(result, phrase, "object", "akkusativ")) {
        continue;
      }

      ambiguous.push(phrase);
      continue;
    }

    ambiguous.push(phrase);
  }

  if (activeCasePattern === "dativ+akkusativ") {
    for (const phrase of ambiguous) {
      if (!result.dativeBlock) {
        assignPhraseToRole(result, phrase, "dativeBlock", "dativ");
        continue;
      }

      if (!result.object) {
        assignPhraseToRole(result, phrase, "object", "akkusativ");
      }
    }

    return;
  }

  if (activeCasePattern === "akkusativ") {
    for (const phrase of ambiguous) {
      if (!result.object) {
        assignPhraseToRole(result, phrase, "object", "akkusativ");
      }
    }
    return;
  }

  if (activeCasePattern === "dativ") {
    for (const phrase of ambiguous) {
      if (!result.dativeBlock) {
        assignPhraseToRole(result, phrase, "dativeBlock", "dativ");
      }
    }
  }
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

  const usedIndexes = new Set();
  let mainVerbIndex = -1;

  // PASS 1: main verb, subject pronoun, time
  for (let i = 0; i < tokens.length; i += 1) {
    const raw = tokens[i];

    if (!result.subject && isSubject(raw)) {
      result.subject = normalize(raw);
      usedIndexes.add(i);
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
        mainVerbIndex = i;
        usedIndexes.add(i);
        continue;
      }
    }

    if (isTime(raw)) {
      result.time.push(normalize(raw));
      usedIndexes.add(i);
    }
  }

  if (!result.verb) {
    addNote(result, "No known verb found.");
    return result;
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

  // PASS 4: first free noun phrase defaults to Nominativ subject
  if (!result.subject) {
    const subjectPhrase = findSubjectPhrase(tokens, usedIndexes);

    if (subjectPhrase) {
      result.subject = subjectPhrase.text;
      markPhraseIndexes(usedIndexes, subjectPhrase);
    }
  }

  // PASS 5: remaining noun phrases -> Dativ/Akkusativ roles
  const remainingPhrases = collectRemainingNounPhrases(tokens, usedIndexes);
  assignByCasePattern(result, remainingPhrases, activeCasePattern);

  // PASS 6: friendly rule notes
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

  if (result.subject) {
    addNote(result, `Subject block (Nominativ): "${result.subject}".`);
  }

  if (result.dativeBlock) {
    addNote(result, `Indirect object (Dativ): "${result.dativeBlock}".`);
  }

  if (result.object) {
    addNote(result, `Direct object (Akkusativ): "${result.object}".`);
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
