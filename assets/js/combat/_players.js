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
    family: "player",
    equippables: {
        weapon: equippables.unequippedweapon,
        armor: equippables.unequippedarmor,
        accessory: equippables.unequippedaccessory,
    },

    buffs: [],

    healthMax: 100,

    initStart: 45,
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
