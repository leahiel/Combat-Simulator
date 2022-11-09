/**
 * An Enemy is the base object on the that is used to calculate
 * Combatants, which in the future, may be modified by modifiers and
 * statuses.
 */
class Enemy {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTENEMY, obj);

        if (this.family === null) {
            console.error(`${this.name}'s family is null.`);
        }

        if (this.description === null) {
            console.error(`${this.name}'s flavor text is null.`);
        }
    }
}

const monsters = {
    ENspider: new Enemy({
        name: "Spider",
        family: "Spider",
        healthMax: 4,
        initStart: 67,
        attacks: setup.COM.familyAttacks.Spider,
        description: "A filthy abomination in a larger than acceptable size.",
    }),

    ENhog: new Enemy({
        name: "Hog",
        family: "Hog",
        healthMax: 8,
        initStart: 47,
        attacks: setup.COM.familyAttacks.Hog,
        description: "A boar, a hog, a whore, they're all the same, and they're all vicious.",
    }),

    //Carbuncles
    ENCarbuncle: new Enemy({
        name: "Carbuncle",
        family: "Carbuncle",
        healthMax: 5,
        initStart: 34,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENAquamarineCarbuncle: new Enemy({
        name: "Aquamarine Carbuncle",
        family: "Carbuncle",
        healthMax: 13,
        initStart: 24,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENEmeraldCarbuncle: new Enemy({
        name: "Emerald Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENOynxCarbuncle: new Enemy({
        name: "Onyx Carbuncle",
        family: "Carbuncle",
        healthMax: 12,
        initStart: 25,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENRubyCarbuncle: new Enemy({
        name: "Ruby Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENSapphireCarbuncle: new Enemy({
        name: "Sapphire Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),

    ENTopazCarbuncle: new Enemy({
        name: "Topaz Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
    }),
};

// Add enemies to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.monsters = monsters;
})(setup);
