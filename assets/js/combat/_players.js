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
        // This is required as we need to deep assign.
        let merger = mergeDeep(DEFAULTPLAYER, obj);
        Object.assign(this, merger);
    }
}

// Add the Player class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Player = Player;
})(setup);
