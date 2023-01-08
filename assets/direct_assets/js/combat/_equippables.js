class Equippable {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_EQUIPPABLE, obj);

        if (!this.slot) {
            console.error(`${this.name} equippable has no slot.`);
        }

        this.mods = [];
        for (let i = 0; i < this.modslots; i++) {
            this.mods.push(affixes.unequippedMod);
        }

        this.original = cloneDeep(this);
    }

    applyMods() {
        // Reset the equippable back to how it was without mod affixes being added.
        let mods = this.mods;
        let newBaseObj = cloneDeep(this.original);
        Object.assign(this, newBaseObj);
        this.mods = mods;

        // Apply Mods
        for (let mod of this.mods) {
            // Don't mess with unequipped mods.
            if (mod.type === "UnequippedMod") {
                continue;
            }

            // Apply mod affix stats to Equippable.
            for (let i = 0; i < mod.affixes.length; i++) {
                jQuery.extend(true, this, updateProperty(this, mod.affixes[i][0], mod.value[i], mod.affixes[i][1]));
            }
        }

        /* So that we can chain... */
        return this;
    }

    /**
     * Convert the data into an HTML string so that the player can understand the data within.
     */
    getInfo() {
        let solstr = `<span id="EquippableInformationPlate">`;

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

    // NYI: Every item should have this function which creates an HTML "plate" of the item with stats and whatnot, which can be used in various places for various things.
    // The item plate will show like the very basic features of the item at the top, which can then be hovered over to get more information, kinda like cards in MTG
    itemplate(selector) {
        let solHTML = `<span class="itemPlate ${this.slot}">`;
        solHTML += this.name;
        solHTML += "</span>";

        if (selector) {
            waitForElm(selector).then(() => {
                $(selector).replaceWith(solHTML);
            });
        } else {
            return solHTML;
        }
    }
}

/**
 * We're copying WarFrame's system of equippables, so we want every
 * base Equippable to be the same, except that they can level up and
 * gain expertise and whatnot. This will let us sell base Equippables
 * on the store for $$$ (variants, which are always better, have to
 * be farmed).
 *
 * This allows each player to gain proficiency with each item, which acts as a subsitute to experience.
 *
 * Proficiency should be a player stat. Player and their Main Pawn can gain it, while other pawns cannot.
 */
const EQUIPPABLES = {
    // DEBUG
    debugweapon: new Equippable({
        name: "Debug Weapon",
        slot: "weapon",
        type: "unequipped",
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.debugAttacks),
        deflectChanceBase: 1,
        blockChanceBase: 1,
        tag: ["all", "unequipped"],
        damage: {
            blunt: {
                min: 2000,
                max: 3000,
            },
        },
    }),

    // UNEQUIPPED
    unequippedweapon: new Equippable({
        name: "No Weapon Equipped",
        slot: "weapon",
        type: "unequipped",
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.unarmedAttacks),
        damage: {
            blunt: {
                min: 2,
                max: 3,
            },
        },
        tag: ["all", "unequipped"],
    }),

    unequippedarmor: new Equippable({
        name: "No Armor Equipped",
        slot: "armor",
        type: "unequipped",
        tag: ["all", "unequipped"],
    }),

    unequippedaccessory: new Equippable({
        name: "No Accessory Equipped",
        slot: "accessory",
        type: "unequipped",
        tag: ["all", "unequipped"],
    }),

    /*
     * Yb        dP 888888    db    88""Yb  dP"Yb  88b 88 .dP"Y8
     *  Yb  db  dP  88__     dPYb   88__dP dP   Yb 88Yb88 `Ybo."
     *   YbdPYbdP   88""    dP__Yb  88"""  Yb   dP 88 Y88 o.`Y8b
     *    YP  YP    888888 dP""""Yb 88      YbodP  88  Y8 8bodP'
     */
    /**
     * Current and [Planned] Weapon Tags:
     *
     * All: All
     * Type: Axe, Mace, Sword, Spear, [Bow], [Dagger]
     * Style: Two-Handed, Shield, One-Handed, [Dual Wield]
     * Damage:
     * 	Material, Blunt, Pierce, [Acid]
     * 	[Elemental], [Fire], [Frost], [Lightning]
     * 	Occult, Aether, Sacred, Shadow
     * Misc: Block
     */

    /** TODO: Add a sword and dagger. Add a bow. */
    // Bows
    arcanebow: new Equippable({
        name: "Arcane Bow",
        slot: "weapon",
        modslots: 4,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.bowWeaponAttacks),
        damage: {
            fire: {
                min: 1,
                max: 3,
            },
            frost: {
                min: 1,
                max: 3,
            },
            lightning: {
                min: 1,
                max: 3,
            },
        },
        criticalChanceBase: 0.03,
        criticalChanceIncreased: 0.75,
        initRecoveryModifier: 0.2,
        initDecrementModifier: -0.1,
        tags: ["all", "bow", "two-handed", "elemental", "fire", "frost", "lightning"],
    }),

    recurvebow: new Equippable({
        name: "Recurve Bow",
        slot: "weapon",
        modslots: 4,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.bowWeaponAttacks),
        damage: {
            pierce: {
                min: 4,
                max: 7,
            },
        },
        criticalChanceBase: 0.04,
        criticalChanceIncreased: 0.75,
        criticalDamageBase: 0.25,
        criticalDamageIncreased: 0.75,
        initDecrementModifier: -0.3,
        tags: ["all", "bow", "two-handed", "material", "pierce"],
    }),

    // Spears
    nimblespear: new Equippable({
        name: "Nimble Spear",
        slot: "weapon",
        modslots: 3,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.spearWeaponAttacks),
        damage: {
            pierce: {
                min: 4,
                max: 8,
            },
        },
        deflectChanceBase: 0.04,
        deflectChanceIncreased: 0.75,
        initDecrementModifier: 0.1,
        tags: ["all", "spear", "two-handed", "pierce", "material"],
    }),

    heavyspear: new Equippable({
        name: "Heavy Spear",
        slot: "weapon",
        modslots: 3,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.spearWeaponAttacks),
        damage: {
            pierce: {
                min: 5,
                max: 11,
            },
        },
        deflectChanceBase: 0.02,
        deflectChanceIncreased: 0.5,
        initDecrementModifier: -0.1,
        initRecoveryModifier: 0.2,
        tags: ["all", "spear", "two-handed", "pierce", "material"],
    }),

    // Chaotic Spears
    chaoticspear: new Equippable({
        name: "Occultic Spear",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.chaoticspearWeaponAttacks),
        damage: {
            aether: {
                min: 1,
                max: 3,
            },
            sacred: {
                min: 1,
                max: 3,
            },
            shadow: {
                min: 1,
                max: 3,
            },
        },
        initDecrementModifier: -0.2,
        tags: ["all", "spear", "two-handed", "occult", "aether", "sacred", "shadow"],
    }),

    abyssalspear: new Equippable({
        name: "Abyssal Spear",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.chaoticspearWeaponAttacks),
        damage: {
            aether: {
                min: 2,
                max: 5,
            },
            lightning: {
                min: 2,
                max: 5,
            },
        },
        initDecrementModifier: -0.2,
        tags: ["all", "spear", "two-handed", "elemental", "lightning", "occult", "aether"],
    }),

    // Sword and Shield
    swordandshield: new Equippable({
        name: "Short Sword and Shield",
        slot: "weapon",
        modslots: 3,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.swordandshieldWeaponAttacks),
        damage: {
            pierce: {
                min: 5,
                max: 10,
            },
        },
        criticalChanceBase: 0.03,
        criticalChanceIncreased: 1,
        blockChanceBase: 0.08,
        blockChanceIncreased: 1,
        blockRecovery: 4,
        initDecrementModifier: 0.1,
        tags: ["all", "sword", "one-handed", "shield", "material", "pierce", "block"],
    }),

    // Mace and Shield
    maceandshield: new Equippable({
        name: "Mace and Shield",
        slot: "weapon",
        modslots: 3,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.maceandshieldWeaponAttacks),
        damage: {
            blunt: {
                min: 6,
                max: 12,
            },
        },
        directChanceBase: 0.03,
        directChanceIncreased: 1,
        blockChanceBase: 0.08,
        blockChanceIncreased: 1,
        blockRecovery: 4,
        stun: 3,
        tags: ["all", "mace", "shield", "one-handed", "material", "blunt", "block"],
    }),

    acidicmaceandshield: new Equippable({
        name: "Acid Mace and Shield",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.maceandshieldWeaponAttacks),
        damage: {
            blunt: {
                min: 2,
                max: 6,
            },
            acid: {
                min: 2,
                max: 4,
            },
        },
        directChanceBase: 0.03,
        directChanceIncreased: 1,
        blockChanceBase: 0.08,
        blockChanceIncreased: 1,
        blockRecovery: 4,
        stun: 3,
        tags: ["all", "mace", "shield", "one-handed", "material", "blunt", "block"],
    }),

    // 2H Axe
    lumbermanaxe: new Equippable({
        name: "Lumberman's Axe",
        slot: "weapon",
        modslots: 3,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.twohandedaxeWeaponAttacks),
        damage: {
            pierce: {
                min: 5,
                max: 12,
            },
        },
        criticalChanceBase: 0.02,
        criticalChanceIncreased: 0.25,
        initDecrementModifier: 0,
        initRecoveryModifier: -0.1,
        tags: ["all", "axe", "two-handed", "material", "pierce"],
    }),

    executioneraxe: new Equippable({
        name: "Executioner's Axe",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.FAMILY_ATTACKS.twohandedaxeWeaponAttacks),
        damage: {
            pierce: {
                min: 3,
                max: 5,
            },
        },
        criticalChanceBase: 0.2,
        criticalChanceIncreased: 0.5,
        initDecrementModifier: -0.15,
        initRecoveryModifier: 0.2,
        tags: ["all", "axe", "two-handed", "material", "pierce"],
    }),

    /*
     *    db    88""Yb 8b    d8  dP"Yb  88""Yb .dP"Y8
     *   dPYb   88__dP 88b  d88 dP   Yb 88__dP `Ybo."
     *  dP__Yb  88"Yb  88YbdP88 Yb   dP 88"Yb  o.`Y8b
     * dP""""Yb 88  Yb 88 YY 88  YbodP  88  Yb 8bodP'
     */
    knightarmor: new Equippable({
        name: "Knight's Armor",
        slot: "armor",
        modslots: 4,
        resistance: {
            material: 0.2,
            lightning: -0.2,
            occult: -0.1,
        },
        reduct: {
            blunt: 2,
            pierce: 4,
        },
        initStart: 4,
        initDecrementModifier: -0.2,
        initRecoveryModifier: 0.1,
        healthMax: 30,
        tags: ["all", "plate"],
    }),

    chainmail: new Equippable({
        name: "Chainmail",
        slot: "armor",
        modslots: 3,
        resistance: {
            material: 0.2,
            lightning: -0.2,
            occult: -0.1,
        },
        reduct: {
            pierce: 1,
        },
        initStart: 2,
        initDecrementModifier: -0.1,
        initRecoveryModifier: 0.05,
        healthMax: 24,
        tags: ["all", "plate"],
    }),

    leatherarmor: new Equippable({
        name: "Leather Chest Armor",
        slot: "armor",
        modslots: 2,
        resistance: {
            material: 0.1,
            elemental: 0.1,
            occult: -0.1,
        },
        healthMax: 16,
        tags: ["all", "leather"],
    }),

    priestvestiges: new Equippable({
        name: "Priest's Vestiges",
        slot: "armor",
        modslots: 3,
        resistance: {
            elemental: 0.1,
            occult: 0.3,
        },
        healthMax: 10,
        tags: ["all", "cloth"],
    }),

    comfortableclothes: new Equippable({
        name: "Village Clothes",
        slot: "armor",
        modslots: 3,
        resistance: {
            occult: -0.1,
        },
        initStart: -3,
        initDecrementModifier: 0.1,
        initRecoveryModifier: -0.1,
        healthMax: 3,
        tags: ["all", "cloth", "leather"],
    }),

    /**
     *    db     dP""b8  dP""b8 888888 .dP"Y8 .dP"Y8  dP"Yb  88""Yb 88 888888 .dP"Y8
     *   dPYb   dP   `" dP   `" 88__   `Ybo." `Ybo." dP   Yb 88__dP 88 88__   `Ybo."
     *  dP__Yb  Yb      Yb      88""   o.`Y8b o.`Y8b Yb   dP 88"Yb  88 88""   o.`Y8b
     * dP""""Yb  YboodP  YboodP 888888 8bodP' 8bodP'  YbodP  88  Yb 88 888888 8bodP'
     */
    trickstersamulet: new Equippable({
        name: "Trickster's Amulet",
        slot: "accessory",
        modslots: 2,
        resistance: {
            occult: 0.1,
        },
        initDecrementModifier: 0.2,
        initRecoveryModifier: -0.15,
        tags: ["all"],
    }),

    elementalistsamulet: new Equippable({
        name: "Elementalist's Amulet",
        slot: "accessory",
        modslots: 2,
        damage: {
            fire: {
                increased: 0.25,
            },
            frost: {
                increased: 0.25,
            },
            lightning: {
                increased: 0.25,
            },
        },
        resistance: {
            elemental: 0.2,
        },
        tags: ["all"],
    }),

    occultistsamulet: new Equippable({
        name: "Occultist's Amulet",
        slot: "accessory",
        modslots: 2,
        damage: {
            aether: {
                increased: 0.1,
            },
            sacred: {
                increased: 0.1,
            },
            shadow: {
                increased: 0.1,
            },
        },
        resistance: {
            occult: 0.2,
        },
        tags: ["all"],
    }),

    dadspendant: new Equippable({
        name: "Dad's Pendant",
        slot: "accessory",
        modslots: 3,
        resistance: {
            material: 0.1,
        },
        blockRecovery: -3,
        blockChanceIncreased: .45,
        blockChanceMore: 1.1,
        healthMax: 15,
        tags: ["all"],
    }),

    sharktoothamulet: new Equippable({
        name: "Sharktooth Amulet",
        slot: "accessory",
        modslots: 2,
        damage: {
            pierce: {
                increased: 0.5,
            },
        },
        tags: ["all"],
    }),

    friendscharm: new Equippable({
        name: "Friend's Charm",
        slot: "accessory",
        modslots: 3,
        damage: {
            pierce: {
                increased: 0.1,
            },
        },
        healthMax: 25,
        tags: ["all"],
    }),
};

// Add the Equippable class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Equippable = Equippable;
    S.COM.EQUIPPABLES = EQUIPPABLES;
})(setup);
