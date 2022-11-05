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
    increasedFireResistance: new Affix ({
        tier: 1,
        profiency: 0,
        profiencyNext: 100,
        get value() {
            return this.tier * 0.1;
        },
        get description() {
            return "${this.value * 100}% increased Fire Resistance";
        },
        name: "Increased Fire Resistance",
        type: "increasedFireResistanceArmorMod", // So that we can copy over profiency
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
