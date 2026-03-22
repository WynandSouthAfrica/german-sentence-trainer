export const SPELLING_RULES = [
  // Umlaut mistakes
  { wrong: "schones", correct: "schönes", type: "umlaut" },
  { wrong: "schone", correct: "schöne", type: "umlaut" },
  { wrong: "schoner", correct: "schöner", type: "umlaut" },
  { wrong: "grun", correct: "grün", type: "umlaut" },
  { wrong: "fur", correct: "für", type: "umlaut" },
  { wrong: "uber", correct: "über", type: "umlaut" },
  { wrong: "nervus", correct: "nervös", type: "umlaut" },

  // Common spelling mistakes
  { wrong: "detusch", correct: "deutsch", type: "spelling" },
  { wrong: "deustch", correct: "deutsch", type: "spelling" },
  { wrong: "deutch", correct: "deutsch", type: "spelling" },
  { wrong: "ricthig", correct: "richtig", type: "spelling" },
  { wrong: "serh", correct: "sehr", type: "spelling" },
  { wrong: "wieter", correct: "weiter", type: "spelling" },
  { wrong: "frua", correct: "frau", type: "spelling" },

  // Case-sensitive preferred forms
  { wrong: "Deutsch", correct: "Deutsch", type: "preferred" },
  { wrong: "deutsch", correct: "Deutsch", type: "capitalizationWhenNoun" },
  { wrong: "Frau", correct: "Frau", type: "preferred" },
  { wrong: "frau", correct: "Frau", type: "capitalizationWhenNoun" }
];
