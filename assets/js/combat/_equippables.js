class Equippable {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTEQUIPPABLE, obj);

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
const equippables = {
    // DEBUG
    debugweapon: new Equippable({
        name: "Debug Weapon",
        slot: "weapon",
        type: "unequipped",
        attacks: mergeArray(setup.COM.familyAttacks.debugAttacks),
        deflectChanceBase: 1,
        blockChanceBase: 1,
    }),

    // UNEQUIPPED
    unequippedweapon: new Equippable({
        name: "No Weapon Equipped",
        slot: "weapon",
        type: "unequipped",
        attacks: mergeArray(setup.COM.familyAttacks.unarmedAttacks),
        damage: {
            blunt: {
                min: 2,
                max: 3,
            },
        },
    }),

    unequippedarmor: new Equippable({
        name: "No Armor Equipped",
        slot: "armor",
        type: "unequipped",
    }),

    unequippedaccessory: new Equippable({
        name: "No Accessory Equipped",
        slot: "accessory",
        type: "unequipped",
    }),

    // WEAPONS
    woodenspear: new Equippable({
        name: "Wooden Spear",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.familyAttacks.spearWeaponAttacks),
        damage: {
            pierce: {
                min: 4,
                max: 7,
            },
        },
        deflectChanceBase: 0.03,
        deflectChanceIncreased: 0.75,
    }),

    chaoticspear: new Equippable({
        name: "Chaotic Spear",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.familyAttacks.chaoticspearWeaponAttacks),
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
    }),

    swordandshield: new Equippable({
        name: "Sword and Shield",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.familyAttacks.swordandshieldWeaponAttacks),
        damage: {
            pierce: {
                min: 3,
                max: 8,
            },
        },
        criticalChanceBase: 0.03,
        criticalChanceIncreased: 1,
        blockChanceBase: 0.08,
        blockChanceIncreasedx: 1,
        blockRecovery: 4,
    }),

    maceandshield: new Equippable({
        name: "Mace and Shield",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.familyAttacks.maceandshieldWeaponAttacks),
        damage: {
            blunt: {
                min: 3,
                max: 8,
            },
        },
        directChanceBase: 0.03,
        directChanceIncreased: 1,
        blockChanceBase: 0.08,
        blockChanceIncreasedx: 1,
        blockRecovery: 4,
        stun: 3,
    }),

    lumbermanaxe: new Equippable({
        name: "Lumberman's Axe",
        slot: "weapon",
        modslots: 2,
        attacks: mergeArray(setup.COM.familyAttacks.twohandedaxeWeaponAttacks),
        damage: {
            pierce: {
                min: 5,
                max: 11,
            },
        },
        criticalChanceBase: 0.02,
        criticalChanceIncreased: 0.5,
    }),

    // ARMORS
    leatherarmor: new Equippable({
        name: "Leather Chest Armor",
        slot: "armor",
        modslots: 2,
    }),

    metalarmor: new Equippable({
        name: "Metal Chest Armor",
        slot: "armor",
        modslots: 2,
    }),
};

// Add the Equippable class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.equippables = equippables;
})(setup);
