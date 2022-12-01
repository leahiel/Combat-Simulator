let INTERACTABLEOPTIONS = {
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
        let canvas = State.variables.canvas;
        // Merge our obj onto default, then merge those onto this.
        let trueOptions = jQuery.extend(true, {}, INTERACTABLEOPTIONS, options);

        let img = new Image();
        img.onload = function () {
            var obj = new fabric.Image(img, trueOptions);

            if (obj.width >= obj.height) {
                obj.scaleToWidth(canvas.gF);
            } else {
                obj.scaleToHeight(canvas.gF);
            }

            canvas.add(obj);
            if (trueOptions.interactable) {
                canvas.interactableGroup.add(obj);
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
