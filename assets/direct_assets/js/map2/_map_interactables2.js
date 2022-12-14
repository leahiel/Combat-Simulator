let DEFAULT_INTERACTABLE = {
    /* Initialize */
    isInteracting: false,
    hasInteracted: false,
    timesVisited: 0,
    position: { x: null, y: null },

    /* Specifics */
    imgSrc: "",
    interactable: true,

    /* Removals */
    removeAfterInteracting: false,
    removeAfterSequenceUpdate: false,
    removeAfterCombatWin: false,
    removeAfterCombatLoss: false,
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

    /** Removes the interactable's icon from the canvas. */
    removeFromCanvas() {
        let app = State.temporary.pixi;

        app.stage.removeChild(this.icon);
    }

    /**
     * Randomly sets the position of the interactable, ensuring it does not overlap with any other interactable.
     */
    setPosition(attempt = 0) {
        // Ensure that the interactable doesn't already have a position. If it does, return it.
        // REVIEW: Should I ensure that the interable is within max/min bounds of the grid? Might be important when I write the resizing code.
        if (typeof this.position.x === "number" && typeof this.position.y === "number") {
            return { x: this.position.x, y: this.position.y };
        }

        // Initialize
        let sv = State.variables;

        // Convert the UUID into a useable psuedo random number.
        let RNG = uuidToNum(sv.quest.uuid);
        for (let i = 0; i < attempt; i++) {
            RNG = shiftNumber(RNG);
        }

        /**
         * Set x
         */
        let x_minGF = 1;
        let x_maxGF = window.innerWidth / Map.getGridFidelity() - 1;

        // Get first 6 digits then divide it by the max number of those digits to get a percentage.
        let x_percent = Number(String(RNG).slice(0, 6)) / 999999;
        let x = Math.round((x_maxGF - x_minGF) * x_percent + x_minGF);

        /**
         * Set y
         */
        let y_minGF = 1;
        let y_maxGF = window.innerHeight / Map.getGridFidelity() - 1;

        // Get last 6 digits then divide it by the max number of those digits to get a percentage.
        let y_percent = Number(String(RNG).slice(6, 12)) / 999999;
        let y = Math.round((y_maxGF - y_minGF) * y_percent + y_minGF);

        /**
         * Check if this position already exists in the list of
         * interactables.
         *
         * Since we already checked for this object's position
         * specifically, we don't need to be concerned about finding
         * that in this list.
         */
        let exists = false;
        for (let interactable of sv.quest.interactables) {
            if (x === interactable.position.x && y === interactable.position.y) {
                exists = true;
                break;
            }
        }

        // If the position already exists, then try again. Else, return the position.
        if (exists) {
            return this.setPosition(attempt + 1);
        } else {
            return { x: x, y: y };
        }
    }

    /**
     * Interactables are not saved, but they should be. I'm not sure
     * how to handle this yet.
     *
     * This means that we do not need the clone() and toJSON() methods
     * that most classes need for SugarCube compatibility.
     */

    /**
     * TODO: Test saving and loading.
     *
     * NOTE: Passage navigation appears to work flawlessly.
     */

    /** Required for SC Saving and loading. */
    clone() {
        // REVIEW: Do I want to delete <Interactable>.icon data here?
        return new this.constructor(this, {}, true);
    }

    /** Required for SC Saving and loading. */
    toJSON() {
        const ownData = {};

        Object.keys(this).forEach(function (pn) {
            if (pn === "icon") {
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
