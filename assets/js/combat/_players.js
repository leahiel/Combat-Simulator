/**
 * A Player is the base object on the that is used to calculate
 * Combatants, which in the future, may be modified by modifiers and
 * statuses.
 *
 * Currently, this is largely unimplemented: Only what needs to work
 * is currently functional.
 */
class Player {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTPLAYER, obj);
    }

    // TODO: Add a profiency item for each key in equippables. Also maybe for each equippable tag (leather, armor, metal, helmet, etc) as well.

    clone() {
        return new this.constructor(this);
    }

    toJSON() {
        const ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
    }
}

// Add the Player class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Player = Player;
})(setup);

const DEFAULTPLAYER = {
    /** A multiplier for your init decrements. */
    initDecrementModifier: 1,
    healthMax: 125,
    initStart: 23,
    initVariance: 0.1,

    equippables: {
        weapon: equippables.unequippedweapon,
        armor: equippables.unequippedarmor,
        accessory: equippables.unequippedaccessory,
    },
    buffs: [],

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
    blockRecovery: 6,
    initVariance: 0.1,
    family: "player",

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

    blockChanceBase: 0,
    blockChanceIncreased: 1,
    blockChanceMore: 1,
};