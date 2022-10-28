const DEFAULTENEMY = {
  stats: {
    appearance: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    constitution: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    dexterity: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    education: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    intelligence: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    size: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    strength: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    telekinesis: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
    willpower: {
      mean: 50,
      std: 2.5,
      min: 0,
      max: 100,
    },
  },
  absorbPercent: {
    material: 0,
    blunt: 0,
    pierce: 0,
    acid: 0,

    elemental: 0,
    fire: 0,
    frost: 0,
    lightning: 0,

    occult: 0,
    sacred: 0,
    shadow: 0,
    aether: 0,
  },
  absorbPercentMax: {
    material: 45,
    blunt: 45,
    pierce: 45,
    acid: 45,

    elemental: 45,
    fire: 45,
    frost: 45,
    lightning: 45,

    occult: 45,
    sacred: 45,
    shadow: 45,
    aether: 45,
  },
  absorbFlat: {
    material: 0,
    blunt: 0,
    pierce: 0,
    acid: 0,

    elemental: 0,
    fire: 0,
    frost: 0,
    lightning: 0,

    occult: 0,
    sacred: 0,
    shadow: 0,
    aether: 0,
  },
  resistance: {
    material: 0,
    blunt: 0,
    pierce: 0,
    acid: 0,

    elemental: 0,
    fire: 0,
    frost: 0,
    lightning: 0,

    occult: 0,
    sacred: 0,
    shadow: 0,
    aether: 0,
  },
  resistanceMax: {
    material: 75,
    blunt: 75,
    pierce: 75,
    acid: 75,

    elemental: 75,
    fire: 75,
    frost: 75,
    lightning: 75,

    occult: 75,
    sacred: 75,
    shadow: 75,
    aether: 75,
  },
  reduct: {
    material: 0,
    blunt: 0,
    pierce: 0,
    acid: 0,

    elemental: 0,
    fire: 0,
    frost: 0,
    lightning: 0,

    occult: 0,
    sacred: 0,
    shadow: 0,
    aether: 0,
  },
  initVariance: 0.10,
  family: null,
};
// TODO: Add initVariancePercent to vary the starting Init. Also do thing for health.

class Enemy {
  constructor(obj) {
    // This is required as we need to deep assign.
    let merger = mergeDeep(DEFAULTENEMY, obj);
    Object.assign(this, merger);

    if (this.family === null) {
      console.error(`${this.name}'s family is null.`);
    }
  }

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

const monsters = {
  ENspider: new Enemy({
    name: "Spider",
    family: "Spider",
    healthMax: 4,
    initStart: 67,
    attacks: setup.COM.attacks.Spider,
  }),

  ENhog: new Enemy({
    name: "Hog",
    family: "Hog",
    healthMax: 8,
    initStart: 47,
    attacks: setup.COM.familyAttacks.Hog,
  }),

  ENAquamarineCarbuncle: new Enemy({
    name: "Aquamarine Carbuncle",
    family: "Carbuncle",
    healthMax: 13,
    initStart: 24,
    attacks: setup.COM.familyAttacks.Carbuncle,
  })
};

// Add all the monsters to setup.
(function (S) {
  if (!S.COM) {
    S.COM = {};
  }

  S.COM.monsters = monsters;
})(setup);
