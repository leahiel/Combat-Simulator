class Equippable {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTEQUIPPABLE, */ obj);
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
    leatherarmor: new Equippable({
        name: "Leather Chest Armor",
        mods: [],
    }),
};

// Add the Equippable class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.equippables = equippables;
})(setup);
