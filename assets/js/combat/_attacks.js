/**
 *
 */
class Attack {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTATTACK, obj);

        if (this.family === null) {
            console.error(`${this.name}'s family is null.`);
        }

        if (!this.frontlineTargetable && !this.backlineTargetable) {
            console.error(`${this.name} has both frontline and backline untargetable.`);
        }

        if (this.description === undefined) {
            console.error(`Attack: ${this.name} lacks a description.`);
            this.description = "Description missing.";
        }
    }

    /**
     * Convert the data into a string so that the player can understand the data within.
     *
     * This can be HTML text.
     *
     * This will eventually show up left or above of the attack menu, so that players can know what their attacks do
     */
    getInfo() {
        let solstr = "";

        // misc info
        solstr += `<span id='infoName'>${this.name}</span>`;
        solstr += `<span class='divider'></span>`;

        // special info

        // For uncommon stat thingies. "Absorbs Elemental."  We could also put the rarity affix info here?

        // metrics info
        solstr += `<span id='infoMetrics'><span class='infoSectionHeader'>METRICS</span>`;
        solstr += `<grid id='infoMetricsAttacksGrid'>`;
        solstr += `<span>WDM:${this.wdm}</span>`;
        solstr += `<span>initRecovery:${this.initRecovery}</span>`;
        // solstr += `<span>Direct:${this.directCalculated}</span>`; // NYI I need to pull the attacker's stats for this
        // solstr += `<span>Critical:${this.criticalCalculated}</span>`; // NYI I need to pull the attacker's stats for this
        solstr += `</grid></span>`;

        solstr += `<span id='infoTargeting'><span class='infoSectionHeader'>TARGETING</span>`;
        solstr += `<grid id="infoTargetingGrid"><span>Hits ${this.targetType}.</span>`;
        if (this.allyTargetable && this.opponentTargetable) {
            if (this.frontlineTargetable && this.backlineTargetable) {
                solstr += `<span> Targets frontline and backline.</span>`;
            } else if (this.frontlineTargetable) {
                solstr += `<span> Targets frontline.</span>`;
            } else if (this.backlineTargetable) {
                solstr += `<span> Targets backline.</span>`;
            }
        } else if (this.opponentTargetable) {
            if (this.frontlineTargetable && this.backlineTargetable) {
                solstr += `<span> Targets frontline and backline enemies.</span>`;
            } else if (this.frontlineTargetable) {
                solstr += `<span> Targets frontline enemies.</span>`;
            } else if (this.backlineTargetable) {
                solstr += `<span> Targets backline enemies.</span>`;
            }
        } else if (this.allyTargetable) {
            if (this.frontlineTargetable && this.backlineTargetable) {
                solstr += `<span> Targets frontline and backline allies.</span>`;
            } else if (this.frontlineTargetable) {
                solstr += `<span> Targets frontline allies.</span>`;
            } else if (this.backlineTargetable) {
                solstr += `<span> Targets backline allies.</span>`;
            }
        } else {
            solstr += `<span> Targets nothing.</span>`;
        }

        solstr += `</grid></span>`;

        // damage info
        // NYI: damage += activeCharacter stats
        solstr += `<span id='infoDamage'><span class='infoSectionHeader'>ADDED DAMAGE</span>`;
        solstr += `<grid id='infoDamageGrid'>`;
        solstr += `<span style="font-weight:bold">Material</span>`;
        solstr += `<span>Blunt:<br>${this.damage.blunt.min} - ${this.damage.blunt.max}</span>`;
        solstr += `<span>Pierce:<br>${this.damage.pierce.min} - ${this.damage.pierce.max}</span>`;
        solstr += `<span>Acid:<br>${this.damage.acid.min} - ${this.damage.acid.max}</span>`;

        solstr += `<span style="font-weight:bold">Elemental</span>`;
        solstr += `<span>Fire:<br>${this.damage.fire.min} - ${this.damage.fire.max}</span>`;
        solstr += `<span>Frost:<br>${this.damage.frost.min} - ${this.damage.frost.max}</span>`;
        solstr += `<span>Lightning:<br>${this.damage.lightning.min} - ${this.damage.lightning.max}</span>`;

        solstr += `<span style="font-weight:bold">Occult</span>`;
        solstr += `<span>Sacred:<br>${this.damage.sacred.min} - ${this.damage.sacred.max}</span>`;
        solstr += `<span>Shadow:<br>${this.damage.shadow.min} - ${this.damage.shadow.max}</span>`;
        solstr += `<span>Aether:<br>${this.damage.aether.min} - ${this.damage.aether.max}</span>`;
        solstr += `</grid></span>`;

        return solstr;
    }
}

const attacks = {
    // ##      ## ########    ###    ########   #######  ##    ##  ######
    // ##  ##  ## ##         ## ##   ##     ## ##     ## ###   ## ##    ##
    // ##  ##  ## ##        ##   ##  ##     ## ##     ## ####  ## ##
    // ##  ##  ## ######   ##     ## ########  ##     ## ## ## ##  ######
    // ##  ##  ## ##       ######### ##        ##     ## ##  ####       ##
    // ##  ##  ## ##       ##     ## ##        ##     ## ##   ### ##    ##
    //  ###  ###  ######## ##     ## ##         #######  ##    ##  ######

    // UNARMED
    flick: new Attack({
        name: "Flick",
        family: ["unarmedAttacks"],
        initRecovery: 18,
        wdm: 0.5,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        stun: 5,
        description: "You flick your opponent, causing them to blink in surpise.",
    }),

    gutpunch: new Attack({
        name: "Gut Punch",
        family: ["unarmedAttacks"],
        initRecovery: 23,
        wdm: 1.75,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            blunt: {
                min: 3,
                max: 3,
            },
        },
        stun: 18,
        description: "Slam your fist into the enemy's gut, causing them to crunch over.",
    }),

    doublestrike: new Attack({
        name: "Double Strike",
        wdm: 0.75,
        family: ["unarmedAttacks"],
        initRecovery: 20,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "You hit your enemy for damage twice.",
        hitnumber: 2,
        damage: {
            blunt: {
                min: 3,
                max: 3,
            },
        },
    }),

    amp: new Attack({
        name: "Amped Up",
        family: ["unarmedAttacks"],
        initRecovery: 24,
        type: "buff",
        targetType: "single", // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "You hit your enemy for damage twice.",
        buffs: [buffs.buffAmp],
    }),

    doublelegsweep: new Attack({
        name: "Double Leg Sweep",
        wdm: 0.25,
        family: ["unarmedAttacks"],
        initRecovery: 20,
        targetType: "area",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "You sweep the legs of your foes twice.",
        hitnumber: 2,
        damage: {
            blunt: {
                min: 4,
                max: 4,
            },
        },
        stun: 4,
    }),

    // SPEAR ATTACKS
    stab: new Attack({
        name: "Stab",
        family: ["spearWeaponAttacks"],
        initRecovery: 50,
        wdm: 1.25,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 7,
                max: 13,
            },
        },
        description: "Stab at your foe, doing extra pierce damage.",
    }),

    // SPEAR ATTACKS
    rapidjab: new Attack({
        name: "Rapid Jab",
        family: ["spearWeaponAttacks"],
        initRecovery: 50,
        wdm: 0.75,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        hitnumber: 3,
        damage: {
            pierce: {
                min: 4,
                max: 7,
            },
        },
        description: "Rapidly jab at your foe three times.",
    }),

    sweep: new Attack({
        name: "Sweep",
        family: ["spearWeaponAttacks"],
        initRecovery: 50,
        wdm: 1.25,
        targetType: "area",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 7,
                max: 13,
            },
        },
        description: "Sweep at the foes in front of you.",
    }),

    // TODO: Buff this and apply it to the unmade short spear class.
    // TODO: Made new Attack that counter attacks when allies (but not self) is hit.
    spearposture: new Attack({
        name: "Posture",
        family: ["spearWeaponAttacks"],
        initRecovery: 24,
        type: "buff",
        targetType: "single", // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "You posture yourself, making it harder to hit you.",
        buffs: [buffs.buffSpearPosture],
    }),

    // CHAOTIC SPEAR ATTACKS
    chaoschuck: new Attack({
        name: "Chaos Chuck",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 50,
        wdm: 2,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Chuck your chaos spear at an enemy.",
    }),

    chaoticsacrifice: new Attack({
        name: "Chaotic Sacrifice",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 50,
        type: "buff",
        targetType: "single", // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Sacrifice 10% of your current life to buff your occult damage.",
        buffs: [buffs.buffSacrificeToChaos],
    }),

    unerringbolt: new Attack({
        name: "Unerring Bolt",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 1.25,
        initRecovery: 50,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Turns your spear into a chaotic bolt, which your opponent cannot deflect.",
        isDeflectable: false,
    }),

    backlinebolts: new Attack({
        name: "Backline Bolts",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 0.25,
        initRecovery: 56,
        targetType: "area",
        frontlineTargetable: false,
        backlineTargetable: true,
        description: "Hits the enemy backline with a dose of lightning and aether.",
        damage: {
            aether: {
                min: 4,
                max: 6,
            },
            lightning: {
                min: 4,
                max: 6,
            },
        },
    }),

    // SHIELD PORTION OF X AND SHIELDS
    shieldposture: new Attack({
        name: "Posture",
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks"],
        initRecovery: 24,
        type: "buff",
        targetType: "single", // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "You posture yourself, increasing your block.",
        buffs: [buffs.buffShieldPosture],
    }),

    shieldbash: new Attack({
        name: "Shield Bash",
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Bash your shield at the enemy with an increased chance to direct hit.",
        damage: {
            blunt: {
                min: 3,
                max: 6,
            },
        },
        directChanceBase: 0.6,
        directChanceMore: 1.3,
    }),

    // SWORD PORTION OF SWORD AND SHIELD
    swipe: new Attack({
        name: "Swipe",
        family: ["swordandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Slash your sword at a target.",
        damage: {
            pierce: {
                min: 3,
                max: 6,
            },
        },
    }),

    thrust: new Attack({
        name: "Thrust",
        family: ["swordandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description:
            "Thrust your sword at the enemy with an increased chance to critically hit, but also easier to deflect.",
        damage: {
            pierce: {
                min: 3,
                max: 6,
            },
        },
        criticalChanceBase: 0.6,
        criticalChanceMore: 1.3,
        deflectCalculated: -0.25,
        blockCalculated: 0,
    }),

    // MACE PORTION OF MACE AND SHIELD
    bash: new Attack({
        name: "Bash",
        family: ["maceandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Bash your mace at a target, with an increased chance of direct hit.",
        damage: {
            blunt: {
                min: 3,
                max: 6,
            },
        },
        stun: 5,
        directChanceBase: 0.6,
        directChanceMore: 1.3,
    }),

    doublesmash: new Attack({
        name: "Double Smash",
        family: ["maceandshieldWeaponAttacks"],
        initRecovery: 35,
        wdm: 0.75,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Smash your target twice.",
        damage: {
            blunt: {
                min: 2,
                max: 4,
            },
        },
        hitnumber: 2,
    }),

    // TWO HANDED AXE
    whirlwind: new Attack({
        name: "Whirlwind",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 55,
        wdm: 0.25,
        targetType: "area",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Spin yourself around twice and hit foes multiple times.",
        hitnumber: 2,
        buffs: [buffs.debuffBleed],
    }),

    wideslash: new Attack({
        name: "Wide Slash",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 34,
        wdm: 0.75,
        targetType: "area",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Slash at all the enemies in front of you.",
        damage: {
            pierce: {
                min: 2,
                max: 4,
            },
        },
        buffs: [buffs.debuffBleed],
    }),

    overheadchop: new Attack({
        name: "Overhead Chop",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 50,
        wdm: 2,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "Deliver a critical overhead chop to the enemy.",
        damage: {
            pierce: {
                min: 2,
                max: 4,
            },
        },
        buffs: [buffs.debuffBleed],
        criticalChanceBase: 0.6,
        criticalChanceMore: 1.3,
        deflectCalculated: -0.25,
    }),

    lumberjackstance: new Attack({
        name: "Lumberjack Stance",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 24,
        type: "buff",
        targetType: "single", // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Buff yourself to deal more pierce damage.",
        buffs: [buffs.buffLumberjackStance],
    }),

    // ######## ##    ## ######## ##     ##  ####  ########  ######
    // ##       ###   ## ##       ###   ###   ##   ##       ##    ##
    // ##       ####  ## ##       #### ####   ##   ##       ##
    // ######   ## ## ## ######   ## ### ##   ##   ######    ######
    // ##       ##  #### ##       ##     ##   ##   ##             ##
    // ##       ##   ### ##       ##     ##   ##   ##       ##    ##
    // ######## ##    ## ######## ##     ##  ####  ########  ######

    // Spider
    vilebite: new Attack({
        name: "Vile Bite",
        family: ["Spider"],
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 8,
                max: 12,
            },
            acid: {
                min: 8,
                max: 12,
            },
        },
        description: "A vile bite, inflicting pierce and acid damage.",
    }),

    webshot: new Attack({
        name: "Web Shot",
        type: "spell",
        family: ["Spider"],
        targetType: "area",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: true,
        damage: {
            frost: {
                min: 2,
                max: 4,
            },
            acid: {
                min: 2,
                max: 4,
            },
        },
        description: "A gooey web that slows down the opponent.",
        // TODO: Add debuff
    }),

    eightleggedrush: new Attack({
        name: "Eight Legged Rush",
        family: ["Spider"],
        initRecovery: 80,
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            blunt: {
                min: 13,
                max: 19,
            },
        },
        description: "A spider's tackle.",
    }),

    // Hog
    hogrush: new Attack({
        name: "Hog Rush",
        family: ["Hog"],
        initRecovery: "80",
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            blunt: {
                min: 9,
                max: 13,
            },
        },
        description: "A hog's tackle.",
    }),

    hoggore: new Attack({
        name: "Hog Gore",
        family: ["Hog"],
        initRecovery: "72",
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 11,
                max: 14,
            },
        },
        description: "The hog impales it's enemy with it's tusks.",
    }),

    // Carbuncle
    cuddlebutt: new Attack({
        name: "Cuddle Butt",
        family: ["Carbuncle"],
        initRecovery: "16",
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            blunt: {
                min: 3,
                max: 5,
            },
        },
        description: "An adorable little attack that inspires awh in its enemies.",
    }),

    crystalshot: new Attack({
        name: "Crystal Shot",
        type: "spell",
        family: ["Carbuncle"],
        initRecovery: "36",
        targetType: "single",
        allyTargetable: false,
        opponentTargetable: true,
        frontlineTargetable: true,
        backlineTargetable: true,
        damage: {
            pierce: {
                min: 7,
                max: 10,
            },
        },
        description: "A piercing candle stick's worth of crystal is summoned and shot through the air.",
    }),
};

/**
 * Group up attacks of the same family so we can easily add them to
 * enemies and players.
 */
const familyAttacks = {};
for (let key in attacks) {
    if (attacks[key].family) {
        for (let idx in attacks[key].family) {
            if (!familyAttacks[attacks[key].family[idx]]) {
                familyAttacks[attacks[key].family[idx]] = [];
            }

            familyAttacks[attacks[key].family[idx]].push(attacks[key]);
        }
    }
}

// Add attacks to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.attacks = attacks;
    S.COM.familyAttacks = familyAttacks;
})(setup);
