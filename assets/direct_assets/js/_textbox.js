let DEFAULTTEXTBOX = {
    showBackground: false,
    backgroundSrc: "",
    showDimmer: true,
    showPortrait: false,
    showSpeakerName: false,
    lines: [{ 
        portrait: "project/imported_assets/img/png/turn_icon_pl.png",
        speaker: "Speaker Name",
        line: "Default TextBox Line 1.",
     }],
};

/** REVIEW: Do I want to make a line class? lol */

/**
 *
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
        sv.GameState = "talkbox";

        this.currentLine = 0;
        this.start();
    }

    /** Add event listeners and initialize the TextBox's style. */
    start() {
        $("#textbox-container").click(() => {
            /* REVIEW: Stop Propagation? */
            this.next();
        });

        /* Technically speaking, you can't show dimmer and background at the same time due to how the CSS is written. Should this happen, the background will show while the dimmer will be deactivated. */
        if (this.showDimmer) {
            $("#textbox-container").removeClass("hidden");
        } else {
            $("#textbox-container").addClass("hidden");
        }

        if (this.showBackground) {
            $("#textbox-container").addClass("showbackground");
            $("#textbox-container").css("background-image", `url(${this.backgroundSrc})`);
        } else {
            $("#textbox-container").removeClass("showbackground");
            $("#textbox-container").css("background-image", '');
        }

        if (this.showSpeakerName) {
            $("#textbox-container").addClass("showspeakername");
        } else {
            $("#textbox-container").removeClass("showspeakername");
        }

        if (this.showPortrait) {
            $("#textbox-container").addClass("showportrait");
        } else {
            $("#textbox-container").removeClass("showportrait");
        }

        $("#textbox").removeClass("hidden");

        this.display(0);
    }

    /** Update the TextBox to show names, text, and portraits. */
    display(lineIdx) {
        if (this.showSpeakerName) {
            if (this.lines[lineIdx].speaker) {
                $("#textbox #textbox-speaker").text(this.lines[lineIdx].speaker);
            } else if ($("#textbox #textbox-speaker").text() === "") {
                $("#textbox #textbox-speaker").text("Unknown Speaker");
            }
        }

        if (this.showPortrait) {
            if (this.lines[lineIdx].portrait) {
                $("#textbox #textbox-portrait").css('background-image', `url(${this.lines[lineIdx].portrait})`);
            } else if ($("#textbox #textbox-portrait").css('background-image') === "none") {
                $("#textbox #textbox-portrait").css('background-image', `url("project/imported_assets/img/png/turn_icon_en.png")`);
            }
        }

        if (this.lines[lineIdx].wasSeen === true) {
            /* We used the `previous()` method. */
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
        $("#textbox-container").css("background-image", '');
        $("#textbox #textbox-portrait").css("background-image", '');

        sv.GameState = sv.PrevGameState;
        sv.PrevGameState = undefined;

        // We have to dereference everything that points to `this` instance in order for JS's garbage collector to collect it.
        $("#textbox-container").off("click");
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

// Add the required talkbox functions to setup.
(function (S) {
    if (!S.tb) {
        S.tb = {};
    }

    S.tb.TextBox = TextBox;
})(setup);
