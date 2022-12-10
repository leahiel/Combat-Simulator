let INTERACTABLEOPTIONS = {
    timesVisited: 0,
    randomPosition: true,
    keepLoc: false,
    stopShowingSequence: undefined, // If keepLoc, then keepLoc === false when sequence === this.

    hasControls: false,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
    lockRotation: true,
    moveCursor: "default",
    hoverCursor: "default",
    selectable: false,

    interactable: true,
    player: false,
};

/**
 *
 */
class Interactable {
    constructor(url, options) {
        let map = State.variables.map;
        let canvas = State.variables.map.canvas;

        // Merge our obj onto default, then merge those onto this.
        let trueOptions = jQuery.extend(true, {}, INTERACTABLEOPTIONS, options);

    }

    /**
     * Interactables are not saved, but they should be. I'm not sure
     * how to handle this yet.
     *
     * This means that we do not need the clone() and toJSON() methods
     * that most classes need for SugarCube compatibility.
     */
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    S.map.Interactable = Interactable;
})(setup);
