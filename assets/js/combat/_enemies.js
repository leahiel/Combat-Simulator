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
    EN_MOMMY_SPIDER: new Enemy({
        name: "Momma Spider",
        family: "mommySpider",
        healthMax: 65,
        initStart: 62,
        attacks: setup.COM.familyAttacks.mommySpider,
        description: "A filthy abomination in a larger than acceptable size. Complementary baby spiders come with it.",
        damage: {
            blunt: {
                min: 6,
                max: 12,
            },
        },
    }),

    EN_BABY_SPIDER: new Enemy({
        name: "Baby Spider",
        family: "babySpider",
        healthMax: 20,
        initStart: 34,
        initVariance: 0.3,
        attacks: setup.COM.familyAttacks.babySpider,
        description: "A small little spider. It's almost kinda cute...",
    }),

    // NTS: Set up as a miniboss.
    EN_HOG: new Enemy({
        name: "Hog",
        family: "Hog",
        healthMax: 240,
        initStart: 47,
        attacks: setup.COM.familyAttacks.Hog,
        description: "A boar, a hog, a whore, they're all the same, and they're all vicious.",
        resistance: {
            blunt: 0.2,
            pierce: -0.2,
        },
        damage: {
            blunt: {
                min: 4,
                max: 6,
            },
            pierce: {
                min: 4,
                max: 6,
            },
        },
    }),

    //Carbuncles
    EN_CARBUNCLE: new Enemy({
        name: "Carbuncle",
        family: "Carbuncle",
        healthMax: 60,
        initStart: 34,
        initVariance: 0.24,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
        damage: {
            acid: {
                min: 1,
                max: 2,
            },
            blunt: {
                min: 1,
                max: 2,
            },
            fire: {
                min: 1,
                max: 2,
            },
            frost: {
                min: 1,
                max: 2,
            },
            lightning: {
                min: 1,
                max: 2,
            },
        },
        resistance: {
            acid: 0.1,
            blunt: 0.1,
            elemental: 0.3,
            occult: 0.2,
        },
    }),

    EN_EMERALD_CARBUNCLE: new Enemy({
        name: "Emerald Carbuncle",
        family: "Carbuncle",
        healthMax: 35,
        initStart: 35,
        initVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.acidicshot),
        description: "A magical rabbit focusing on acidic magic.",
        damage: {
            acid: {
                min: 5,
                max: 8,
            },
        },
        resistance: {
            acid: 0.4,
            elemental: 0.2,
            occult: 0.2,
        },
    }),

    EN_OYNX_CARBUNCLE: new Enemy({
        name: "Onyx Carbuncle",
        family: "Carbuncle",
        healthMax: 67,
        initStart: 34,
        initVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.rockfall),
        description: "A magical rabbit focusing on blunt magic.",
        damage: {
            blunt: {
                min: 5,
                max: 8,
            },
        },
        resistance: {
            blunt: 0.4,
            elemental: 0.2,
            occult: 0.2,
        },
    }),

    EN_RUBY_CARBUNCLE: new Enemy({
        name: "Ruby Carbuncle",
        family: "Carbuncle",
        healthMax: 42,
        initStart: 34,
        initVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.firewall),
        description: "A magical rabbit focusing on fire magic.",
        damage: {
            fire: {
                min: 6,
                max: 9,
            },
        },
        resistance: {
            fire: 0.1,
            elemental: 0.2,
            occult: 0.2,
        },
    }),

    EN_SAPPHIRE_CARBUNCLE: new Enemy({
        name: "Sapphire Carbuncle",
        family: "Carbuncle",
        healthMax: 42,
        initStart: 34,
        initVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.iceprison),
        description: "A magical rabbit focusing on frost magic.",
        damage: {
            frost: {
                min: 4,
                max: 7,
            },
        },
        resistance: {
            frost: 0.1,
            elemental: 0.2,
            occult: 0.2,
        },
    }),

    EN_TOPAZ_CARBUNCLE: new Enemy({
        name: "Topaz Carbuncle",
        family: "Carbuncle",
        healthMax: 42,
        initStart: 34,
        initVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.flash),
        description: "A magical rabbit focusing on lightning magic.",
        damage: {
            lightning: {
                min: 1,
                max: 13,
            },
        },
        resistance: {
            lightning: 0.1,
            elemental: 0.2,
            occult: 0.2,
        },
    }),
};

// Add enemies to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.monsters = monsters;
})(setup);
