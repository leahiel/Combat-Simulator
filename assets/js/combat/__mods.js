/**
 * TODO: Rename Affix to Mods
 */
class Affix {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTMOD, */ obj);
    }

    static new(Affix) {
        return cloneDeep(Affix);
    }

    clone() {
        return new this.constructor(this);
    }

    toJSON() {
        const ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
    }
}

const affixes = {
    unequippedMod: new Affix({
        name: "Unequipped Mod",
        type: "UnequippedMod",
        tier: 1,
        tags: ["all", "unequipped"],
    }),

    /*
     * Yb        dP 888888    db    88""Yb  dP"Yb  88b 88 .dP"Y8
     *  Yb  db  dP  88__     dPYb   88__dP dP   Yb 88Yb88 `Ybo."
     *   YbdPYbdP   88""    dP__Yb  88"""  Yb   dP 88 Y88 o.`Y8b
     *    YP  YP    888888 dP""""Yb 88      YbodP  88  Y8 8bodP'
     */
    WEAPON_INCREASED_DIRECT_CHANCE: new Affix({
        name: "Increased Direct Chance",
        affixes: [["directChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Direct Hit Chance";
        },

        slot: "weapon",
        tags: ["mace"],
    }),

    WEAPON_INCREASED_CRIT_CHANCE: new Affix({
        name: "Increased Crit Chance",
        affixes: [["criticalChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Crit Chance";
        },

        slot: "weapon",
        tags: ["spear", "axe", "sword", "dagger"],
    }),

    WEAPON_INCREASED_CRIT_DAMAGE: new Affix({
        name: "Increased Crit Damage",
        affixes: [["criticalDamageIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.65];
        },
        get description() {
            return "${this.value[0] * 100}% increased Crit Damage";
        },

        slot: "weapon",
        tags: ["spear", "axe", "sword", "dagger"],
    }),

    WEAPON_INCREASED_DEFLECT_CHANCE: new Affix({
        name: "Increased Deflect Chance",
        affixes: [["deflectChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.9];
        },
        get description() {
            return "${this.value[0] * 100}% increased Deflect Chance";
        },

        slot: "weapon",
        tags: ["spear", "shield"],
    }),

    WEAPON_INCREASED_BLOCK_CHANCE: new Affix({
        name: "Increased Block Chance",
        affixes: [["blockChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Block Chance";
        },

        slot: "weapon",
        tags: ["shield"],
    }),

    WEAPON_INCREASED_BLOCK_RECOVERY: new Affix({
        name: "Minus Block Recovery",
        affixes: [["blockRecovery", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -1];
        },
        get description() {
            return "-${this.value[0]} Block Recovery";
        },

        slot: "weapon",
        tags: ["shield"],
    }),

    WEAPON_INCREASED_PIERCE_DAMAGE: new Affix({
        name: "Increased Pierce Damage",
        affixes: [["damage.pierce.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Pierce Damage";
        },

        slot: "weapon",
        tags: ["pierce"],
    }),

    WEAPON_INCREASED_BLUNT_DAMAGE: new Affix({
        name: "Increased Blunt Damage",
        affixes: [["damage.blunt.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Blunt Damage";
        },

        slot: "weapon",
        tags: ["blunt"],
    }),

    WEAPON_INCREASED_ACID_DAMAGE: new Affix({
        name: "Increased Acid Damage",
        affixes: [["damage.acid.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Acid Damage";
        },

        slot: "weapon",
        tags: ["acid"],
    }),

    WEAPON_INCREASED_FIRE_DAMAGE: new Affix({
        name: "Increased Fire Damage",
        affixes: [["damage.fire.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Fire Damage";
        },

        slot: "weapon",
        tags: ["fire"],
    }),

    WEAPON_INCREASED_FROST_DAMAGE: new Affix({
        name: "Increased Frost Damage",
        affixes: [["damage.frost.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Frost Damage";
        },

        slot: "weapon",
        tags: ["frost"],
    }),

    WEAPON_INCREASED_LIGHTNING_DAMAGE: new Affix({
        name: "Increased Lightning Damage",
        affixes: [["damage.lightning.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Lightning Damage";
        },

        slot: "weapon",
        tags: ["lightning"],
    }),

    WEAPON_INCREASED_AETHER_DAMAGE: new Affix({
        name: "Increased Aether Damage",
        affixes: [["damage.aether.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Aether Damage";
        },

        slot: "weapon",
        tags: ["aether"],
    }),

    WEAPON_INCREASED_SACRED_DAMAGE: new Affix({
        name: "Increased Sacred Damage",
        affixes: [["damage.sacred.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Sacred Damage";
        },

        slot: "weapon",
        tags: ["sacred"],
    }),

    WEAPON_INCREASED_SHADOW_DAMAGE: new Affix({
        name: "Increased Shadow Damage",
        affixes: [["damage.shadow.increased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1];
        },
        get description() {
            return "${this.value[0]}% Increased Shadow Damage";
        },

        slot: "weapon",
        tags: ["shadow"],
    }),

    WEAPON_MINUS_INIT_START: new Affix({
        name: "Minus Init Start",
        affixes: [["initStart", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -4];
        },
        get description() {
            return "-${this.value[0]} Init Start";
        },

        slot: "weapon",
        tags: ["sword"],
    }),

    WEAPON_DECREASED_INIT_RECOVERY: new Affix({
        name: "Decreased Init Recovery",
        affixes: [["initRecoveryModifier", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -0.08];
        },
        get description() {
            return "${this.value[0]}% Decreased Attack Recovery";
        },

        slot: "weapon",
        tags: ["sword", "one-handed"],
    }),

    /*
     *    db    88""Yb 8b    d8  dP"Yb  88""Yb .dP"Y8
     *   dPYb   88__dP 88b  d88 dP   Yb 88__dP `Ybo."
     *  dP__Yb  88"Yb  88YbdP88 Yb   dP 88"Yb  o.`Y8b
     * dP""""Yb 88  Yb 88 YY 88  YbodP  88  Yb 8bodP'
     */
    ARMOR_ADDED_HEALTH_MAX: new Affix({
        name: "Additional Health",
        affixes: [["healthMax", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 22];
        },
        get description() {
            return "+${this.value[1] * 100} Maximum Health";
        },

        slot: "armor",
        tags: ["plate"],
    }),

    ARMOR_INCREASED_MATERIAL_RESISTANCE_PLATE: new Affix({
        name: "Increased Material Resistance",
        affixes: [["resistance.material", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.5];
        },
        get description() {
            return "${this.value[1] * 100}% increased Material Resistance";
        },

        slot: "armor",
        tags: ["plate"],
    }),

    ARMOR_MINUS_MATERIAL_DAMAGE: new Affix({
        name: "Minus Material Damage Taken",
        affixes: [["resistance.material", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 4];
        },
        get description() {
            return "-${this.value[1]}% iMaterial Damage Taken";
        },

        slot: "armor",
        tags: ["plate"],
    }),

    ARMOR_INCREASED_ELEMENTAL_RESISTANCE_LEATHER: new Affix({
        name: "Increased Elemental Resistance",
        affixes: [["resistance.elemental", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.4];
        },
        get description() {
            return "${this.value[1] * 100}% increased Elemental Resistance";
        },

        slot: "armor",
        tags: ["leather"],
    }),

    ARMOR_INCREASED_MATERIAL_RESISTANCE_LEATHER: new Affix({
        name: "Increased Material Resistance",
        affixes: [["resistance.material", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.3];
        },
        get description() {
            return "${this.value[1] * 100}% increased Material Resistance";
        },

        slot: "armor",
        tags: ["leather"],
    }),

    ARMOR_INCREASED_ELEMENTAL_RESISTANCE: new Affix({
        name: "Increased Elemental Resistance",
        affixes: [["resistance.elemental", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.2];
        },
        get description() {
            return "${this.value[1] * 100}% increased Elemental Resistance";
        },

        slot: "armor",
        tags: ["plate", "cloth"],
    }),

    ARMOR_INCREASED_BLOCK_RECOVERY: new Affix({
        name: "Minus Block Recovery",
        affixes: [["blockRecovery", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -1];
        },
        get description() {
            return "-${this.value[0]} Block Recovery";
        },

        slot: "armor",
        tags: ["leather", "plater"],
    }),

    ARMOR_INCREASED_OCCULT_RESISTANCE: new Affix({
        name: "Increased Occult Resistance",
        affixes: [["resistance.occult", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.5];
        },
        get description() {
            return "${this.value[1] * 100}% increased Occult Resistance";
        },

        slot: "armor",
        tags: ["cloth"],
    }),

    ARMOR_INCREASED_OCCULT_ABSORB_PERCENT: new Affix({
        name: "Increased Occult Absorb",
        affixes: [["absorbPercent.occult", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.2];
        },
        get description() {
            return "+${this.value[1] * 100}% Occult Absorb";
        },

        slot: "armor",
        tags: ["cloth"],
    }),

    ARMOR_INCREASED_DEFLECT_CHANCE: new Affix({
        name: "Increased Deflect Chance",
        affixes: [["directChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[1] * 100}% Increased Deflect Chance";
        },

        slot: "armor",
        tags: ["plate"],
    }),

    ARMOR_INCREASED_ACTION_SPEED: new Affix({
        name: "Increased Action Speed",
        affixes: [["initDecrementModifier", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.12];
        },
        get description() {
            return "+${this.value[1] * 100}% Action Speed";
        },

        slot: "armor",
        tags: ["leather"],
    }),

    ARMOR_DECREASED_INIT_RECOVERY: new Affix({
        name: "Decreased Init Recovery",
        affixes: [["initRecoveryModifier", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -0.08];
        },
        get description() {
            return "${this.value[0]}% Decreased Attack Recovery";
        },

        slot: "armor",
        tags: ["leather"],
    }),

    ARMOR_MINUS_INIT_START: new Affix({
        name: "Minus Init Start",
        affixes: [["initStart", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -4];
        },
        get description() {
            return "-${this.value[0]} Init Start";
        },

        slot: "armor",
        tags: ["leather"],
    }),

    /**
     *    db     dP""b8  dP""b8 888888 .dP"Y8 .dP"Y8  dP"Yb  88""Yb 88 888888 .dP"Y8
     *   dPYb   dP   `" dP   `" 88__   `Ybo." `Ybo." dP   Yb 88__dP 88 88__   `Ybo."
     *  dP__Yb  Yb      Yb      88""   o.`Y8b o.`Y8b Yb   dP 88"Yb  88 88""   o.`Y8b
     * dP""""Yb  YboodP  YboodP 888888 8bodP' 8bodP'  YbodP  88  Yb 88 888888 8bodP'
     */
    ACCESSORY_MINUS_INIT_START: new Affix({
        name: "Minus Init Start",
        affixes: [["initStart", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -4];
        },
        get description() {
            return "-${this.value[0]} Init Start";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_DECREASED_INIT_RECOVERY: new Affix({
        name: "Decreased Init Recovery",
        affixes: [["initRecoveryModifier", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -0.08];
        },
        get description() {
            return "${this.value[0]}% Decreased Attack Recovery";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_DEFLECT_CHANCE: new Affix({
        name: "Increased Deflect Chance",
        affixes: [["directChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[1] * 100}% Increased Deflect Chance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_ACTION_SPEED: new Affix({
        name: "Increased Action Speed",
        affixes: [["initDecrementModifier", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.12];
        },
        get description() {
            return "+${this.value[1] * 100}% Action Speed";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_DIRECT_CHANCE: new Affix({
        name: "Increased Direct Chance",
        affixes: [["directChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Direct Hit Chance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_CRIT_CHANCE: new Affix({
        name: "Increased Crit Chance",
        affixes: [["criticalChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Crit Chance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_CRIT_DAMAGE: new Affix({
        name: "Increased Crit Damage",
        affixes: [["criticalDamageIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.65];
        },
        get description() {
            return "${this.value[0] * 100}% increased Crit Damage";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_BLOCK_CHANCE: new Affix({
        name: "Increased Block Chance",
        affixes: [["blockChanceIncreased", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 1.2];
        },
        get description() {
            return "${this.value[0] * 100}% increased Block Chance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_BLOCK_RECOVERY: new Affix({
        name: "Minus Block Recovery",
        affixes: [["blockRecovery", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * -1];
        },
        get description() {
            return "-${this.value[0]} Block Recovery";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_ADDED_HEALTH_MAX: new Affix({
        name: "Additional Health",
        affixes: [["healthMax", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.18];
        },
        get description() {
            return "+${this.value[1] * 100} Maximum Health";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_ELEMENTAL_RESISTANCE: new Affix({
        name: "Increased Elemental Resistance",
        affixes: [["resistance.elemental", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.4];
        },
        get description() {
            return "${this.value[1] * 100}% increased Elemental Resistance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_MATERIAL_RESISTANCE: new Affix({
        name: "Increased Material Resistance",
        affixes: [["resistance.material", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.3];
        },
        get description() {
            return "${this.value[1] * 100}% increased Material Resistance";
        },

        slot: "accessory",
        tags: ["all"],
    }),

    ACCESSORY_INCREASED_OCCULT_RESISTANCE: new Affix({
        name: "Increased Occult Resistance",
        affixes: [["resistance.occult", "+"]],

        tier: 1,
        profiency: 0,
        profiencyNext: 100,

        get value() {
            return [this.tier * 0.5];
        },
        get description() {
            return "${this.value[1] * 100}% increased Occult Resistance";
        },

        slot: "accessory",
        tags: ["all"],
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
