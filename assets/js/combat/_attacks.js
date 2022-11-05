/**
 * There are currently no Attack methods, it is just used as a constructor to easily make new attacks.
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
    }),

    sweep: new Attack({
        name: "Sweep",
        family: "spearWeaponAttacks",
        buffs: [buffs.buffTESTING],
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
    }),

    // ENEMY ATTACKS
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
    }),

    webshot: new Attack({
        name: "Web Shot",
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
    }),

    crystalshot: new Attack({
        name: "Crystal Shot",
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
