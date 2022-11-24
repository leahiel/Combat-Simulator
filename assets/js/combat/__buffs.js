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
        duration: 100,
        name: "Amped",
        description: "Your inits tick twice as fast.",
        onApply: function (target) {
            target.initDecrementModifier *= 2;
            return;
        },
    }),

    buffCheckQuiver: new Buff({
        type: "buff",
        duration: 100,
        name: "Check Quiver",
        description: "Your inits tick faster by half.",
        onApply: function (target) {
            target.initDecrementModifier *= 1.5;
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

            target.deflectCalculated =
                target.deflectChanceBase * target.deflectChanceIncreased * target.deflectChanceMore;
            return;
        },
    }),

    buffShieldPosture: new Buff({
        type: "buff",
        duration: 250,
        name: "Shield Posture",
        description: "You have increased block chance.",
        onApply: function (target) {
            target.blockChanceBase += 0.05;
            target.blockChanceIncreased += 1;

            target.blockCalculated = target.blockChanceBase * target.blockChanceIncreased * target.blockChanceMore;
            return;
        },
    }),

    buffSacrificeToChaos: new Buff({
        type: "buff",
        duration: 250,
        name: "Sacrifice To Chaos",
        description: "You sacrifice 10% of your current life, buffing each of your Occult damage by +(1-3).",
        onApply: function (target) {
            target.health *= 0.9;

            target.damage.aether.min += 1;
            target.damage.aether.max += 3;

            target.damage.sacred.min += 1;
            target.damage.sacred.max += 3;

            target.damage.shadow.min += 1;
            target.damage.shadow.max += 3;
            return;
        },
    }),

    buffLumberjackStance: new Buff({
        type: "buff",
        duration: 250,
        name: "Lumberjack Stance",
        description: "You deal +(4-10) Pierce damage.",
        onApply: function (target) {
            target.damage.pierce.min += 4;
            target.damage.pierce.max += 10;
            return;
        },
    }),

    buffSharpTipArrows: new Buff({
        type: "buff",
        duration: 250,
        name: "Lumberjack Stance",
        description: "You deal twice as much pierce damage.",
        onApply: function (target) {
            // NYI: I need a way to probably calculated increased/more damage modifiers.
            target.damage.pierce.min *= 2;
            target.damage.pierce.max *= 2;
            return;
        },
    }),

    buffHealUndead: new Buff({
        type: "buff",
        duration: 0,
        name: "Heal Undead",
        description: "Heal all undead for 20% of their max life.",
        onApply: function (target) {
            if (["Skeleton"].includes(target.family)) {
                // NYI: Once enemy tags are made, use the tag system instead of the above condition.
                target.health += target.healthMax * 0.2;
            }
            return;
        },
    }),

    buffCackle: new Buff({
        type: "buff",
        duration: 250,
        name: "Cackling",
        description: "Your madness causes you to cackle wildly, increasing your blunt damage.",
        onApply: function (target) {
            target.damage.blunt.min += 4;
            target.damage.blunt.max += 8;
            return;
        },
    }),

    buffHogRoar: new Buff({
        type: "buff",
        duration: 200,
        name: "Hog's Roar",
        description: "You have 20% more material resistance.",
        onApply: function (target) {
            target.resistance.material += 0.2;
            return;
        },
    }),

    buffHerdMentor: new Buff({
        type: "buff",
        duration: 200,
        name: "Herd Mentor",
        description: "You have 15% less attack recovery.",
        onApply: function (target) {
            target.resistance.initRecoveryModifier *= 0.85;
            return;
        },
    }),

    debuffBleed: new Buff({
        type: "debuff",
        duration: 80,
        name: "Bleeding!",
        description: "10% chance to take 1 damage every init.",
        perInit: function (target) {
            if (Math.random() < 0.1) {
                target.health -= 1;
            }

            return;
        },
    }),

    debuffFirewall: new Buff({
        type: "debuff",
        duration: 60,
        name: "Standing in Firewall!",
        description: "10% chance to take 1 damage every init.",
        perInit: function (target) {
            if (Math.random() < 0.1) {
                target.health -= 1;
            }

            return;
        },
    }),

    debuffWebShot: new Buff({
        type: "debuff",
        duration: 80,
        name: "Webbed!",
        description: "You have 20% less init decrement modifier.",
        onApply: function (target) {
            target.initDecrementModifier *= 0.8;
            return;
        },
    }),

    debuffIcePrison: new Buff({
        type: "debuff",
        duration: 80,
        name: "Ice Prison",
        description: "You have 50% less init decrement modifier.",
        onApply: function (target) {
            target.initDecrementModifier *= 0.5;
            return;
        },
    }),

    debuffRattle: new Buff({
        type: "debuff",
        duration: 80,
        name: "Rattled!",
        description: "A spoopy skeleton has given you 10% less init decrement modifier and 10% less blunt resistance.",
        onApply: function (target) {
            target.resistance.bluntl -= 0.2;
            target.initDecrementModifier *= 0.9;
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
