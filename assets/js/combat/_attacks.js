/**
 * There are currently no Attack methods, it is just used as a constructor to easily make new attacks.
 */
class Attack {
    constructor(obj) {
        // This is required as we need to deep assign.
        let merger = mergeDeep(DEFAULTATTACK, obj);
        Object.assign(this, merger);

        if (this.family === null) {
            console.error(`${this.name}'s family is null.`);
        }
    }
}

const attacks = {
    // SPEAR ATTACKS
    stab: new Attack({
        name: "Stab",
        family: "Player",
        initRecovery: 50,
        wdm: 1.25,
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
        damage: {
            blunt: {
                min: 3,
                max: 5,
            },
        },
    }),

    // MISC. ATTACKS
    /** When a character is dead, this attack should replace its attack. */
    deadAttack: new Attack({
        name: "deadAttack",
        family: "Debug",
        effect: null,
        initRecovery: 0,
    }),

    /** The attack that is used when attacks aren't initialized. */
    nullAttack: new Attack({
        name: "errorAttack",
        family: "Debug",
        effect: null,
    }),
};

const familyAttacks = {};
for (let key in attacks) {
    if (attacks[key].family) {
        if (!familyAttacks[attacks[key].family]) {
            // familyAttacks[attacks[key].family] = {};
            familyAttacks[attacks[key].family] = [];
        }

        // familyAttacks[attacks[key].family][attacks[key].name] = attacks[key];
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
