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

        // TODO: Error checking on targets.
        if (this.targets.style === null) {
            console.error(`Attack: ${this.name} has no targets.style.`);
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
    getInfo(attacker) {
        let solstr = `<span id="AttackInformationPlate">`;

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

        // TODO: Targets Information

        // solstr += `</grid></span>`;

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

        solstr += `</span>`;

        return solstr;
    }
}

// TODO: All attacks should have a `dealsElement` bool. If false, character/equipment stuff doesn't apply to that element.
const attacks = {
    // ##      ## ########    ###    ########   #######  ##    ##  ######
    // ##  ##  ## ##         ## ##   ##     ## ##     ## ###   ## ##    ##
    // ##  ##  ## ##        ##   ##  ##     ## ##     ## ####  ## ##
    // ##  ##  ## ######   ##     ## ########  ##     ## ## ## ##  ######
    // ##  ##  ## ##       ######### ##        ##     ## ##  ####       ##
    // ##  ##  ## ##       ##     ## ##        ##     ## ##   ### ##    ##
    //  ###  ###  ######## ##     ## ##         #######  ##    ##  ######

    /*
     * Yb        dP .o.     8888b.  888888 88""Yb 88   88  dP""b8
     *  Yb  db  dP  `"'      8I  Yb 88__   88__dP 88   88 dP   `"
     *   YbdPYbdP   .o.      8I  dY 88""   88""Yb Y8   8P Yb  "88
     *    YP  YP    `"'     8888Y"  888888 88oodP `YbodP'  YboodP
     */
    all: new Attack({
        name: "Hits All",
        family: ["debugAttacks"],
        targets: {
            style: "all",
            side: null,
            row: null,
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        type: "buff",
        buffs: [buffs.buffAmp],
        description: "DEBUG: You hit everyone applying a strong buff.",
    }),

    enemyside: new Attack({
        name: "Hit Enemy Side",
        family: ["debugAttacks"],
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every enemy.",
    }),

    allyside: new Attack({
        name: "Hit Ally Side",
        family: ["debugAttacks"],
        targets: {
            style: "side",
            side: "ally",
            row: null,
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every ally.",
    }),

    enemyrow: new Attack({
        name: "Hit Enemy Row",
        family: ["debugAttacks"],
        targets: {
            style: "row",
            side: "enemy",
            row: "both",
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every enemy in the specified row.",
    }),

    allyrow: new Attack({
        name: "Hit Ally Row",
        family: ["debugAttacks"],
        targets: {
            style: "row",
            side: "ally",
            row: "both",
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every ally in the specified row.",
    }),

    anyattack: new Attack({
        name: "Hit Any Single",
        family: ["debugAttacks"],
        targets: {
            style: "single",
            side: "both",
            row: "both",
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every ally in the specified row.",
    }),

    selfattack: new Attack({
        name: "Hit Self",
        family: ["debugAttacks"],
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "DEBUG: You hit every ally in the specified row.",
    }),

    /*
     * Yb        dP .o.     88   88 88b 88    db    88""Yb 8b    d8 888888 8888b.
     *  Yb  db  dP  `"'     88   88 88Yb88   dPYb   88__dP 88b  d88 88__    8I  Yb
     *   YbdPYbdP   .o.     Y8   8P 88 Y88  dP__Yb  88"Yb  88YbdP88 88""    8I  dY
     *    YP  YP    `"'     `YbodP' 88  Y8 dP""""Yb 88  Yb 88 YY 88 888888 8888Y"
     */
    flick: new Attack({
        name: "Flick",
        family: ["unarmedAttacks"],
        initRecovery: 18,
        wdm: 0.5,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You hit your enemy for damage twice.",
        buffs: [buffs.buffAmp],
    }),

    doublelegsweep: new Attack({
        name: "Double Leg Sweep",
        wdm: 0.25,
        family: ["unarmedAttacks"],
        initRecovery: 20,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
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

    /*
     * Yb        dP .o.     .dP"Y8 88""Yb 888888    db    88""Yb
     *  Yb  db  dP  `"'     `Ybo." 88__dP 88__     dPYb   88__dP
     *   YbdPYbdP   .o.     o.`Y8b 88"""  88""    dP__Yb  88"Yb
     *    YP  YP    `"'     8bodP' 88     888888 dP""""Yb 88  Yb
     */
    stab: new Attack({
        name: "Stab",
        family: ["spearWeaponAttacks"],
        initRecovery: 50,
        wdm: 1.25,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 7,
                max: 13,
            },
        },
        description: "Sweep at the foes in front of you.",
    }),
    // TODO: Made new Attack that counter attacks when allies (but not self) is hit.
    spearposture: new Attack({
        name: "Posture",
        family: ["spearWeaponAttacks"],
        initRecovery: 24,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You posture yourself, making it harder to hit you.",
        buffs: [buffs.buffSpearPosture],
    }),

    // CHAOTIC SPEAR ATTACKS
    chaoschuck: new Attack({
        name: "Chaos Chuck",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 50,
        wdm: 2,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        description: "Chuck your chaos spear at an enemy.",
    }),

    chaoticsacrifice: new Attack({
        name: "Chaotic Sacrifice",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 50,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Sacrifice 10% of your current life to buff your occult damage.",
        buffs: [buffs.buffSacrificeToChaos],
    }),

    unerringbolt: new Attack({
        name: "Unerring Bolt",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 1.25,
        initRecovery: 50,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        description: "Turns your spear into a chaotic bolt, which your opponent cannot deflect.",
        isDeflectable: false,
    }),

    backlinebolts: new Attack({
        name: "Backline Bolts",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 0.25,
        initRecovery: 56,
        targets: {
            style: "single",
            side: "enemy",
            row: "back",
        },
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

    /*
     * Yb        dP .o.     .dP"Y8 88  88 88 888888 88     8888b.
     *  Yb  db  dP  `"'     `Ybo." 88  88 88 88__   88      8I  Yb
     *   YbdPYbdP   .o.     o.`Y8b 888888 88 88""   88  .o  8I  dY
     *    YP  YP    `"'     8bodP' 88  88 88 888888 88ood8 8888Y"
     */
    shieldposture: new Attack({
        name: "Posture",
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks"],
        initRecovery: 24,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You posture yourself, increasing your block.",
        buffs: [buffs.buffShieldPosture],
    }),

    shieldbash: new Attack({
        name: "Shield Bash",
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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

    /*
     * Yb        dP .o.     .dP"Y8 Yb        dP  dP"Yb  88""Yb 8888b.      .dP"Y8 88  88 88 888888 88     8888b.
     *  Yb  db  dP  `"'     `Ybo."  Yb  db  dP  dP   Yb 88__dP  8I  Yb     `Ybo." 88  88 88 88__   88      8I  Yb
     *   YbdPYbdP   .o.     o.`Y8b   YbdPYbdP   Yb   dP 88"Yb   8I  dY     o.`Y8b 888888 88 88""   88  .o  8I  dY
     *    YP  YP    `"'     8bodP'    YP  YP     YbodP  88  Yb 8888Y"      8bodP' 88  88 88 888888 88ood8 8888Y"
     */
    swipe: new Attack({
        name: "Swipe",
        family: ["swordandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        deflectCalculated: -0.25, // TODO: This stat and below should be fully integrated into the calculation for the enemy, not calculated here.
        blockCalculated: 0,
    }),

    /*
     * Yb        dP .o.     8b    d8    db     dP""b8 888888     .dP"Y8 88  88 88 888888 88     8888b.
     *  Yb  db  dP  `"'     88b  d88   dPYb   dP   `" 88__       `Ybo." 88  88 88 88__   88      8I  Yb
     *   YbdPYbdP   .o.     88YbdP88  dP__Yb  Yb      88""       o.`Y8b 888888 88 88""   88  .o  8I  dY
     *    YP  YP    `"'     88 YY 88 dP""""Yb  YboodP 888888     8bodP' 88  88 88 888888 88ood8 8888Y"
     */
    bash: new Attack({
        name: "Bash",
        family: ["maceandshieldWeaponAttacks"],
        initRecovery: 29,
        wdm: 1,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        description: "Smash your target twice.",
        damage: {
            blunt: {
                min: 2,
                max: 4,
            },
        },
        hitnumber: 2,
    }),

    /*
     * Yb        dP .o.     oP"Yb. 88  88        db    Yb  dP 888888
     *  Yb  db  dP  `"'     "' dP' 88  88       dPYb    YbdP  88__
     *   YbdPYbdP   .o.       dP'  888888      dP__Yb   dPYb  88""
     *    YP  YP    `"'     .d8888 88  88     dP""""Yb dP  Yb 888888
     */
    whirlwind: new Attack({
        name: "Whirlwind",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 55,
        wdm: 0.25,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
        description: "Spin yourself around twice and hit foes multiple times.",
        hitnumber: 2,
        buffs: [buffs.debuffBleed],
    }),

    wideslash: new Attack({
        name: "Wide Slash",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 34,
        wdm: 0.75,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
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
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Buff yourself to deal more pierce damage.",
        buffs: [buffs.buffLumberjackStance],
    }),

    /*
     * 88""Yb  dP"Yb  Yb        dP
     * 88__dP dP   Yb  Yb  db  dP
     * 88""Yb Yb   dP   YbdPYbdP
     * 88oodP  YbodP     YP  YP
     */

    snipe: new Attack({
        name: "Snipe",
        family: ["bowWeaponAttacks"],
        initRecovery: 58,
        wdm: 2.5,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        description: "Snipe your enemy.",
        damage: {
            pierce: {
                min: 4,
                max: 7,
            },
        },
        criticalChanceBase: 0.6,
        criticalChanceMore: 1.3,
    }),

    rainofarrows: new Attack({
        name: "Rain of Arrows",
        family: ["bowWeaponAttacks"],
        initRecovery: 51,
        wdm: 0.5,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        description: "Rain arrows onto your enemy.",
        damage: {
            pierce: {
                min: 4,
                max: 7,
            },
        },
        criticalChanceBase: 0.6,
        criticalChanceMore: 1.3,
    }),

    checkquiver: new Attack({
        name: "Check Quver",
        family: ["bowWeaponAttacks"],
        initRecovery: 21,
        wdm: 0,
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Ensure everything is correct with your ammo, increasing your action speed.",
        buffs: [buffs.buffCheckQuiver],
    }),

    sharptiparrows: new Attack({
        name: "Switch to Sharp-Tip Arrows",
        family: ["bowWeaponAttacks"],
        initRecovery: 27,
        wdm: 0,
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Switch to Sharp-Tip Arrows, increasing your chance to critically hit.",
        buffs: [buffs.buffSharpTipArrows],
    }),

    // ######## ##    ## ######## ##     ##  ####  ########  ######
    // ##       ###   ## ##       ###   ###   ##   ##       ##    ##
    // ##       ####  ## ##       #### ####   ##   ##       ##
    // ######   ## ## ## ######   ## ### ##   ##   ######    ######
    // ##       ##  #### ##       ##     ##   ##   ##             ##
    // ##       ##   ### ##       ##     ##   ##   ##       ##    ##
    // ######## ##    ## ######## ##     ##  ####  ########  ######

    /*
     *  888888    db    88   88 88b 88    db
     *  88__     dPYb   88   88 88Yb88   dPYb
     *  88""    dP__Yb  Y8   8P 88 Y88  dP__Yb
     *  88     dP""""Yb `YbodP' 88  Y8 dP""""Yb
     */
    // mommySpider
    VILE_BITE: new Attack({
        wdm: 2,
        name: "Vile Bite",
        initRecovery: 21,
        family: ["mommySpider"],
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 4,
                max: 6,
            },
            acid: {
                min: 4,
                max: 6,
            },
        },
        description: "A vile bite, inflicting pierce and acid damage.",
    }),

    // Spell
    WEB_SHOT: new Attack({
        wdm: 0,
        name: "Web Shot",
        type: "spell",
        family: ["mommySpider"],
        initRecovery: 42,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            frost: {
                min: 6,
                max: 8,
            },
            acid: {
                min: 6,
                max: 8,
            },
        },
        description: "A gooey web that slows down the opponent.",
        buffs: [buffs.debuffWebShot],
    }),

    EIGHT_LEGGED_RUSH: new Attack({
        wdm: 0.5,
        name: "Eight Legged Rush",
        family: ["mommySpider"],
        initRecovery: 80,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            blunt: {
                min: 9,
                max: 15,
            },
        },
        description: "The spider rushes through your party.",
    }),

    CREEPY_CRAWLIES: new Attack({
        name: "Creepy Crawlies",
        family: ["babySpider"],
        initRecovery: 31,
        stun: 1,
        hitnumber: 2,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            blunt: {
                min: 1,
                max: 3,
            },
        },
        description: "Ew! The little baby spider is crawling on you!",
    }),

    HOG_RUSH: new Attack({
        name: "Hog Rush",
        family: ["Hog"],
        initRecovery: "60",
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            blunt: {
                min: 13,
                max: 18,
            },
        },
        description: "A hog's tackle.",
    }),

    HOG_GORE: new Attack({
        name: "Hog Gore",
        wdm: 1.25,
        family: ["Hog"],
        initRecovery: "42",
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 11,
                max: 14,
            },
        },
        description: "The hog impales it's enemy with it's tusks, causing bleeding",
        buffs: [buffs.debuffBleed],
    }),

    // Spell
    HOG_ROAR: new Attack({
        name: "Hog Gore",
        wdm: 0,
        family: ["Hog"],
        initRecovery: "42",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "The hog roars, increasing it's material resistance.",
        buffs: [buffs.buffHogRoar],
    }),

    /*
     *  dP""b8    db    88""Yb 88""Yb 88   88 88b 88  dP""b8 88     888888 .dP"Y8
     * dP   `"   dPYb   88__dP 88__dP 88   88 88Yb88 dP   `" 88     88__   `Ybo."
     * Yb       dP__Yb  88"Yb  88""Yb Y8   8P 88 Y88 Yb      88  .o 88""   o.`Y8b
     *  YboodP dP""""Yb 88  Yb 88oodP `YbodP' 88  Y8  YboodP 88ood8 888888 8bodP'
     */
    cuddlebutt: new Attack({
        name: "Cuddle Butt",
        family: ["Carbuncle"],
        initRecovery: "16",
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            blunt: {
                min: 3,
                max: 5,
            },
        },
        description: "An adorable little attack that inspires awe in its enemies.",
    }),

    // Spell
    crystalshot: new Attack({
        wdm: 0,
        name: "Crystal Shot",
        type: "spell",
        family: ["Carbuncle"],
        initRecovery: "36",
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        damage: {
            pierce: {
                min: 9,
                max: 14,
            },
        },
        description: "A piercing candle stick's worth of crystal is summoned and shot through the air.",
    }),

    // Spell
    acidicshot: new Attack({
        wdm: 0,
        name: "Acid Crystal Shot",
        type: "spell",
        family: [],
        initRecovery: "34",
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        damage: {
            acid: {
                min: 9,
                max: 14,
            },
        },
        description: "An acidic bolt.",
    }),

    // Spell
    rockfall: new Attack({
        wdm: 0,
        name: "Rock Fall",
        type: "spell",
        family: [],
        initRecovery: "50",
        hitnumber: 3,
        targets: {
            style: "row",
            side: "enemy",
            row: "both",
        },
        damage: {
            blunt: {
                min: 4,
                max: 7,
            },
        },
        deflectCalculated: -0.5,
        description: "An avalanche of rocks falls on the enemy. Easily deflected.",
    }),

    // Spell
    firewall: new Attack({
        wdm: 0,
        name: "Fire Wall",
        type: "spell",
        family: [],
        initRecovery: "45",
        targets: {
            style: "row",
            side: "enemy",
            row: "both",
        },
        damage: {
            fire: {
                min: 5,
                max: 9,
            },
        },
        description: "Blazes a wall of fire on your enemies.",
        buffs: [buffs.debuffFirewall],
    }),

    // Spell
    iceprison: new Attack({
        wdm: 0,
        name: "Ice Prison",
        type: "spell",
        family: [],
        initRecovery: "65",
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        damage: {
            frost: {
                min: 5,
                max: 9,
            },
        },
        description: "Freezes one of your units, lowering their action speed.",
        buffs: [buffs.debuffIcePrison],
    }),

    // Spell
    flash: new Attack({
        wdm: 0,
        name: "Flash",
        type: "spell",
        family: [],
        initRecovery: "25",
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            lightning: {
                min: 1,
                max: 1,
            },
        },
        description: "A bright light momentarily blinds the enemy..",
        stun: 5,
    }),

    /*
     * .dP"Y8 88  dP 888888 88     888888 888888  dP"Yb  88b 88 .dP"Y8
     * `Ybo." 88odP  88__   88     88__     88   dP   Yb 88Yb88 `Ybo."
     * o.`Y8b 88"Yb  88""   88  .o 88""     88   Yb   dP 88 Y88 o.`Y8b
     * 8bodP' 88  Yb 888888 88ood8 888888   88    YbodP  88  Y8 8bodP'
     */

    // Spell
    rattle: new Attack({
        wdm: 0,
        name: "Rattle",
        type: "spell",
        family: ["Skeleton"],
        initRecovery: "25",
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        description: "Strikes fear into the hearts of your enemies, lowering their blunt resistance.",
        buffs: [buffs.debuffRattle],
    }),

    cackle: new Attack({
        wdm: 0,
        name: "Cackle",
        type: "spell",
        family: ["Skeleton"],
        initRecovery: "28",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Cackle in your madness, buffing your blunt damage.",
        buffs: [buffs.buffCackle],
    }),

    /*
     * .dP"Y8    db    88   88 .dP"Y8  dP"Yb  88b 88
     * `Ybo."   dPYb   88   88 `Ybo." dP   Yb 88Yb88
     * o.`Y8b  dP__Yb  Y8   8P o.`Y8b Yb   dP 88 Y88
     * 8bodP' dP""""Yb `YbodP' 8bodP'  YbodP  88  Y8
     */
    // Spell
    healUndead: new Attack({
        wdm: 0,
        name: "Heal Undead",
        type: "spell",
        family: ["Skeleton"],
        initRecovery: "32",
        targets: {
            style: "all",
            side: null,
            row: null,
        },
        description: "Heals all undead units in combat by 20%.",
        buffs: [buffs.buffHealUndead],
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
