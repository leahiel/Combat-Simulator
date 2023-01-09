let version = "0.0.1.128 InDev";

// Chapter Title Names
let TITLES = {
    "@start": "Create Your Character",
    "@combatoverlord": "Fight!",
    "@rest": "Rest for a Bit, Weary Fighter",
};

// Add the strings to setup.
// REVIEW: Is this really needed? Do I need to make these a part of
// setup when this file isn't in assets/js/?
(function (S) {
    if (!S.STR) {
        S.STR = {};
    }

    S.STR.TITLES = TITLES;
    S.STR.version = version;
})(setup);
