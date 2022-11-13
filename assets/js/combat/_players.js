/**
 * A Player is the base object on the that is used to calculate
 * Combatants, which in the future, may be modified by modifiers and
 * statuses.
 *
 * Currently, this is largely unimplemented: Only what needs to work
 * is currently functional.
 */
class Player {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTPLAYER, obj);
    }

    // TODO: Add a profiency item for each key in equippables. Also maybe for each equippable tag (leather, armor, metal, helmet, etc) as well.

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

// Add the Player class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Player = Player;
})(setup);
