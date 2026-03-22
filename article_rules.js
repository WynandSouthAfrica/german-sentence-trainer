export const ARTICLE_RULES = {
  definite: {
    nominativ: {
      masculine: "der",
      feminine: "die",
      neuter: "das",
      plural: "die"
    },
    akkusativ: {
      masculine: "den",
      feminine: "die",
      neuter: "das",
      plural: "die"
    },
    dativ: {
      masculine: "dem",
      feminine: "der",
      neuter: "dem",
      plural: "den"
    },
    genitiv: {
      masculine: "des",
      feminine: "der",
      neuter: "des",
      plural: "der"
    }
  },

  indefinite: {
    nominativ: {
      masculine: "ein",
      feminine: "eine",
      neuter: "ein"
    },
    akkusativ: {
      masculine: "einen",
      feminine: "eine",
      neuter: "ein"
    },
    dativ: {
      masculine: "einem",
      feminine: "einer",
      neuter: "einem"
    },
    genitiv: {
      masculine: "eines",
      feminine: "einer",
      neuter: "eines"
    }
  },

  mein: {
    nominativ: {
      masculine: "mein",
      feminine: "meine",
      neuter: "mein"
    },
    akkusativ: {
      masculine: "meinen",
      feminine: "meine",
      neuter: "mein"
    },
    dativ: {
      masculine: "meinem",
      feminine: "meiner",
      neuter: "meinem"
    },
    genitiv: {
      masculine: "meines",
      feminine: "meiner",
      neuter: "meines"
    }
  }
};

export const ARTICLE_LOOKUP = {
  der: { family: "definite", case: "nominativ" },
  die: { family: "definite", case: "nominativ/akkusativ" },
  das: { family: "definite", case: "nominativ/akkusativ" },
  den: { family: "definite", case: "akkusativ/dativPlural" },
  dem: { family: "definite", case: "dativ" },
  des: { family: "definite", case: "genitiv" },

  ein: { family: "indefinite", case: "nominativ/akkusativ" },
  eine: { family: "indefinite", case: "nominativ/akkusativ" },
  einen: { family: "indefinite", case: "akkusativ" },
  einem: { family: "indefinite", case: "dativ" },
  einer: { family: "indefinite", case: "dativ/genitiv" },
  eines: { family: "indefinite", case: "genitiv" },

  mein: { family: "mein", case: "nominativ/akkusativ" },
  meine: { family: "mein", case: "nominativ/akkusativ" },
  meinen: { family: "mein", case: "akkusativ" },
  meinem: { family: "mein", case: "dativ" },
  meiner: { family: "mein", case: "dativ/genitiv" },
  meines: { family: "mein", case: "genitiv" }
};

export const ALL_SUPPORTED_ARTICLES = [
  "der", "die", "das", "den", "dem", "des",
  "ein", "eine", "einen", "einem", "einer", "eines",
  "mein", "meine", "meinen", "meinem", "meiner", "meines"
];