/**
 * There are currently no Buff methods, it is just used as a constructor to easily make new attacks.
 */
class Buff {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTBUFF, obj);

        if (this.description === undefined) {
            console.error(`Buff: ${this.name} lacks a description.`);
            this.description = "Description missing.";
        }
    }
}

const buffs = {
    buffAmp: new Buff({
        type: "buff",
        duration: 250,
        name: "Amped",
        description: "Your inits tick twice as fast.",
        onApply: function (target) {
            target.initDecrementModifier *= 2;
            return;
        },
    }),

    buffSpearPosture: new Buff({
        type: "buff",
        duration: 250,
        name: "Spear Posture",
        description: "You have increased deflect chance.",
        onApply: function (target) {
            target.deflectChanceBase += 0.05;
            target.deflectChanceIncreased += 1;

            target.deflectCalculated = target.deflectChanceBase * target.deflectChanceIncreased * target.deflectChanceMore;
            return;
        },
    }),

    buffSacrificeToChaos: new Buff({
        type: "buff",
        duration: 250,
        name: "Sacrifice To Chaos",
        description: "You deal +(1-3) Occult damage.",
        onApply: function (target) {
            target.health *= .9;

            target.damage.aether.min += 1;
            target.damage.aether.max += 3;

            target.damage.sacred.min += 1;
            target.damage.sacred.max += 3;

            target.damage.shadow.min += 1;
            target.damage.shadow.max += 3;
            return;
        },
    }),
};

// Add buffs to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.buffs = buffs;
})(setup);
