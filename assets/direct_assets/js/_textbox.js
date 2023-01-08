/**
 * TODO:
 *  Finalize the textbox design. They should ideally look like Evincle 1's textboxes.
 *  There should be a different textbox for speakers and thoughts/descriptions.
 *  A TB should be able to lead to another TB. This will allow textboxs to turn off speaker names and whatnot.
 *
 * DESIRED
 *  Red text if seen Line (not TB).
 *  Ability to fast-forward text by holding a button.
 *  Ability to fast-forward text that has already been seen.
 *  Ability to scroll backwards to see history.
 */

let DEFAULTTEXTBOX = {
    showBackground: false,
    backgroundSrc: "",
    showDimmer: true,
    lines: [new Line({ DEFAULTLINE })],
};

/**
 * Textboxes are the popups that show dialogue to the player.
 */
class TextBox {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        /* TODO: I don't want DEFAULTTEXTBOX.lines to be used at all. */
        jQuery.extend(true, this, DEFAULTTEXTBOX, obj);

        /**
         * obj: {
         *  arrOfTextToShow,
         *  style/Class,
         * }
         */

        let sv = State.variables;
        sv.PrevGameState = sv.GameState;
        sv.GameState = "textbox";

        this.currentLine = 0;
        this.start();
    }

    /** Add event listeners and initialize the TextBox's style. */
    start() {
        $(document).trigger(":textboxopened");

        $("#textbox-container").click(() => {
            /* REVIEW: Stop Propagation? */
            this.next();
        });

        /**
         * Show Dimmer.
         * Note: Technically speaking, you can't show dimmer and
         * background at the same time due to how the CSS is written.
         * Should this happen, the background will show while the
         * dimmer will be deactivated.
         */
        if (this.showDimmer) {
            $("#textbox-container").removeClass("hidden");
        } else {
            $("#textbox-container").addClass("hidden");
        }

        /** Show Background. */
        // TODO: Change background based on lines.
        if (this.showBackground) {
            $("#textbox-container").addClass("showbackground");
            $("#textbox-container").css("background-image", `url(${this.backgroundSrc})`);
        } else {
            $("#textbox-container").removeClass("showbackground");
            $("#textbox-container").css("background-image", "");
        }

        /** Set everything to visible. */
        $("#textbox").removeClass("hidden");

        this.display(0);
    }

    /**
     * Update the TextBox to show names, text, and portraits.
     */
    display(lineIdx) {
        // Handle Portraits
        if (this.lines[lineIdx].portrait === null || this.lines[lineIdx].portrait === undefined) {
            // There is no portrait for this line.
            // Ergo, Remove the portrait.
            $("#textbox-container").removeClass("showportrait");
        } else if (this.lines[lineIdx].portrait !== null || this.lines[lineIdx].portrait !== undefined) {
            // Set and show the portrait.
            $("#textbox #textbox-portrait").css("background-image", `url(${this.lines[lineIdx].portrait})`);
            $("#textbox-container").addClass("showportrait");
        } else {
            // Do naught: Keep the same portrait properties that we had before.
        }

        // Handle Speaker Names
        if (this.lines[lineIdx].speaker === null || this.lines[lineIdx].speaker === undefined) {
            // There is no speaker for this line.
            // Ergo, Remove the speaker.
            $("#textbox-container").removeClass("showspeakername");
        } else if (this.lines[lineIdx].speaker !== null || this.lines[lineIdx].speaker !== undefined) {
            // Set and show the speaker.
            $("#textbox #textbox-speaker").text(this.lines[lineIdx].speaker);
            $("#textbox-container").addClass("showspeakername");
        } else {
            // Do naught: Keep the same speaker properties that we had before.
        }

        // Display the line
        if (this.lines[lineIdx].wasSeen === true) {
            // NYI: If we've already seen the line, we should add a class so that the text is red.
            $("#textbox #textbox-text").text(this.lines[lineIdx].line);
        } else {
            this.lines[lineIdx].wasSeen = true;
            $("#textbox #textbox-text").text(this.lines[lineIdx].line);
        }
    }

    /**  Show the previous string. */
    previous() {
        // NYI
        console.log("previous");
    }

    /**  Show the next string. */
    next() {
        this.currentLine += 1;

        if (this.currentLine >= this.lines.length) {
            this.close();
        } else {
            this.display(this.currentLine);
        }
    }

    /** Uninitialize and close the TextBox. */
    close() {
        let sv = State.variables;

        $("#textbox-container").addClass("hidden");
        $("#textbox").addClass("hidden");
        $("#textbox #textbox-text").text("");
        $("#textbox-container").css("background-image", "");
        $("#textbox #textbox-portrait").css("background-image", "");

        sv.GameState = sv.PrevGameState;
        sv.PrevGameState = undefined;

        // We have to dereference everything that points to `this` instance in order for JS's garbage collector to collect it.
        $("#textbox-container").off("click");

        $(document).trigger(":textboxclosed");
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

// Add the required textbox functions to setup.
(function (S) {
    if (!S.tb) {
        S.tb = {};
    }

    S.tb.TextBox = TextBox;
})(setup);
