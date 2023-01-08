const DEFAULT_EQUIPPABLE = {
    modslots: 0,
    mods: [],

    affixes: [], // NOTE: Unused, but maybe I'll need it for special mods that do special things?

    healthMax: 0,

    initStart: 0,
    initStartVariance: 0,
    initDecrementModifier: 0,
    initRecoveryModifier: 0,

    triggers: [], // NYI

    criticalChanceBase: 0,
    criticalChanceIncreased: 0,
    criticalChanceMore: 1,
    criticalDamageBase: 0,
    criticalDamageIncreased: 0,
    criticalDamageMore: 1,

    directChanceBase: 0,
    directChanceIncreased: 0,
    directChanceMore: 1,

    deflectChanceBase: 0,
    deflectChanceIncreased: 0,
    deflectChanceMore: 1,

    blockRecovery: 0,
    blockChanceBase: 0,
    blockChanceIncreased: 0,
    blockChanceMore: 1,

    damage: {
        // Material Damage Types
        blunt: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        pierce: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        acid: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Elemental Damage Types
        fire: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        frost: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        lightning: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Occult Damage Types
        sacred: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        shadow: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        aether: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
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
};

const DEFAULT_BUFF = {
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

const DEFAULT_ATTACK = {
    family: null,
    type: "attack" /* "attack", "spell", or "miracle". */,
    effect: "damage" /* "damage", "buff", or "debuff". */,

    hitnumber: 1 /** The number of times an attack hits. */,
    wdm: 1,
    initRecovery: 22,
    initRecoveryVariance: 0.12 /* NYI */,
    stun: 0 /** The amount of init added to the defender after an attack. */,

    /** The buffs or debuffs the attack performs. */
    buffs: [],

    deflectCalculated: 0,
    blockCalculated: 0,

    isBlockable: true,
    isDeflectable: true,
    isDirectable: true,
    isCritable: true,

    targets: {
        style: null, // "all", "side", "row", "single", "self"
        side: null, // "both", "ally", "enemy"
        row: null, // "both", "front", "back"
    },

    criticalChanceBase: 0,
    criticalChanceIncreased: 0,
    criticalChanceMore: 1,
    criticalChanceCalculated: 0,
    criticalDamageBase: 0,
    criticalDamageIncreased: 0,
    criticalDamageMore: 1,
    criticalDamageCalculated: 0,

    directChanceBase: 0,
    directChanceIncreased: 0,
    directChanceMore: 1,
    directChanceCalculated: 0,

    damage: {
        // Material Damage Types
        blunt: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        pierce: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        acid: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Elemental Damage Types
        fire: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        frost: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        lightning: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Occult Damage Types
        sacred: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        shadow: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        aether: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
    },
};

const DEFAULT_ENEMY = {
    family: null,
    description: null,

    buffs: [],

    healthMax: 100,

    initStart: 26,
    initStartVariance: 0.12,
    initDecrementModifier: 1,
    initRecoveryModifier: 1,

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
    deflectChanceIncreased: 1,
    deflectChanceMore: 1,

    blockRecovery: 5,
    blockChanceBase: 0,
    blockChanceIncreased: 1,
    blockChanceMore: 1,

    damage: {
        // Material Damage Types
        blunt: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        pierce: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        acid: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Elemental Damage Types
        fire: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        frost: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        lightning: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },

        // Occult Damage Types
        sacred: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        shadow: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
        aether: {
            min: 0,
            max: 0,
            increased: 0,
            more: 1,
        },
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
};
