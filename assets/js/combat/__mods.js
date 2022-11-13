/**
 * TODO: Rename Affix to Mods
 */
class Affix {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTAFFIX, */ obj);
    }

    static new(Affix) {
        return cloneDeep(Affix);
    }

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

const affixes = {
    unequippedMod: new Affix({
        name: "Unequipped Mod",
        type: "UnequippedMod",
        tier: 1,
    }),

    increasedFireResistance: new Affix({
        name: "Increased Fire Resistance",
        affixes: [
            ["resistance.fire", "+"],
            ["resistance.elemental", "+"],
        ],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.1, this.tier * 0.02];
        },
        get description() {
            return "${this.value[0] * 100}% increased Fire Resistance \n ${this.value[1] * 100}% increased Elemental Resistance";
        },

        type: "armor",
        tags: ["leather"],
    }),

    increasedFrostResistance: new Affix({
        name: "Increased Frost Resistance",
        affixes: [
            ["resistance.frost", "+"],
            ["resistance.elemental", "+"],
        ],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.1, this.tier * 0.02];
        },
        get description() {
            return "${this.value[0] * 100}% increased Frost Resistance \n ${this.value[1] * 100}% increased Elemental Resistance";
        },

        type: "armor",
        tags: ["leather"],
    }),
};

// Add the Affixes to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Affix = Affix;
    S.COM.affixes = affixes;
})(setup);
