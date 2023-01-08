/**
 *
 */
class Attack {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_ATTACK, obj);

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
        let dmg = this.damage;
        let solstr = `<span id="AttackInformationPlate">`;

        /**
         * Miscellanious Information
         */
        solstr += `<span id='infoName'>${this.name} <span id='infoVariant'>#${this.type.toUpperCase()}</span></span>`;
        solstr += `<span id='infoAttackDescription'>${this.description}</span>`;
        solstr += `<span class='divider'></span>`;

        /**
         * Metrics Information
         */
        solstr += `<span id='infoMetrics'><span class='infoSectionHeader'>METRICS</span>`;
        solstr += `<grid id='infoMetricsAttacksGrid'>`;

        // WDM & Init
        solstr += `<span id='infoWDM'>WDM<br>${Math.floor(this.wdm * 100)}%</span>`;
        solstr += `<span id='init'>Recovery<br>+${Math.ceil(
            this.initRecovery * attacker.initRecoveryModifier
        )}<span class='infoMax'> init</span></span>`;
        // NYI Init Recovery Variance
        // <span class='infoMax'>±${Math.ceil(this.initRecoveryVariance * this.initRecovery * attacker.initRecoveryModifier)}</span>

        // Crit & Direct & Targets
        // Crit
        let iCritChance = Math.ceil(
            (this.criticalChanceBase + attacker.criticalChanceBase) *
                (this.criticalChanceIncreased + attacker.criticalChanceIncreased) *
                (this.criticalChanceMore * attacker.criticalChanceMore) *
                100
        );
        let iCritDamage = `<span class='infoMax'>${+(
            (this.criticalDamageBase + attacker.criticalDamageBase) *
            (this.criticalDamageIncreased + attacker.criticalDamageIncreased) *
            (this.criticalDamageMore * attacker.criticalDamageMore)
        ).toFixed(2)}x</span>`;
        if (iCritChance <= 5) {
            solstr += `<span id='infoCrit' class='infoDarkGrey'>Critical<br>${iCritChance}%<br>${iCritDamage}</span>`;
        } else {
            solstr += `<span id='infoCrit'>Critical<br>${iCritChance}%<br>${iCritDamage}</span>`;
        }

        // Direct
        let iDirectChance = Math.ceil(
            (this.directChanceBase + attacker.directChanceBase) *
                (this.directChanceIncreased + attacker.directChanceIncreased) *
                (this.directChanceMore * attacker.directChanceMore) *
                100
        );
        if (iDirectChance <= 5) {
            solstr += `<span id='infoDirect' class='infoDarkGrey'>Direct<br>${iDirectChance}%</span>`;
        } else {
            solstr += `<span id='infoDirect'>Direct<br>${iDirectChance}%</span>`;
        }

        // Targets
        let targetStr;
        let targetSide = this.targets.side
            ? this.targets.side.charAt(0).toUpperCase() + this.targets.side.slice(1)
            : null;
        let targetRow = this.targets.row ? this.targets.row.charAt(0).toUpperCase() + this.targets.row.slice(1) : null;
        switch (this.targets.style) {
            case "all":
                targetStr = "Targets Everyone";
                break;
            case "side":
                targetStr = `Targets ${targetSide} Side`;
                break;
            case "row":
                targetStr = `Targets ${targetSide} Side's ${targetRow} Row`;
                break;
            case "single":
                targetStr = `Targets an ${targetSide} on the ${targetRow}row`;
                break;
            case "self":
                targetStr = "Targets Self";
                break;
        }
        // TODO: This string is honestly a mess lmao.
        solstr += `<span id='infoTargets'>${targetStr}</span>`;

        solstr += `</grid></span>`;

        /**
         * Special Information
         */
        // Block/Deflect Modifiers
        // If it is unblocked/undeflectable
        // For uncommon stat thingies. "Absorbs Elemental."  We could also put the rarity affix info here?

        // Buffs & Debuffs
        if (this.buffs.length > 0) {
            solstr += `<span id='infoSpecial'><span class='infoSectionHeader'>SPECIAL INFORMATION</span>`;
            solstr += `<grid id='infoSpecialGrid'>`;

            solstr += `<span id='infoBuffs'>Applies ${this.buffs[0].name} to targets.</span>`;

            solstr += `</grid></span>`;
        }

        /**
         * Damage Information
         */
        let totalMin = 0;
        let totalMax = 0;
        function getDmgString(sub, attack) {
            let min = dmg[sub].min + attacker.damage[sub].min;
            let max = dmg[sub].max + attacker.damage[sub].max;
            let increased = dmg[sub].increased + attacker.damage[sub].increased;
            let more = dmg[sub].more * attacker.damage[sub].more;

            let minCalculated = Math.floor(min * (1 + increased) * more * attack.wdm);
            let maxCalculated = Math.ceil(max * (1 + increased) * more * attack.wdm);

            totalMin += minCalculated;
            totalMax += maxCalculated;

            let minstr = +minCalculated.toFixed(2);
            let maxstr = +maxCalculated.toFixed(2);

            // Determine if stats are zero'd.
            let isZeroedClass = "";
            if (minCalculated === 0 && maxCalculated === 0) {
                isZeroedClass = " infoDarkGrey";
            }

            return `class='info${sub.replace(/^\w/, (c) => c.toUpperCase())} ${isZeroedClass}'>${sub.replace(
                /^\w/,
                (c) => c.toUpperCase()
            )}<br>${minstr} - ${maxstr}`;
        }


        totalMin = +totalMin.toFixed(2);
        totalMax = +totalMax.toFixed(2);

        let iBluntDmg = getDmgString("blunt", this);
        let iPierceDmg = getDmgString("pierce", this);
        let iAcidDmg = getDmgString("acid", this);
        let iFireDmg = getDmgString("fire", this);
        let iFrostDmg = getDmgString("frost", this);
        let iLightningDmg = getDmgString("lightning", this);
        let iShadowDmg = getDmgString("shadow", this);
        let iSacredDmg = getDmgString("sacred", this);
        let iAetherDmg = getDmgString("aether", this);

        solstr += `<span id='infoDamage'><span class='infoSectionHeader'>Damage</span>`;
        solstr += `<grid id='infoDamageGrid'>`;

        if (totalMin !== 0 || totalMax !== 0) {
            // Total
            solstr += `<span id='infoDamageTotal'>Total: ${totalMin} - ${totalMax}</span>`;

            if (this.hitnumber === 1) {
                solstr += `<span id='infoDamageHitNumber' class='infoDarkGrey'>Hits ${this.hitnumber} Time</span>`;
            } else {
                solstr += `<span id='infoDamageHitNumber'>Hits ${this.hitnumber} Times</span>`;
            }

            // Material
            solstr += `<span class='infoMaterial infoUpper'>Material</span>`;
            solstr += `<span ${iBluntDmg}</span>`;
            solstr += `<span ${iPierceDmg}</span>`;
            solstr += `<span ${iAcidDmg}</span>`;

            // Elemental
            solstr += `<span class='infoElemental infoUpper'>Elemental</span>`;
            solstr += `<span ${iFireDmg}</span>`;
            solstr += `<span ${iFrostDmg}</span>`;
            solstr += `<span ${iLightningDmg}</span>`;

            // Occult
            solstr += `<span class='infoOccult infoUpper'>Occult</span>`;
            solstr += `<span ${iShadowDmg}</span>`;
            solstr += `<span ${iSacredDmg}</span>`;
            solstr += `<span ${iAetherDmg}</span>`;
        } else {
            solstr += `<span id='infoDamageTotal' class='infoDarkGrey'>Deals no damage.</span>`;
        }

        solstr += `</grid></span>`;

        return solstr;
    }
}

/**
 * InDev Balance Manifesto:
 * Buffs are 20 recovery.
 * Buffs all are 28 recovery.
 * 
 * All attacks start at 22 recovery.
 * - 4 recovery per 25% wdm less
 * + 2 recovery per 25% wdm more
 * + 4 recovery for every target available.
 * * 1.6 recovery for every additional hit after first
 */
// TODO: All attacks should have a `dealsElement` bool. If false, character/equipment stuff doesn't apply to that element.
const ATTACKS = {
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
        wdm: 0,
        buffs: [BUFFS.buffAmp],
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
        initRecovery: 14,
        wdm: 0.5,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 1,
                max: 2,
            },
        },
        stun: 5,
        description: "You flick your opponent, causing them to blink in surpise.",
    }),

    gutpunch: new Attack({
        name: "Gut Punch",
        family: ["unarmedAttacks"],
        initRecovery: 28,
        wdm: 1.75,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            blunt: {
                min: 4,
                max: 4,
            },
        },
        stun: 18,
        description: "Slam your fist into the enemy's gut, causing them to crunch over.",
    }),

    doublestrike: new Attack({
        name: "Double Strike",
        wdm: 0.75,
        family: ["unarmedAttacks"],
        initRecovery: 25,
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
        wdm: 0,
        family: ["unarmedAttacks"],
        initRecovery: 20,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You hit your enemy for damage twice.",
        buffs: [BUFFS.buffAmp],
    }),

    doublelegsweep: new Attack({
        name: "Double Leg Sweep",
        wdm: 0.25,
        family: ["unarmedAttacks"],
        initRecovery: 22,
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
        initRecovery: 24,
        wdm: 1.25,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 4,
                max: 7,
                increased: 0.5,
            },
        },
        description: "Stab at your foe, doing extra pierce damage.",
    }),

    // SPEAR ATTACKS
    rapidjab: new Attack({
        name: "Rapid Jab",
        family: ["spearWeaponAttacks"],
        initRecovery: 46,
        wdm: 0.75,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        hitnumber: 3,
        damage: {
            pierce: {
                min: 1,
                max: 1,
            },
        },
        description: "Rapidly jab at your foe three times.",
    }),

    sweep: new Attack({
        name: "Sweep",
        family: ["spearWeaponAttacks"],
        initRecovery: 28,
        wdm: 1.25,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 1,
                max: 3,
            },
        },
        description: "Sweep at the foes in front of you.",
    }),

    // TODO: Made new Attack that counter attacks when allies (but not self) is hit.
    spearposture: new Attack({
        wdm: 0,
        name: "Posture",
        family: ["spearWeaponAttacks"],
        initRecovery: 20,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You posture yourself, making it harder to hit you.",
        buffs: [BUFFS.buffSpearPosture],
    }),

    /**
     *  dP""b8 88  88    db     dP"Yb  888888 88  dP""b8     .dP"Y8 88""Yb 888888    db    88""Yb
     * dP   `" 88  88   dPYb   dP   Yb   88   88 dP   `"     `Ybo." 88__dP 88__     dPYb   88__dP
     * Yb      888888  dP__Yb  Yb   dP   88   88 Yb          o.`Y8b 88"""  88""    dP__Yb  88"Yb
     *  YboodP 88  88 dP""""Yb  YbodP    88   88  YboodP     8bodP' 88     888888 dP""""Yb 88  Yb
     */
    chaoschuck: new Attack({
        name: "Chaos Chuck",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 30,
        wdm: 2,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        description: "Chuck your chaos spear at an enemy, dealing increased Occult damage.",
        damage: {
            aether: {
                increased: 0.5,
            },
            shadow: {
                increased: 0.5,
            },
            sacred: {
                increased: 0.5,
            },
        }
    }),

    chaoticsacrifice: new Attack({
        name: "Chaotic Sacrifice",
        family: ["chaoticspearWeaponAttacks"],
        initRecovery: 24,
        wdm: 0,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Sacrifice 10% of your current life to buff your occult damage.",
        buffs: [BUFFS.buffSacrificeToChaos],
    }),

    unerringbolt: new Attack({
        name: "Unerring Bolt",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 1.25,
        initRecovery: 24,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        damage: {
            aether: {
                increased: 1,
            },
            sacred: {
                increased: 0.5,
            },
            shadow: {
                increased: 0.5,
            },
            lightning: {
                increased: 1,
            }
        },
        description: "Turns your spear into a chaotic bolt, which your opponent cannot deflect.",
        isDeflectable: false,
    }),

    backlinebolts: new Attack({
        name: "Backline Bolts",
        family: ["chaoticspearWeaponAttacks"],
        wdm: 0.50,
        initRecovery: 24,
        targets: {
            style: "row",
            side: "enemy",
            row: "back",
        },
        description: "Hits the enemy backline with a dose of lightning and aether.",
        damage: {
            aether: {
                min: 2,
                max: 4,
                increased: 1,
            },
            lightning: {
                min: 2,
                max: 4,
                increased: 1,
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
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks", "shieldWeaponAttacks"],
        initRecovery: 20,
        wdm: 0,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "You posture yourself, increasing your block.",
        buffs: [BUFFS.buffShieldPosture],
    }),

    shieldbash: new Attack({
        name: "Shield Bash",
        family: ["swordandshieldWeaponAttacks", "maceandshieldWeaponAttacks", "shieldWeaponAttacks"],
        initRecovery: 22,
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
                increased: 0.75,
            },
        },
        directChanceBase: 0.06,
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
        initRecovery: 22,
        wdm: 1,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        description: "Slash your sword at a target.",
        damage: {
            pierce: {
                min: 1,
                max: 3,
            },
        },
    }),

    thrust: new Attack({
        name: "Thrust",
        family: ["swordandshieldWeaponAttacks"],
        initRecovery: 22,
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
                min: 1,
                max: 3,
            },
        },
        criticalChanceBase: 0.06,
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
        initRecovery: 22,
        wdm: 1,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        description: "Bash your mace at a target, with an increased chance of direct hit.",
        damage: {
            blunt: {
                min: 2,
                max: 3,
            },
        },
        stun: 5,
        directChanceBase: 0.06,
        directChanceMore: 1.3,
    }),

    doublesmash: new Attack({
        name: "Double Smash",
        family: ["maceandshieldWeaponAttacks"],
        initRecovery: 28,
        wdm: 0.75,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        description: "Smash your target twice.",
        damage: {
            blunt: {
                min: 1,
                max: 2,
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
        initRecovery: 35,
        wdm: 0.25,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
        description: "Spin yourself around thrice and hit foes multiple times.",
        hitnumber: 3,
        buffs: [BUFFS.debuffBleed],
    }),

    wideslash: new Attack({
        name: "Wide Slash",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 22,
        wdm: 0.75,
        targets: {
            style: "row",
            side: "enemy",
            row: "front",
        },
        description: "Slash at all the enemies in front of you.",
        damage: {
            pierce: {
                min: 1,
                max: 2,
                increased: 0.25,
            },
        },
        buffs: [BUFFS.debuffBleed],
    }),

    overheadchop: new Attack({
        name: "Overhead Chop",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 32,
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
        buffs: [BUFFS.debuffBleed],
        criticalChanceBase: 0.06,
        criticalChanceMore: 1.3,
        criticalDamageMore: 1.3,
        deflectCalculated: -0.25,
    }),

    lumberjackstance: new Attack({
        name: "Lumberjack Stance",
        family: ["twohandedaxeWeaponAttacks"],
        initRecovery: 20,
        wdm: 0,
        type: "buff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Buff yourself to deal more pierce damage.",
        buffs: [BUFFS.buffLumberjackStance],
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
        initRecovery: 32,
        wdm: 2.25,
        targets: {
            style: "single",
            side: "enemy",
            row: "both",
        },
        description: "Snipe your enemy.",
        damage: {
            pierce: {
                min: 1,
                max: 3,
                increased: .25,
            },
        },
        criticalChanceBase: 0.06,
        criticalChanceMore: 1.3,
    }),

    rainofarrows: new Attack({
        name: "Rain of Arrows",
        family: ["bowWeaponAttacks"],
        initRecovery: 22,
        wdm: 0.5,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        description: "Rain arrows onto your enemy.",
        damage: {
            pierce: {
                min: 1,
                max: 3,
            },
        },
    }),

    checkquiver: new Attack({
        name: "Check Quiver",
        family: ["bowWeaponAttacks"],
        initRecovery: 20,
        wdm: 0,
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        type: "buff",
        description: "Ensure everything is correct with your ammo, increasing your action speed.",
        buffs: [BUFFS.buffCheckQuiver],
    }),

    sharptiparrows: new Attack({
        name: "Sharp-Tip Arrows",
        family: ["bowWeaponAttacks"],
        initRecovery: 24,
        wdm: 0,
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        type: "buff",
        description: "Switch to Sharp-Tip Arrows, increasing your chance to critically hit.",
        buffs: [BUFFS.buffSharpTipArrows],
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
        initRecovery: 22,
        family: ["mommySpider", "Ghoul"],
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                min: 1,
                max: 2,
                increased: 1.75,
            },
            acid: {
                min: 1,
                max: 2,
                increased: 1.75,
            },
        },
        buffs: [BUFFS.debuffPoisoned],
        description: "A vile bite, inflicting pierce and acid damage.",
    }),

    // Spell
    WEB_SHOT: new Attack({
        wdm: 0,
        name: "Web Shot",
        type: "spell",
        family: ["mommySpider"],
        initRecovery: 16,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            frost: {
                min: 6,
                max: 9,
            },
            acid: {
                min: 6,
                max: 9,
            },
        },
        description: "A gooey web that slows down the opponent.",
        buffs: [BUFFS.debuffWebShot],
    }),

    EIGHT_LEGGED_RUSH: new Attack({
        wdm: 2,
        name: "Eight Legged Rush",
        family: ["mommySpider"],
        initRecovery: 34,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            blunt: {
                increased: 1.25,
            },
        },
        description: "The spider rushes through your party.",
    }),

    CREEPY_CRAWLIES: new Attack({
        name: "Creepy Crawlies",
        family: ["babySpider"],
        initRecovery: 35,
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
        initRecovery: 22,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            blunt: {
                increased: 1.25,
            },
        },
        description: "A hog's tackle.",
    }),

    HOG_GORE: new Attack({
        name: "Hog Gore",
        wdm: 1.25,
        family: ["Hog"],
        initRecovery: 24,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            pierce: {
                increased: 1.25,
            },
        },
        description: "The hog impales it's enemy with it's tusks, causing bleeding",
        buffs: [BUFFS.debuffBleed],
    }),

    HOG_ROAR: new Attack({
        name: "Hog Gore",
        wdm: 0,
        family: ["Hog"],
        type: "buff",
        initRecovery: 20,
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "The hog roars, increasing it's material resistance.",
        buffs: [BUFFS.buffHogRoar],
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
        initRecovery: 22,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        damage: {
            blunt: {
                min: 1,
                max: 2,
                increased: 0.5,
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
        initRecovery: 14,
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
        initRecovery: 14,
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
        initRecovery: 41,
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
        initRecovery: 18,
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
        buffs: [BUFFS.debuffFirewall],
    }),

    // Spell
    iceprison: new Attack({
        wdm: 0,
        name: "Ice Prison",
        type: "spell",
        family: [],
        initRecovery: 28,
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
        buffs: [BUFFS.debuffIcePrison],
    }),

    // Spell
    flash: new Attack({
        wdm: 0,
        name: "Flash",
        type: "spell",
        family: [],
        initRecovery: 28,
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
        stun: 7,
    }),

    /*
     * .dP"Y8 88  dP 888888 88     888888 888888  dP"Yb  88b 88 .dP"Y8
     * `Ybo." 88odP  88__   88     88__     88   dP   Yb 88Yb88 `Ybo."
     * o.`Y8b 88"Yb  88""   88  .o 88""     88   Yb   dP 88 Y88 o.`Y8b
     * 8bodP' 88  Yb 888888 88ood8 888888   88    YbodP  88  Y8 8bodP'
     */
    rattle: new Attack({
        wdm: 0,
        name: "Rattle",
        type: "debuff",
        family: ["Skeleton"],
        initRecovery: 28,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        description: "Strikes fear into the hearts of your enemies, lowering their blunt resistance.",
        buffs: [BUFFS.debuffRattle],
    }),

    cackle: new Attack({
        wdm: 0,
        name: "Cackle",
        type: "spell",
        family: ["Skeleton"],
        initRecovery: 20,
        type: "debuff",
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        description: "Cackle in your madness, buffing your blunt damage.",
        buffs: [BUFFS.buffCackle],
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
        initRecovery: 28,
        targets: {
            style: "all",
            side: null,
            row: null,
        },
        description: "Heals all undead units in combat by 20%.",
        buffs: [BUFFS.buffHealUndead],
    }),

    /*
     *  dP""b8 888888 88b 88 888888    db    88   88 88""Yb .dP"Y8
     * dP   `" 88__   88Yb88   88     dPYb   88   88 88__dP `Ybo."
     * Yb      88""   88 Y88   88    dP__Yb  Y8   8P 88"Yb  o.`Y8b
     *  YboodP 888888 88  Y8   88   dP""""Yb `YbodP' 88  Yb 8bodP'
     */
    herdmentor: new Attack({
        wdm: 0,
        name: "Herd Mentor",
        type: "buff",
        family: [],
        initRecovery: 28,
        targets: {
            style: "side",
            side: "ally",
            row: null,
        },
        description: "Encourage your teammates, reducing their attack recovery.",
        buffs: [BUFFS.buffHerdMentor],
    }),

    stampede: new Attack({
        wdm: 1,
        name: "Stampede",
        type: "attack",
        family: ["Centaur"],
        initRecovery: 26,
        targets: {
            style: "side",
            side: "enemy",
            row: null,
        },
        damage: {
            blunt: {
                increased: 1.25,
            }
        },
        description: "Stampede your way through your enemies.",
        stun: 3,
    }),

    stomp: new Attack({
        wdm: 1,
        name: "Stomp",
        type: "attack",
        family: ["Centaur"],
        initRecovery: 22,
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        description: "Stomp on an enemy with increased blunt damage.",
        stun: 3,
        damage: {
            blunt: {
                min: 1,
                max: 2,
                increased: 1.25,
            },
        },
    }),

    /*
     *  dP""b8 88  88  dP"Yb  88   88 88     .dP"Y8
     * dP   `" 88  88 dP   Yb 88   88 88     `Ybo."
     * Yb  "88 888888 Yb   dP Y8   8P 88  .o o.`Y8b
     *  YboodP 88  88  YbodP  `YbodP' 88ood8 8bodP'
     */
    regenerate: new Attack({
        wdm: 0,
        name: "Regenerate",
        initRecovery: 20,
        family: ["Ghoul"],
        targets: {
            style: "self",
            side: null,
            row: null,
        },
        buffs: [BUFFS.buffRegenerate],
        description: "Regenerate life over time.",
    }),

    ghoulscreech: new Attack({
        name: "Ghoul Screech",
        family: ["Ghoul"],
        initRecovery: 28,
        wdm: 0,
        targets: {
            style: "side",
            side: "ally",
            row: null,
        },
        type: "buff",
        description: "Inspire your allies to attack more often.",
        buffs: [BUFFS.buffGhoulScreech],
    }),

    poisonedClaw: new Attack({
        wdm: 1.25,
        name: "Poisoned Claw",
        initRecovery: 24,
        family: ["Ghoul"],
        targets: {
            style: "single",
            side: "enemy",
            row: "front",
        },
        buffs: [BUFFS.debuffPoisoned],
        description: "Slash your target with a particularly nasty claw.",
        damage: {
            pierce: {
                increased: 0.75,
            },
            acid: {
                increased: 0.75,
            },
        },
    }),
};

/**
 * Group up attacks of the same family so we can easily add them to
 * enemies and players.
 */
const FAMILY_ATTACKS = {};
for (let key in ATTACKS) {
    if (ATTACKS[key].family) {
        for (let idx in ATTACKS[key].family) {
            if (!FAMILY_ATTACKS[ATTACKS[key].family[idx]]) {
                FAMILY_ATTACKS[ATTACKS[key].family[idx]] = [];
            }

            FAMILY_ATTACKS[ATTACKS[key].family[idx]].push(ATTACKS[key]);
        }
    }
}

// Add attacks to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.ATTACKS = ATTACKS;
    S.COM.FAMILY_ATTACKS = FAMILY_ATTACKS;
})(setup);
