let INTERACTABLEOPTIONS = {
    timesVisited: 0,
    randomPosition: true,
    keepLoc: false,

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

        // Set the random position of an interactable.
        if (trueOptions.randomPosition) {
            let value = uuidToNum(State.variables.uuid);
            let left = value % map.maxgFWidth;
            let top = value % map.maxgFHeight;
            let strValue = `[${left}, ${top}]`;

            // If gFCoords of an interactable overlap, shift UUID and try again.
            while (State.temporary.interactableLocs.includes(strValue)) {
                value = shiftNumber(value);

                left = value % map.maxgFWidth;
                top = value % map.maxgFHeight;

                strValue = `[${left}, ${top}]`;
            }

            trueOptions.left = left * map.gF;
            trueOptions.top = top * map.gF;

            State.temporary.interactableLocs.push(strValue);
        }

        let img = new Image();
        img.onload = function () {
            var obj = new fabric.Image(img, trueOptions);

            if (obj.width >= obj.height) {
                obj.scaleToWidth(map.gF);
            } else {
                obj.scaleToHeight(map.gF);
            }

            canvas.add(obj);
            /** Initialize the interactableGroup if needed. */
            if (canvas.interactableGroup === undefined) {
                canvas.interactableGroup = new fabric.Group();
            }
            if (trueOptions.interactable) {
                canvas.interactableGroup.add(obj);
            }

            /* Initialize Player Group */
            if (canvas.playerGroup === undefined) {
                canvas.playerGroup = new fabric.Group();
            }
            if (options.player) {
                canvas.playerGroup.add(obj);
            }
        };
        img.src = url;
    }

    /** TODO: Test saving and loading on a map. */

    /** Required for SC Saving and loading. */
    clone() {
        return new this.constructor(this);
    }

    /** Required for SC Saving and loading. */
    toJSON() {
        const ownData = {};
        Object.keys(this).forEach(function (pn) {
            ownData[pn] = clone(this[pn]);
        }, this);
        return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
    }
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    S.map.Interactable = Interactable;
})(setup);
