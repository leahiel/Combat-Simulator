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
    /*
     *  888888    db    88   88 88b 88    db
     *  88__     dPYb   88   88 88Yb88   dPYb
     *  88""    dP__Yb  Y8   8P 88 Y88  dP__Yb
     *  88     dP""""Yb `YbodP' 88  Y8 dP""""Yb
     */
    EN_MOMMY_SPIDER: new Enemy({
        name: "Momma Spider",
        family: "mommySpider",
        healthMax: 120,
        initStart: 62,
        attacks: setup.COM.familyAttacks.mommySpider,
        description: "A filthy abomination in a larger than acceptable size. Complementary baby spiders come with it.",
        damage: {
            blunt: {
                min: 6,
                max: 12,
            },
            acid: {
                min: 4,
                max: 8,
            },
            pierce: {
                min: 4,
                max: 8,
            },
        },
        directChanceBase: 0.08,
        directChanceIncreased: 0.25,
        criticalChanceBase: 0.09,
        criticalChanceIncreased: 1,
    }),

    EN_BABY_SPIDER: new Enemy({
        name: "Baby Spider",
        family: "babySpider",
        healthMax: 28,
        initStart: 26,
        initStartVariance: 0.3,
        attacks: setup.COM.familyAttacks.babySpider,
        description: "A small little spider. It's almost kinda cute...",
        damage: {
            blunt: {
                min: 1,
                max: 3,
            },
            acid: {
                min: 2,
                max: 2,
            },
            pierce: {
                min: 1,
                max: 1,
            },
        },
    }),

    EN_HOG: new Enemy({
        name: "Hog",
        family: "Hog",
        healthMax: 240,
        initStart: 28,
        attacks: setup.COM.familyAttacks.Hog,
        description: "A boar, a hog, a whore, they're all the same, and they're all vicious.",
        resistance: {
            blunt: 0.2,
            pierce: -0.2,
        },
        damage: {
            blunt: {
                min: 9,
                max: 14,
            },
            pierce: {
                min: 8,
                max: 13,
            },
        },
    }),

    /*
     *  dP""b8    db    88""Yb 88""Yb 88   88 88b 88  dP""b8 88     888888 .dP"Y8
     * dP   `"   dPYb   88__dP 88__dP 88   88 88Yb88 dP   `" 88     88__   `Ybo."
     * Yb       dP__Yb  88"Yb  88""Yb Y8   8P 88 Y88 Yb      88  .o 88""   o.`Y8b
     *  YboodP dP""""Yb 88  Yb 88oodP `YbodP' 88  Y8  YboodP 88ood8 888888 8bodP'
     */
    EN_CARBUNCLE: new Enemy({
        name: "Carbuncle",
        family: "Carbuncle",
        healthMax: 60,
        initStart: 22,
        initStartVariance: 0.24,
        attacks: setup.COM.familyAttacks.Carbuncle,
        description: "An adorable little rabbit with crystals growing on it.",
        damage: {
            acid: {
                min: 2,
                max: 4,
            },
            blunt: {
                min: 2,
                max: 4,
            },
            fire: {
                min: 2,
                max: 4,
            },
            frost: {
                min: 2,
                max: 4,
            },
            lightning: {
                min: 4,
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
        healthMax: 49,
        initStart: 22,
        initStartVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.acidicshot),
        description: "A magical rabbit focusing on acidic magic.",
        damage: {
            acid: {
                min: 8,
                max: 12,
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
        healthMax: 72,
        initStart: 25,
        initStartVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.rockfall),
        description: "A magical rabbit focusing on blunt magic.",
        damage: {
            blunt: {
                min: 8,
                max: 12,
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
        healthMax: 49,
        initStart: 22,
        initStartVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.firewall),
        description: "A magical rabbit focusing on fire magic.",
        damage: {
            fire: {
                min: 7,
                max: 14,
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
        healthMax: 49,
        initStart: 22,
        initStartVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.iceprison),
        description: "A magical rabbit focusing on frost magic.",
        damage: {
            frost: {
                min: 7,
                max: 11,
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
        healthMax: 49,
        initStart: 22,
        initStartVariance: 0.24,
        attacks: mergeArray(setup.COM.familyAttacks.Carbuncle, setup.COM.attacks.flash),
        description: "A magical rabbit focusing on lightning magic.",
        damage: {
            lightning: {
                min: 1,
                max: 19,
            },
        },
        resistance: {
            lightning: 0.1,
            elemental: 0.2,
            occult: 0.2,
        },
    }),

    /*
     * .dP"Y8 88  dP 888888 88     888888 888888  dP"Yb  88b 88 .dP"Y8
     * `Ybo." 88odP  88__   88     88__     88   dP   Yb 88Yb88 `Ybo."
     * o.`Y8b 88"Yb  88""   88  .o 88""     88   Yb   dP 88 Y88 o.`Y8b
     * 8bodP' 88  Yb 888888 88ood8 888888   88    YbodP  88  Y8 8bodP'
     */
    EN_UNARMED_SKELETON: new Enemy({
        name: "Unarmed Skeleton",
        family: "Skeleton",
        healthMax: 43,
        initStart: 30,
        initStartVariance: 0.24,
        initRecoveryModifier: 2.3, // NYI: initRecoveryModifier
        attacks: mergeArray(setup.COM.familyAttacks.Skeleton, setup.COM.familyAttacks.unarmedAttacks),
        description: "A spoopy skeleton animated out of arcane magicks.",
        damage: {
            blunt: {
                min: 9,
                max: 15,
            },
        },
        resistance: {
            blunt: -0.4,
            pierce: 0.3,
            acid: 0.2,
            sacred: -0.4,
            frost: 0.2,
            fire: 0.2,
        },
    }),

    EN_SPEAR_SKELETON: new Enemy({
        name: "Skeleton Spearman",
        family: "Skeleton",
        healthMax: 43,
        initStart: 32,
        initStartVariance: 0.24,
        initRecoveryModifier: 1.8,
        attacks: mergeArray(setup.COM.familyAttacks.Skeleton, setup.COM.familyAttacks.spearWeaponAttacks),
        description: "A spoopy skeleton spearman animated out of arcane magicks.",
        damage: {
            pierce: {
                min: 9,
                max: 14,
            },
        },
        resistance: {
            blunt: -0.4,
            pierce: 0.3,
            acid: 0.2,
            sacred: -0.4,
            frost: 0.2,
            fire: 0.2,
        },
    }),

    EN_SWORDSHIELD_SKELETON: new Enemy({
        name: "Skeleton Swordsman",
        family: "Skeleton",
        healthMax: 43,
        initStart: 28,
        initStartVariance: 0.24,
        initRecoveryModifier: 1.8,
        attacks: mergeArray(setup.COM.familyAttacks.Skeleton, setup.COM.familyAttacks.swordandshieldWeaponAttacks),
        description: "A spoopy skeleton spearman animated out of arcane magicks.",
        damage: {
            pierce: {
                min: 6,
                max: 10,
            },
        },
        resistance: {
            blunt: -0.4,
            pierce: 0.3,
            acid: 0.2,
            sacred: -0.4,
            frost: 0.2,
            fire: 0.2,
        },
    }),

    EN_BOW_SKELETON: new Enemy({
        name: "Skeleton Archer",
        family: "Skeleton",
        positionPreferance: "backline", // NYI: positionPreferance. After CI are randomly performed, parties should shuffle for preferances.
        healthMax: 43,
        initStart: 28,
        initStartVariance: 0.24,
        initRecoveryModifier: 1.8,
        attacks: mergeArray(setup.COM.familyAttacks.Skeleton, setup.COM.familyAttacks.bowWeaponAttacks),
        description: "A spoopy skeleton spearman animated out of arcane magicks.",
        damage: {
            pierce: {
                min: 7,
                max: 12,
            },
        },
        resistance: {
            blunt: -0.4,
            pierce: 0.3,
            acid: 0.2,
            sacred: -0.4,
            frost: 0.2,
            fire: 0.2,
        },
    }),

    /*
     *  dP""b8 888888 88b 88 888888    db    88   88 88""Yb .dP"Y8
     * dP   `" 88__   88Yb88   88     dPYb   88   88 88__dP `Ybo."
     * Yb      88""   88 Y88   88    dP__Yb  Y8   8P 88"Yb  o.`Y8b
     *  YboodP 888888 88  Y8   88   dP""""Yb `YbodP' 88  Yb 8bodP'
     */
    EN_CENTAUR_BOWMAN: new Enemy({
        name: "Centaur Bowman",
        family: "Centaur",
        positionPreferance: "backline", // NYI: positionPreferance. After CI are randomly performed, parties should shuffle for preferances.
        healthMax: 104,
        initStart: 19,
        initStartVariance: 0.16,
        initRecoveryModifier: 1.3,
        attacks: mergeArray(setup.COM.familyAttacks.Centaur, setup.COM.familyAttacks.bowWeaponAttacks),
        description: "A proud centaur bowmen.",
        directChanceBase: 5,
        directChanceIncreased: 0.5,
        damage: {
            pierce: {
                min: 6,
                max: 11,
            },
            blunt: {
                min: 3,
                max: 4,
            },
        },
        resistance: {
            shadow: -0.2,
            fire: -0.2,
        },
    }),

    EN_CENTAUR_HERD_MENTOR: new Enemy({
        name: "Centaur Herd Mentor",
        family: "Centaur",
        healthMax: 98,
        initStart: 26,
        initStartVariance: 0.24,
        initRecoveryModifier: 1.5,
        attacks: mergeArray(
            setup.COM.familyAttacks.Centaur,
            [setup.COM.attacks.herdmentor],
            setup.COM.familyAttacks.shieldWeaponAttacks
        ),
        description: "A shielded veteran centaur.",
        directChanceBase: 5,
        directChanceIncreased: 0.5,
        directChanceMore: 1.2,
        blockRecovery: 5,
        blockChanceBase: 5,
        blockChanceIncreased: 0.5,
        blockChanceMore: 1.2,
        damage: {
            sacred: {
                min: 5,
                max: 8,
            },
        },
        resistance: {
            shadow: -0.2,
            fire: -0.2,
        },
    }),

    EN_CENTAUR_WARRIOR: new Enemy({
        name: "Centaur Warrior",
        family: "Centaur",
        healthMax: 143,
        initStart: 19,
        initStartVariance: 0.16,
        initRecoveryModifier: 1.3,
        attacks: mergeArray(setup.COM.familyAttacks.Centaur, setup.COM.familyAttacks.maceandshieldWeaponAttacks),
        description: "A shield and mace wielding warrior.",
        directChanceBase: 5,
        directChanceIncreased: 0.5,
        directChanceMore: 1.2,
        blockRecovery: 5,
        blockChanceBase: 5,
        blockChanceIncreased: 0.5,
        blockChanceMore: 1.2,
        damage: {
            blunt: {
                min: 8,
                max: 13,
            },
        },
        resistance: {
            shadow: -0.2,
            fire: -0.2,
        },
    }),

    EN_CHAOS_CENTAUR: new Enemy({
        name: "Chaos Centaur",
        family: "Centaur",
        healthMax: 143,
        initStart: 19,
        initStartVariance: 0.16,
        initRecoveryModifier: 1.3,
        attacks: mergeArray(
            setup.COM.familyAttacks.Centaur,
            setup.COM.familyAttacks.shieldWeaponAttacks,
            setup.COM.familyAttacks.chaoticspearWeaponAttacks
        ),
        description: "An unholy spear wielding centaur, complete with a shield.",
        directChanceBase: 5,
        directChanceIncreased: 0.5,
        directChanceMore: 1.2,
        blockRecovery: 5,
        blockChanceBase: 5,
        blockChanceIncreased: 0.5,
        blockChanceMore: 1.2,
        damage: {
            blunt: {
                min: 3,
                max: 4,
            },
            aether: {
                min: 2,
                max: 5,
            },
            shadow: {
                min: 2,
                max: 5,
            },
            sacred: {
                min: 2,
                max: 5,
            },
        },
        resistance: {
            occult: 0.2,
            fire: -0.2,
        },
    }),

    /*
     *  dP""b8 88  88  dP"Yb  88   88 88     .dP"Y8
     * dP   `" 88  88 dP   Yb 88   88 88     `Ybo."
     * Yb  "88 888888 Yb   dP Y8   8P 88  .o o.`Y8b
     *  YboodP 88  88  YbodP  `YbodP' 88ood8 8bodP'
     */
    EN_GHOUL: new Enemy({
        name: "Ghoul",
        family: "Ghoul",
        healthMax: 84,
        initStart: 15,
        initStartVariance: 0.12,
        initRecoveryModifier: 1,
        attacks: mergeArray(setup.COM.familyAttacks.Ghoul),
        description: "A nasty ghoul, highly resistant to material damage.",
        criticalChanceBase: 9,
        criticalChanceIncreased: 0.5,
        criticalChanceMore: 1.2,
        criticalDamageBase: 1,
        damage: {
            pierce: {
                min: 3,
                max: 5,
            },
            acid: {
                min: 5,
                max: 9,
            },
        },
        resistance: {
            material: 0.6,
            occult: -0.3,
        },
        absorbPercent: {
            material: 0.05,
        },
    }),

    EN_SAUSON_GHOUL_MASTER: new Enemy({
        name: "Sauson Ghoul Master",
        family: "Sauson",
        positionPreferance: "backline", // NYI: positionPreferance. After CI are randomly performed, parties should shuffle for preferances.
        healthMax: 64,
        initStart: 19,
        initStartVariance: 0.12,
        attacks: mergeArray(setup.COM.attacks.healUndead, setup.COM.attacks.flash),
        description: "The oldest of enemies that wish to see everything burn: A Sauson.",
        damage: {
            shadow: {
                min: 5,
                max: 11,
            },
        },
        resistance: {
            material: -0.2,
            occult: 0.3,
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
