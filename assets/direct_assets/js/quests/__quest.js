/**
 * The map is only the canvas. It will ONLY draw already existing objects.
 * The canvas will be stored in sv.canvas.
 * The quest objects will be stored in sv.quest.
 *
 * Quest objects includes:
 *      UUID, which will only be changed when a quest is made.
 *      The player object.
 *      Every interactable on the screen.
 *          Including the their location on the screen.
 *      Objectives.
 *      Sequence.
 *      The GameState.
 *
 *  These related objects should be 95% separated from the map:
 *      Interactables, which can call these 100% separated objects:
 *          Textboxes
 *          City Menu
 *          Combat
 *
 *  In effect, the map should be 95% read only. The only input it takes is to move the player.
 *
 *  In theory, _city_inn, _city_guildhall, and _city_menu don't need to be rewritten.
 */

/* TODO: Move <Map>.preparePlayer() into <Quest>, and Map.movePlayer() into Quest.movePlayer(). */

/**
 * Quests are a collection of sequences with some additional data stored to combine and transverse them.
 */

const DEFAULT_QUEST = {
    debug: true,
    playerLoc: null,
    sequences: null,
    interactables: [],
    sequence: 0,
    guild: {},
    subquest: 0,
    sequenceLoaded: false,
};

class Quest {
    constructor(obj) {
        // Merge the obj onto default, then, onto this.
        jQuery.extend(true, this, DEFAULT_QUEST, obj);

        if (this.playerLoc === null) {
            console.error("This quest does not have a player starting location.")
        }

        if (this.sequences === null) {
            console.error("This quest has no sequences.");
        }

        return this;
    }

    /** Increases the sequence of the current quest, advancing it to the next stage. */
    static increaseSequence() {
        let sv = State.variables;

        sv.quest.sequence += 1;
        sv.quest.sequenceLoaded = false;
    }

    /**
     * TODO: Test saving and loading.
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

    S.quest.Quest = Quest;
})(setup);
