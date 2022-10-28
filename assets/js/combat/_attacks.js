/** The default attack object. Name must be specified itself when creating a new Attack. Values not specified will use these default values instead. */
const DEFAULTATTACK = {
  /** Must be "damage", "buff", or "debuff". The last two are NYI. */
  effect: "damage",
  /** The amount of init after using this Attack that the character who used it should take to recover. */
  initRecovery: 45,
  /** The weapon damage multiplier multiplies the weapon damage for the attack by this amount. */
  wdm: 1,
  family: null,

  directhit: {
    calculated: 0,
    base: 0,
    increased: 0,
    more: 0,
  },

  critical: {
    chance: {
      calculated: 0,
      base: 0,
      increased: 0,
      more: 0,
    },
    damage: {
      calculated: 0,
      base: 0,
      increased: 0,
      more: 0,
    },
    avoid: {
      increased: 0,
      more: 0,
    },
  },

  damage: {
    // Material Damage Types
    blunt: {
      min: 0,
      max: 0,
    },
    pierce: {
      min: 0,
      max: 0,
    },
    acid: {
      min: 0,
      max: 0,
    },

    // Elemental Damage Types
    fire: {
      min: 0,
      max: 0,
    },
    frost: {
      min: 0,
      max: 0,
    },
    lightning: {
      min: 0,
      max: 0,
    },

    // Occult Damage Types
    sacred: {
      min: 0,
      max: 0,
    },
    shadow: {
      min: 0,
      max: 0,
    },
    aether: {
      min: 0,
      max: 0,
    },
  },
};

// TODO: Add initVariancePercent to vary the recovery Init a little.

/**
 * There are currently no Attack methods, it is just used as a constructor to easily make new attacks.
 */
class Attack {
  constructor(obj) {
    // This is required as we need to deep assign.
    let merger = mergeDeep(DEFAULTATTACK, obj);
    Object.assign(this, merger);

    if (this.family === null) {
      console.error(`${this.name}'s family is null.`);
    }
  }

  // TODO: These methods hould be prototype'd.

  // Required for full SC2 compatibility.
  clone() {
    return new this.constructor(this);
  }

  // Required for full SC2 compatibility.
  toJSON() {
    const ownData = {};
    Object.keys(this).forEach(function (pn) {
      ownData[pn] = clone(this[pn]);
    }, this);
    return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
  }
}

const attacks = {
  // SPEAR ATTACKS
  stab: new Attack({
    name: "Stab",
    family: "Player",
    initRecovery: 50,
    wdm: 1.25,
    damage: {
      pierce: {
        min: 7,
        max: 13,
      },
    },
  }),

  // ENEMY ATTACKS
  // Spider
  vilebite: new Attack({
    name: "Vile Bite",
    family: "Spider",
    damage: {
      pierce: {
        min: 8,
        max: 12,
      },
      acid: {
        min: 8,
        max: 12,
      },
    },
  }),

  webshot: new Attack({
    name: "Web Shot",
    family: "Spider",
    damage: {
      frost: {
        min: 2,
        max: 4,
      },
      acid: {
        min: 2,
        max: 4,
      },
    },
  }),

  eightleggedrush: new Attack({
    name: "Eight Legged Rush",
    family: "Spider",
    initRecovery: 80,
    damage: {
      blunt: {
        min: 13,
        max: 19,
      },
    },
  }),

  // Hog
  hogrush: new Attack({
    name: "Hog Rush",
    family: "Hog",
    initRecovery: "80",
    damage: {
      blunt: {
        min: 9,
        max: 13,
      },
    },
  }),

  hoggore: new Attack({
    name: "Hog Gore",
    family: "Hog",
    initRecovery: "72",
    damage: {
      pierce: {
        min: 11,
        max: 14,
      },
    },
  }),

  // Carbuncle
  cuddlebutt: new Attack({
    name: "Cuddle Butt",
    family: "Carbuncle",
    initRecovery: "16",
    damage: {
      blunt: {
        min: 3,
        max: 5,
      },
    },
  }),

  // MISC. ATTACKS
  /** When a character is dead, this attack should replace its attack. */
  deadAttack: new Attack({
    name: "deadAttack",
    family: "Debug",
    effect: null,
    initRecovery: 0,
  }),

  /** The attack that is used when attacks aren't initialized. */
  nullAttack: new Attack({
    name: "errorAttack",
    family: "Debug",
    effect: null,
  }),
};

const familyAttacks = {};
for (let key in attacks) {
  if (attacks[key].family) {
    if (!familyAttacks[attacks[key].family]) {
      // familyAttacks[attacks[key].family] = {};
      familyAttacks[attacks[key].family] = [];
    }

    // familyAttacks[attacks[key].family][attacks[key].name] = attacks[key];
    familyAttacks[attacks[key].family].push(attacks[key]);
  }
}

// Add all the attacks to setup.
(function (S) {
  if (!S.COM) {
    S.COM = {};
  }

  S.COM.attacks = attacks;
  S.COM.familyAttacks = familyAttacks;
})(setup);
