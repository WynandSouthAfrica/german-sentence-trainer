export const VERBS = [
  {
    infinitive: "sein",
    meaning: "to be",
    type: "irregular",
    casePattern: "none",
    conjugation: {
      ich: "bin",
      du: "bist",
      er: "ist",
      sie: "ist",
      es: "ist",
      wir: "sind",
      ihr: "seid",
      Sie: "sind"
    },
    perfekt: "ist gewesen",
    prateritum: "war",
    examples: [
      "Ich bin in der Küche.",
      "Wir sind zu Hause."
    ]
  },
  {
    infinitive: "haben",
    meaning: "to have",
    type: "irregular",
    casePattern: "akkusativ",
    conjugation: {
      ich: "habe",
      du: "hast",
      er: "hat",
      sie: "hat",
      es: "hat",
      wir: "haben",
      ihr: "habt",
      Sie: "haben"
    },
    perfekt: "hat gehabt",
    prateritum: "hatte",
    examples: [
      "Ich habe das Buch.",
      "Ich habe eine Idee."
    ]
  },
  {
    infinitive: "werden",
    meaning: "to become",
    type: "irregular",
    casePattern: "none",
    conjugation: {
      ich: "werde",
      du: "wirst",
      er: "wird",
      sie: "wird",
      es: "wird",
      wir: "werden",
      ihr: "werdet",
      Sie: "werden"
    },
    perfekt: "ist geworden",
    prateritum: "wurde",
    examples: [
      "Ich werde müde.",
      "Er wird Mechaniker."
    ]
  },
  {
    infinitive: "lernen",
    meaning: "to learn",
    type: "weak",
    casePattern: "akkusativ",
    conjugation: {
      ich: "lerne",
      du: "lernst",
      er: "lernt",
      sie: "lernt",
      es: "lernt",
      wir: "lernen",
      ihr: "lernt",
      Sie: "lernen"
    },
    perfekt: "hat gelernt",
    prateritum: "lernte",
    examples: [
      "Ich lerne Deutsch.",
      "Ich lerne jeden Tag Deutsch."
    ]
  },
  {
    infinitive: "arbeiten",
    meaning: "to work",
    type: "weak",
    casePattern: "mit+dativ",
    conjugation: {
      ich: "arbeite",
      du: "arbeitest",
      er: "arbeitet",
      sie: "arbeitet",
      es: "arbeitet",
      wir: "arbeiten",
      ihr: "arbeitet",
      Sie: "arbeiten"
    },
    perfekt: "hat gearbeitet",
    prateritum: "arbeitete",
    examples: [
      "Ich arbeite mit dem Team.",
      "Ich arbeite mit der Maschine."
    ]
  },
  {
    infinitive: "geben",
    meaning: "to give",
    type: "strong",
    casePattern: "dativ+akkusativ",
    conjugation: {
      ich: "gebe",
      du: "gibst",
      er: "gibt",
      sie: "gibt",
      es: "gibt",
      wir: "geben",
      ihr: "gebt",
      Sie: "geben"
    },
    perfekt: "hat gegeben",
    prateritum: "gab",
    examples: [
      "Ich gebe der Frau das Buch.",
      "Ich gebe dem Mann das Werkzeug."
    ]
  },
  {
    infinitive: "zeigen",
    meaning: "to show",
    type: "weak",
    casePattern: "dativ+akkusativ",
    conjugation: {
      ich: "zeige",
      du: "zeigst",
      er: "zeigt",
      sie: "zeigt",
      es: "zeigt",
      wir: "zeigen",
      ihr: "zeigt",
      Sie: "zeigen"
    },
    perfekt: "hat gezeigt",
    prateritum: "zeigte",
    examples: [
      "Ich zeige dem Mann die Maschine.",
      "Ich zeige der Frau das Bild."
    ]
  },
  {
    infinitive: "bringen",
    meaning: "to bring",
    type: "strong",
    casePattern: "dativ+akkusativ",
    conjugation: {
      ich: "bringe",
      du: "bringst",
      er: "bringt",
      sie: "bringt",
      es: "bringt",
      wir: "bringen",
      ihr: "bringt",
      Sie: "bringen"
    },
    perfekt: "hat gebracht",
    prateritum: "brachte",
    examples: [
      "Ich bringe dem Kind das Brot.",
      "Ich bringe der Frau das Werkzeug."
    ]
  },
  {
    infinitive: "erklären",
    meaning: "to explain",
    type: "weak",
    casePattern: "dativ+akkusativ",
    conjugation: {
      ich: "erkläre",
      du: "erklärst",
      er: "erklärt",
      sie: "erklärt",
      es: "erklärt",
      wir: "erklären",
      ihr: "erklärt",
      Sie: "erklären"
    },
    perfekt: "hat erklärt",
    prateritum: "erklärte",
    examples: [
      "Ich erkläre dem Mann die Aufgabe.",
      "Ich erkläre der Frau das Problem."
    ]
  },
  {
    infinitive: "sehen",
    meaning: "to see",
    type: "strong",
    casePattern: "akkusativ",
    conjugation: {
      ich: "sehe",
      du: "siehst",
      er: "sieht",
      sie: "sieht",
      es: "sieht",
      wir: "sehen",
      ihr: "seht",
      Sie: "sehen"
    },
    perfekt: "hat gesehen",
    prateritum: "sah",
    examples: [
      "Ich sehe den Hund.",
      "Ich sehe die Maschine."
    ]
  },
  {
    infinitive: "lesen",
    meaning: "to read",
    type: "strong",
    casePattern: "akkusativ",
    conjugation: {
      ich: "lese",
      du: "liest",
      er: "liest",
      sie: "liest",
      es: "liest",
      wir: "lesen",
      ihr: "lest",
      Sie: "lesen"
    },
    perfekt: "hat gelesen",
    prateritum: "las",
    examples: [
      "Ich lese das Buch.",
      "Ich lese die Zeitung."
    ]
  },
  {
    infinitive: "trinken",
    meaning: "to drink",
    type: "strong",
    casePattern: "akkusativ",
    conjugation: {
      ich: "trinke",
      du: "trinkst",
      er: "trinkt",
      sie: "trinkt",
      es: "trinkt",
      wir: "trinken",
      ihr: "trinkt",
      Sie: "trinken"
    },
    perfekt: "hat getrunken",
    prateritum: "trank",
    examples: [
      "Ich trinke Wasser.",
      "Ich trinke den Kaffee."
    ]
  },
  {
    infinitive: "essen",
    meaning: "to eat",
    type: "irregular",
    casePattern: "akkusativ",
    conjugation: {
      ich: "esse",
      du: "isst",
      er: "isst",
      sie: "isst",
      es: "isst",
      wir: "essen",
      ihr: "esst",
      Sie: "essen"
    },
    perfekt: "hat gegessen",
    prateritum: "aß",
    examples: [
      "Ich esse das Brot.",
      "Ich esse Pizza."
    ]
  },
  {
    infinitive: "kaufen",
    meaning: "to buy",
    type: "weak",
    casePattern: "akkusativ",
    conjugation: {
      ich: "kaufe",
      du: "kaufst",
      er: "kauft",
      sie: "kauft",
      es: "kauft",
      wir: "kaufen",
      ihr: "kauft",
      Sie: "kaufen"
    },
    perfekt: "hat gekauft",
    prateritum: "kaufte",
    examples: [
      "Ich kaufe das Brot.",
      "Ich kaufe den Computer."
    ]
  },
  {
    infinitive: "brauchen",
    meaning: "to need",
    type: "weak",
    casePattern: "akkusativ",
    conjugation: {
      ich: "brauche",
      du: "brauchst",
      er: "braucht",
      sie: "braucht",
      es: "braucht",
      wir: "brauchen",
      ihr: "braucht",
      Sie: "brauchen"
    },
    perfekt: "hat gebraucht",
    prateritum: "brauchte",
    examples: [
      "Ich brauche das Werkzeug.",
      "Ich brauche Hilfe."
    ]
  },
  {
    infinitive: "machen",
    meaning: "to make / do",
    type: "weak",
    casePattern: "akkusativ",
    conjugation: {
      ich: "mache",
      du: "machst",
      er: "macht",
      sie: "macht",
      es: "macht",
      wir: "machen",
      ihr: "macht",
      Sie: "machen"
    },
    perfekt: "hat gemacht",
    prateritum: "machte",
    examples: [
      "Ich mache die Arbeit.",
      "Ich mache das Projekt."
    ]
  },
  {
    infinitive: "finden",
    meaning: "to find",
    type: "strong",
    casePattern: "akkusativ",
    conjugation: {
      ich: "finde",
      du: "findest",
      er: "findet",
      sie: "findet",
      es: "findet",
      wir: "finden",
      ihr: "findet",
      Sie: "finden"
    },
    perfekt: "hat gefunden",
    prateritum: "fand",
    examples: [
      "Ich finde den Schlüssel.",
      "Ich finde die Lösung."
    ]
  },
  {
    infinitive: "kennen",
    meaning: "to know",
    type: "irregular",
    casePattern: "akkusativ",
    conjugation: {
      ich: "kenne",
      du: "kennst",
      er: "kennt",
      sie: "kennt",
      es: "kennt",
      wir: "kennen",
      ihr: "kennt",
      Sie: "kennen"
    },
    perfekt: "hat gekannt",
    prateritum: "kannte",
    examples: [
      "Ich kenne den Mann.",
      "Ich kenne die Stadt."
    ]
  },
  {
    infinitive: "verstehen",
    meaning: "to understand",
    type: "strong",
    casePattern: "akkusativ",
    conjugation: {
      ich: "verstehe",
      du: "verstehst",
      er: "versteht",
      sie: "versteht",
      es: "versteht",
      wir: "verstehen",
      ihr: "versteht",
      Sie: "verstehen"
    },
    perfekt: "hat verstanden",
    prateritum: "verstand",
    examples: [
      "Ich verstehe Deutsch.",
      "Ich verstehe den Satz."
    ]
  },
  {
    infinitive: "versuchen",
    meaning: "to try",
    type: "weak",
    casePattern: "akkusativ",
    conjugation: {
      ich: "versuche",
      du: "versuchst",
      er: "versucht",
      sie: "versucht",
      es: "versucht",
      wir: "versuchen",
      ihr: "versucht",
      Sie: "versuchen"
    },
    perfekt: "hat versucht",
    prateritum: "versuchte",
    examples: [
      "Ich versuche die Aufgabe.",
      "Ich versuche den Test."
    ]
  },
  {
    infinitive: "helfen",
    meaning: "to help",
    type: "strong",
    casePattern: "dativ",
    conjugation: {
      ich: "helfe",
      du: "hilfst",
      er: "hilft",
      sie: "hilft",
      es: "hilft",
      wir: "helfen",
      ihr: "helft",
      Sie: "helfen"
    },
    perfekt: "hat geholfen",
    prateritum: "half",
    examples: [
      "Ich helfe dem Mann.",
      "Ich helfe der Frau."
    ]
  },
  {
    infinitive: "folgen",
    meaning: "to follow",
    type: "weak",
    casePattern: "dativ",
    conjugation: {
      ich: "folge",
      du: "folgst",
      er: "folgt",
      sie: "folgt",
      es: "folgt",
      wir: "folgen",
      ihr: "folgt",
      Sie: "folgen"
    },
    perfekt: "ist gefolgt",
    prateritum: "folgte",
    examples: [
      "Ich folge dem Mann.",
      "Ich folge der Anweisung."
    ]
  },
  {
    infinitive: "gehören",
    meaning: "to belong",
    type: "weak",
    casePattern: "dativ",
    conjugation: {
      ich: "gehöre",
      du: "gehörst",
      er: "gehört",
      sie: "gehört",
      es: "gehört",
      wir: "gehören",
      ihr: "gehört",
      Sie: "gehören"
    },
    perfekt: "hat gehört",
    prateritum: "gehörte",
    examples: [
      "Das Buch gehört dem Mann.",
      "Die Maschine gehört der Firma."
    ]
  },
  {
    infinitive: "sprechen",
    meaning: "to speak",
    type: "strong",
    casePattern: "mit+dativ",
    conjugation: {
      ich: "spreche",
      du: "sprichst",
      er: "spricht",
      sie: "spricht",
      es: "spricht",
      wir: "sprechen",
      ihr: "sprecht",
      Sie: "sprechen"
    },
    perfekt: "hat gesprochen",
    prateritum: "sprach",
    examples: [
      "Ich spreche mit dem Chef.",
      "Ich spreche mit der Frau."
    ]
  },
  {
    infinitive: "arbeiten",
    meaning: "to work",
    type: "weak",
    casePattern: "mit+dativ",
    conjugation: {
      ich: "arbeite",
      du: "arbeitest",
      er: "arbeitet",
      sie: "arbeitet",
      es: "arbeitet",
      wir: "arbeiten",
      ihr: "arbeitet",
      Sie: "arbeiten"
    },
    perfekt: "hat gearbeitet",
    prateritum: "arbeitete",
    examples: [
      "Ich arbeite mit dem Team.",
      "Ich arbeite mit der Maschine."
    ]
  },
  {
    infinitive: "warten",
    meaning: "to wait",
    type: "weak",
    casePattern: "auf+akkusativ",
    conjugation: {
      ich: "warte",
      du: "wartest",
      er: "wartet",
      sie: "wartet",
      es: "wartet",
      wir: "warten",
      ihr: "wartet",
      Sie: "warten"
    },
    perfekt: "hat gewartet",
    prateritum: "wartete",
    examples: [
      "Ich warte auf den Bus.",
      "Ich warte auf den Mann."
    ]
  },
  {
    infinitive: "denken",
    meaning: "to think",
    type: "strong",
    casePattern: "an+akkusativ",
    conjugation: {
      ich: "denke",
      du: "denkst",
      er: "denkt",
      sie: "denkt",
      es: "denkt",
      wir: "denken",
      ihr: "denkt",
      Sie: "denken"
    },
    perfekt: "hat gedacht",
    prateritum: "dachte",
    examples: [
      "Ich denke an den Test.",
      "Ich denke an die Arbeit."
    ]
  },
  {
    infinitive: "gehen",
    meaning: "to go",
    type: "strong",
    casePattern: "movement",
    conjugation: {
      ich: "gehe",
      du: "gehst",
      er: "geht",
      sie: "geht",
      es: "geht",
      wir: "gehen",
      ihr: "geht",
      Sie: "gehen"
    },
    perfekt: "ist gegangen",
    prateritum: "ging",
    examples: [
      "Ich gehe in den Supermarkt.",
      "Ich gehe nach Hause."
    ]
  },
  {
    infinitive: "kommen",
    meaning: "to come",
    type: "strong",
    casePattern: "movement",
    conjugation: {
      ich: "komme",
      du: "kommst",
      er: "kommt",
      sie: "kommt",
      es: "kommt",
      wir: "kommen",
      ihr: "kommt",
      Sie: "kommen"
    },
    perfekt: "ist gekommen",
    prateritum: "kam",
    examples: [
      "Ich komme in die Stadt.",
      "Ich komme nach Hause."
    ]
  },
  {
    infinitive: "fahren",
    meaning: "to drive / go",
    type: "strong",
    casePattern: "movement",
    conjugation: {
      ich: "fahre",
      du: "fährst",
      er: "fährt",
      sie: "fährt",
      es: "fährt",
      wir: "fahren",
      ihr: "fahrt",
      Sie: "fahren"
    },
    perfekt: "ist gefahren",
    prateritum: "fuhr",
    examples: [
      "Ich fahre in die Stadt.",
      "Ich fahre nach Hause."
    ]
  },
  {
    infinitive: "bleiben",
    meaning: "to stay",
    type: "strong",
    casePattern: "place",
    conjugation: {
      ich: "bleibe",
      du: "bleibst",
      er: "bleibt",
      sie: "bleibt",
      es: "bleibt",
      wir: "bleiben",
      ihr: "bleibt",
      Sie: "bleiben"
    },
    perfekt: "ist geblieben",
    prateritum: "blieb",
    examples: [
      "Ich bleibe in der Küche.",
      "Wir bleiben zu Hause."
    ]
  },
  {
    infinitive: "wohnen",
    meaning: "to live",
    type: "weak",
    casePattern: "place",
    conjugation: {
      ich: "wohne",
      du: "wohnst",
      er: "wohnt",
      sie: "wohnt",
      es: "wohnt",
      wir: "wohnen",
      ihr: "wohnt",
      Sie: "wohnen"
    },
    perfekt: "hat gewohnt",
    prateritum: "wohnte",
    examples: [
      "Ich wohne in der Stadt.",
      "Wir wohnen in Deutschland."
    ]
  },
  {
    infinitive: "können",
    meaning: "can / to be able to",
    type: "modal",
    casePattern: "none",
    conjugation: {
      ich: "kann",
      du: "kannst",
      er: "kann",
      sie: "kann",
      es: "kann",
      wir: "können",
      ihr: "könnt",
      Sie: "können"
    },
    perfekt: "hat gekonnt",
    prateritum: "konnte",
    examples: [
      "Ich kann Deutsch lernen.",
      "Wir können arbeiten."
    ]
  },
  {
    infinitive: "müssen",
    meaning: "must / to have to",
    type: "modal",
    casePattern: "none",
    conjugation: {
      ich: "muss",
      du: "musst",
      er: "muss",
      sie: "muss",
      es: "muss",
      wir: "müssen",
      ihr: "müsst",
      Sie: "müssen"
    },
    perfekt: "hat gemusst",
    prateritum: "musste",
    examples: [
      "Ich muss arbeiten.",
      "Wir müssen gehen."
    ]
  },
  {
    infinitive: "wollen",
    meaning: "to want",
    type: "modal",
    casePattern: "none",
    conjugation: {
      ich: "will",
      du: "willst",
      er: "will",
      sie: "will",
      es: "will",
      wir: "wollen",
      ihr: "wollt",
      Sie: "wollen"
    },
    perfekt: "hat gewollt",
    prateritum: "wollte",
    examples: [
      "Ich will Deutsch lernen.",
      "Wir wollen nach Hause gehen."
    ]
  },
  {
    infinitive: "dürfen",
    meaning: "may / to be allowed to",
    type: "modal",
    casePattern: "none",
    conjugation: {
      ich: "darf",
      du: "darfst",
      er: "darf",
      sie: "darf",
      es: "darf",
      wir: "dürfen",
      ihr: "dürft",
      Sie: "dürfen"
    },
    perfekt: "hat gedurft",
    prateritum: "durfte",
    examples: [
      "Ich darf hier arbeiten.",
      "Wir dürfen nach Hause gehen."
    ]
  }
];