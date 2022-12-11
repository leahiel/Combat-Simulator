let DEFAULT_INTERACTABLE = {
    imgSrc: "",
    timesVisited: 0,
    interactable: true,
    position: { x: null, y: null },
    isInteracting: false,
    hasInteracted: false,
};

/**
 *
 */
class Interactable {
    constructor(options, clone = false) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_INTERACTABLE, options);
        
        this.position = this.setPosition();
        if (!clone) {
            this.icon = this.prepareInteractable();
        }

        return this;
    }

    /** Prepares the interactable icon for the canvas. */
    prepareInteractable() {
        if (this.imgSrc === "") {
            this.imgSrc = "assets/imported/img/png/turn_icon_pl.png";
        }

        let interactable = PIXI.Sprite.from(this.imgSrc);

        interactable.width = Map.getGridFidelity();
        interactable.height = Map.getGridFidelity();
        interactable.x = Map.getGridFidelity() * this.position.x;
        interactable.y = Map.getGridFidelity() * this.position.y;

        return interactable;
    }

    /** Sets the position of the interactable. */
    setPosition() {
        // Set x
        let x;
        if (typeof this.position.x === "number") {
            x = this.position.x;
        } else {
            let x_maxGF = (window.innerWidth * Map.getGridFidelity()) - 1
            x = 4; // TODO Random Number.
        }

        let y;
        // Set y
        if (typeof this.position.y === "number") {
            y = this.position.y;
        } else {
            let y_maxGF = (window.innerHeight * Map.getGridFidelity()) - 1
            y = 4; // TODO Random Number.
        }

        return { x: x, y: y };
    }

    /**
     * Interactables are not saved, but they should be. I'm not sure
     * how to handle this yet.
     *
     * This means that we do not need the clone() and toJSON() methods
     * that most classes need for SugarCube compatibility.
     */

    /** TODO: Test saving and loading. */

    /** Required for SC Saving and loading. */
    clone() {
        // REVIEW: Do I want to delete <Interactable>.icon data here?
        return new this.constructor(this, {}, true);
    }

    /** Required for SC Saving and loading. */
    toJSON() {
        const ownData = {};

        Object.keys(this).forEach(function (pn) {
            if (pn === 'icon') {
                // We don't want dedicated PIXI data. Instead, we 
                // regenerate that from scratch.
                return;
            }

            ownData[pn] = clone(this[pn]);
        }, this);

        return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
    }
}

// Add the required interactable functions to setup.
(function (S) {
    if (!S.quest) {
        S.quest = {};
    }

    S.quest.Interactable = Interactable;
})(setup);
