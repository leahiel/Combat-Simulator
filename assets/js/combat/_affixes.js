/**
 *
 */
class Affix {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTAFFIX, */ obj);
    }
}

const affixes = {
    /**
     *  NOTE: Strictly speaking, we're not making affixes here, we're making the objects that become affixes. This is because each affix can be hotswapped, and have stats that can grow. That is, they track stats on these objects, not on the player.
     */
    increasedFireResistance: new Affix({
        name: "Increased Fire Resistance",
        type: "increasedFireResistanceArmorMod",
        affixes: [
            ["resistance.fire", "+"],
            ["resistance.elemental", "+"],
        ],

        // so I'd like turn the above two into
        // combatant.resistance.fire += affix.value[0]
        // combatant.resistance.elemental += affix.value[1]

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.1, this.tier * 0.02];
        },
        get description() {
            return "${this.value[0] * 100}% increased Fire Resistance \n ${this.value[1] * 100}% increased Fire Resistance";
        },

        tags: ["armor", "leather"],
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
