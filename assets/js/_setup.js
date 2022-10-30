/// The setup object can store data, importantly, functions, objects,
/// and classes. This has a few advantages: It means that console
/// commands can't be used for these data, which will discourage,
/// though not eliminate, cheating.

/**
 * Files appended with two underscores (e.g. __defaults.js), contain
 *     only CONSTANTS, and have no dependencies.
 * Files appended with one underscore (e.g. _combat.js, _imports.js),
 *     contains dependent data.
 * Files not appended with an underscore are imported directly into
 *     the game with SugarCube's importedScripts() function.
 */

// ANCHOR[id=setup]
(function (S) {
    // ANCHOR[id=CONST]
    if (!S.CONST) {
        S.CONST = {};
    }

    /**
     * While currently unused, when we have massive lists of
     * CONSTANTS, we will put them into their own files, and just
     * incorporate them here.
     *
     * An example of a massive list of CONSTANTS include names.
     */
})(setup);
