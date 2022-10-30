/**
 * An Enemy is the base object on the that is used to calculate
 * Combatants, which in the future, may be modified by modifiers and
 * statuses.
 */
class Enemy {
    constructor(obj) {
        // This is required as we need to deep assign.
        let merger = mergeDeep(DEFAULTENEMY, obj);
        Object.assign(this, merger);

        if (this.family === null) {
            console.error(`${this.name}'s family is null.`);
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
    }),

    ENhog: new Enemy({
        name: "Hog",
        family: "Hog",
        healthMax: 8,
        initStart: 47,
        attacks: setup.COM.familyAttacks.Hog,
    }),

    //Carbuncles
    ENCarbuncle: new Enemy({
        name: "Carbuncle",
        family: "Carbuncle",
        healthMax: 5,
        initStart: 34,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENAquamarineCarbuncle: new Enemy({
        name: "Aquamarine Carbuncle",
        family: "Carbuncle",
        healthMax: 13,
        initStart: 24,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENEmeraldCarbuncle: new Enemy({
        name: "Emerald Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENOynxCarbuncle: new Enemy({
        name: "Onyx Carbuncle",
        family: "Carbuncle",
        healthMax: 12,
        initStart: 25,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENRubyCarbuncle: new Enemy({
        name: "Ruby Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENSapphireCarbuncle: new Enemy({
        name: "Sapphire Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),

    ENTopazCarbuncle: new Enemy({
        name: "Topaz Carbuncle",
        family: "Carbuncle",
        healthMax: 14,
        initStart: 27,
        attacks: setup.COM.familyAttacks.Carbuncle,
    }),
};

// Add enemies to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.monsters = monsters;
})(setup);
