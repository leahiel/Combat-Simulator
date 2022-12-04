const DEFAULTMAP = {
    debug: true,
};

class Map {
    constructor(obj) {
        // Merge the canvas into our obj, then onto default, then, onto this.
        jQuery.extend(true, this, DEFAULTMAP, obj);

        /* Initialize Canvas */
        this.canvas = new fabric.Canvas("map", {
            width: window.outerWidth,
            height: window.outerHeight,
            backgroundColor: "rbg(0,0,0)",
            selection: false,
        });
        this.canvas.setDimensions(
            {
                width: 1280,
                height: 720,
            },
            {
                cssOnly: true,
            }
        );

        /**
         * "Grid Fidelity"
         * The distance, in px, between the lines in the grid.
         *
         * 3.125% is 32 grid boxes along the greater length.
         */
        this.gF = window.outerWidth >= window.outerHeight ? window.outerWidth * 0.03125 : window.outerHeight * 0.03125;

        /** Required due to async programming. */
        let map = this;
        waitForElm(".canvas-container").then(function () {
            $("#map").removeClass("hidden");
            $(".upper-canvas").removeClass("hidden");
            $(".canvas-container").removeClass("hidden").css("position", "unset");
            map.drawGridlines();
            map.loadEventListeners();
        });

        return this;
    }

    /** Returns the top + left intersection in number of fidelity units. */
    /* TODO: Refactor into obj with x and y fields to match native fabric.js objects. */
    getGFCoords(pos, fidelity = this.gF) {
        return [(pos[0] - (pos[0] % fidelity)) / fidelity, (pos[1] - (pos[1] % fidelity)) / fidelity];
    }

    /** Load Event Listeners. */
    loadEventListeners() {
        /** Required due to async programming. */
        let map = this;

        /* Pathfinding for player. */
        map.canvas.on("mouse:down", function (options) {
            if (State.variables.GameState === "map") {
                let player = map.canvas.playerGroup.getObjects()[0];

                fabric.runningAnimations.cancelByTarget(player);
                fabric.runningAnimations.cancelAll();

                let oldCoords = map.getGFCoords([player.aCoords.tl.x, player.aCoords.tl.y]);
                let newCoords = map.getGFCoords([options.e.clientX, options.e.clientY]);

                /* Don't do anything if user clicks the GF box the player is in. */
                if (oldCoords.toString() === newCoords.toString()) {
                    return;
                }

                let horiDuration = Math.abs(newCoords[0] - oldCoords[0]) * 150;
                let vertiDuration = Math.abs(newCoords[1] - oldCoords[1]) * 150;

                player.animate("left", newCoords[0] * map.gF, {
                    onChange: map.canvas.renderAll.bind(map.canvas),
                    duration: horiDuration,
                    easing: null,
                });
                player.animate("top", newCoords[1] * map.gF, {
                    onChange: map.canvas.renderAll.bind(map.canvas),
                    duration: vertiDuration,
                    easing: null,
                });

                /* Angle doesn't matter. In reality, I only want the onComplete handler to run when both left and top animations are finished. So I set the duration of this animate to be equal to the longer duration. This means it gets run when the longer duration is finished. */
                player.animate("angle", 0, {
                    duration: horiDuration >= vertiDuration ? horiDuration : vertiDuration,
                    onComplete: function () {
                        map.isPlayerIntersecting(player);
                    },
                });
            }
        });
    }

    /** Determine if player is interacting with any interactables. */
    isPlayerIntersecting(player) {
        this.canvas.interactableGroup.forEachObject((obj) => {
            if (
                this.getGFCoords([player.aCoords.tl.x, player.aCoords.tl.y]).toString() ===
                this.getGFCoords([obj.aCoords.tl.x, obj.aCoords.tl.y]).toString()
            ) {
                obj.timesVisited += 1;
                obj.intersecting();
            }
        });
    }

    /** DEBUG FEATURE: Grid lines. */
    drawGridlines() {
        if (this.debug) {
            /* Initialize Grid Group */
            let gridGroup = new fabric.Group();

            /* Draw Vertical Lines */
            for (let i = 0; i <= window.outerWidth / this.gF; i++) {
                let temp = new fabric.Line([this.gF * i, 0, this.gF * i, window.outerHeight], {
                    stroke: "rgb(80,80,80)",
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    moveCursor: "default",
                    hoverCursor: "defaut",
                    selectable: false,
                });

                this.canvas.add(temp);
                gridGroup.add(temp);
            }

            /* Draw Horizontal Lines */
            for (let i = 0; i <= window.outerHeight / this.gF; i++) {
                let temp = new fabric.Line([0, this.gF * i, window.outerWidth, this.gF * i], {
                    stroke: "rgb(80,80,80)",
                    hasControls: false,
                    hasBorders: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockRotation: true,
                    moveCursor: "default",
                    hoverCursor: "defaut",
                    selectable: false,
                });

                this.canvas.add(temp);
                gridGroup.add(temp);
            }
        }
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

// Add the required map functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    S.map.Map = Map;
})(setup);
