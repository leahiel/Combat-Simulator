const DEFAULTEQUIPPABLE = {
    mods: [],
    modslots: 0,
};

/** The default attack object. Name must be specified itself when creating a new Attack. Values not specified will use these default values instead. */
const DEFAULTBUFF = {
    duration: 0,
    onApply: function (target) {
        return;
    },
    onReapply: function (target) {
        return;
    },
    perInit: function (target) {
        return;
    },
};

// NYI: initVariancePercent to vary the recovery Init a little.
const DEFAULTATTACK = {
    family: null,

    /** Must be "damage", "buff", or "debuff". */
    effect: "damage",
    /** The amount of init after using this Attack that the character who used it should take to recover. */
    initRecovery: 45,
    /** NYI: The weapon damage multiplier multiplies the weapon damage for the attack by this amount. */
    wdm: 1,
    /** The amount of init added to the defender after an attack. */
    stun: 0,

    /** The buffs or debuffs the attack performs. */
    buffs: [],

    targetType: "single", // "area"
    allyTargetable: false,
    opponentTargetable: true,
    frontlineTargetable: false,
    backlineTargetable: false,

    criticalChanceCalculated: 0,
    criticalChanceBase: 0,
    criticalChanceIncreased: 0,
    criticalChanceMore: 1,
    criticalDamageCalculated: 0,
    criticalDamageBase: 0,
    criticalDamageIncreased: 0,
    criticalDamageMore: 1,

    directChanceCalculated: 0,
    directChanceBase: 0,
    directChanceIncreased: 0,
    directChanceMore: 1,

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
    /** The amount of init after blocking. */
    blockRecovery: 15,

    criticalChanceBase: 0.05,
    criticalChanceIncreased: 1,
    criticalChanceMore: 1,
    criticalDamageBase: 1.5,
    criticalDamageIncreased: 1,
    criticalDamageMore: 1,

    directChanceBase: 0.05,
    directChanceIncreased: 1,
    directChanceMore: 1,

    deflectChanceBase: 0.05,

    initVariance: 0.1,
    family: null,
    flavortext: null,
};

const DEFAULTPLAYER = {
    healthMax: 125,
    initStart: 43,
    initVariance: 0.1,

    equippables: {

    },

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
    /** The amount of init after blocking. */
    blockRecovery: 15,
    initVariance: 0.1,
    family: "player",
};
