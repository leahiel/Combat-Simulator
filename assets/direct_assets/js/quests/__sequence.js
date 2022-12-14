const DEFAULT_SEQUENCE = {
    interactables: [],

    // Available, but not as a field of sequence.
    conditional: function () {
        return;
    },

    objective: "", // NYI

    // REVIEW: Should this be in quest instead?
    mapBackground: "", // NYI "assets/imported/img/png/browncanvas.jpeg",
};

class Sequence {
    constructor(obj) {
        // Merge the obj onto default, then, onto this.
        jQuery.extend(true, this, DEFAULT_SEQUENCE, obj);

        if (this.objective === "") {
            console.error(`Sequence has an empty objective.`);
        }

        return this;
    }

    /**
     * TODO: Test saving and loading.
     *
     * NOTE: Passage navigation appears to work flawlessly.
     */

    /** Required for SC Saving, loading, and passage navigation. */
    clone() {
        return new this.constructor(this, {}, true);
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

// Add the required quest functions to setup.
(function (S) {
    if (!S.quest) {
        S.quest = {};
    }

    S.quest.Sequence = Sequence;
})(setup);
