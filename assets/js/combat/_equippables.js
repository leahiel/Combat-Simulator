class Equippable {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTEQUIPPABLE, obj);

        if (!this.type) {
            console.error(`${this.name} equippable has no type.`)
        }
    }

    // TODO: Every item should have this function which creates an HTML "plate" of the item with stats and whatnot, which can be used in various places for various things.
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
    // UNEQUIPPED
    unequippedweapon: new Equippable({
        name: "No Weapon Equipped",
        slot: "weapon",
        type: "unequipped",
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

    // ARMORS
    leatherarmor: new Equippable({
        name: "Leather Chest Armor",
        slot: "armor",
        modslots: 2,
        mods: [null, null],
    }),

    metalarmor: new Equippable({
        name: "Metal Chest Armor",
        slot: "armor",
        modslots: 2,
        mods: [null, null],
    }),
};

// Add the Equippable class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.equippables = equippables;
})(setup);
