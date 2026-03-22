export const PREPOSITION_RULES = {
  mit: {
    type: "fixed",
    case: "dativ",
    explanation: '„mit“ always takes Dativ.',
    example: "Ich arbeite mit dem Team."
  },
  für: {
    type: "fixed",
    case: "akkusativ",
    explanation: '„für“ always takes Akkusativ.',
    example: "Ich kaufe das Geschenk für den Mann."
  },
  an: {
    type: "wechsel",
    case: "wo/wohin",
    explanation: '„an“ takes Dativ for location and Akkusativ for direction.',
    example: "Ich bin an der Maschine. / Ich gehe an die Maschine."
  },
  in: {
    type: "wechsel",
    case: "wo/wohin",
    explanation: '„in“ takes Dativ for location and Akkusativ for direction.',
    example: "Ich bin in der Küche. / Ich gehe in die Küche."
  },
  zu: {
    type: "fixed",
    case: "dativ",
    explanation: '„zu“ takes Dativ and is often used for direction toward a person/place.',
    example: "Ich gehe zu dem Arzt."
  }
};
