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
        family: "unarmedAttacks",
        initRecovery: 18,
        wdm: 0.5,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            pierce: {
                min: 1,
                max: 1
            }
        },
        stun: 5,
        description: "You flick your opponent, causing them to blink in surpise.",
    }),

    gutpunch: new Attack({
        name: "Gut Punch",
        family: "unarmedAttacks",
        initRecovery: 23,
        wdm: 1.75,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        damage: {
            blunt: {
                min: 3,
                max: 3
            }
        },
        stun: 18,
        description: "Slam your fist into the enemy's gut, causing them to crunch over.",
    }),

    doublestrike: new Attack({
        name: "Double Strike",
        wdm: 0.75,
        family: "unarmedAttacks",
        initRecovery: 20,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "You hit your enemy for damage twice.",
        hitnumber: 2,
        damage: {
            blunt: {
                min: 3,
                max: 3
            }
        },
    }),

    amp: new Attack({
        name: "Amped Up",
        family: "unarmedAttacks",
        initRecovery: 24,
        type: "buff",
        targetType: "single",  // TOOD: Add "self"
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
        family: "unarmedAttacks",
        initRecovery: 20,
        targetType: "area",
        frontlineTargetable: true,
        backlineTargetable: false,
        description: "You sweep the legs of your foes twice.",
        hitnumber: 2,
        damage: {
            blunt: {
                min: 4,
                max: 4
            }
        },
        stun: 4
    }),

    // SPEAR ATTACKS
    stab: new Attack({
        name: "Stab",
        family: "spearWeaponAttacks",
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
        family: "spearWeaponAttacks",
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
        family: "spearWeaponAttacks",
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
    posture: new Attack({
        name: "Posture",
        family: "spearWeaponAttacks",
        initRecovery: 24,
        type: "buff",
        targetType: "single",  // TOOD: Add "self"
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
        family: "chaoticspearWeaponAttacks",
        initRecovery: 50,
        wdm: 2,
        targetType: "single",
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Chuck your chaos spear at an enemy.",
    }),

    chaoticsacrifice: new Attack({
        name: "Chaotic Sacrifice",
        family: "chaoticspearWeaponAttacks",
        initRecovery: 50,
        type: "buff",
        targetType: "single",  // TOOD: Add "self"
        allyTargetable: true,
        opponentTargetable: false,
        frontlineTargetable: true,
        backlineTargetable: true,
        description: "Sacrifice 10% of your current life to buff your occult damage.",
        buffs: [buffs.buffSacrificeToChaos],
    }),

    unerringbolt: new Attack({
        name: "Unerring Bolt",
        family: "chaoticspearWeaponAttacks",
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
        family: "chaoticspearWeaponAttacks",
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
            }
        }
    }),

    // ######## ##    ## ######## ##     ## ##    ##       ###    ######## ########    ###     ######  ##    ##  ######  
    // ##       ###   ## ##       ###   ###  ##  ##       ## ##      ##       ##      ## ##   ##    ## ##   ##  ##    ## 
    // ##       ####  ## ##       #### ####   ####       ##   ##     ##       ##     ##   ##  ##       ##  ##   ##       
    // ######   ## ## ## ######   ## ### ##    ##       ##     ##    ##       ##    ##     ## ##       #####     ######  
    // ##       ##  #### ##       ##     ##    ##       #########    ##       ##    ######### ##       ##  ##         ## 
    // ##       ##   ### ##       ##     ##    ##       ##     ##    ##       ##    ##     ## ##    ## ##   ##  ##    ## 
    // ######## ##    ## ######## ##     ##    ##       ##     ##    ##       ##    ##     ##  ######  ##    ##  ######  

    // Spider
    vilebite: new Attack({
        name: "Vile Bite",
        family: "Spider",
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
        family: "Spider",
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
        family: "Spider",
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
        family: "Hog",
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
        family: "Hog",
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
        family: "Carbuncle",
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
        family: "Carbuncle",
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
        if (!familyAttacks[attacks[key].family]) {
            familyAttacks[attacks[key].family] = [];
        }

        familyAttacks[attacks[key].family].push(attacks[key]);
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
