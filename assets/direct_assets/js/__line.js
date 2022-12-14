let DEFAULTLINE = {
    /** The source of the portrait to be shown, if any. */
    portrait: null,
    /** The name String of the speaker to be shown, if any. */
    speaker: null,
    /** The text to appear in the TextBox. */
    line: "Default Line Text. If you see this, you have encountered an error.",
    /** Boolean regarding whether the player has seen this Line before. */
    wasSeen: false,
};

/**
 * Lines are the dialogue that are shown to the player.
 */
class Line {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTLINE, obj);
    }

    /** NYI: Saving and loading during a textbox is completely untested and honestly, probably unsupported. */

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

// Add the Line class to setup.
(function (S) {
    if (!S.tb) {
        S.tb = {};
    }

    S.tb.Line = Line;
})(setup);
