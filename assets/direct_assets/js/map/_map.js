const DEFAULTMAP = {
    debug: false,
};

class Map {
    constructor(obj) {
        let sv = State.variables;

        // Merge the canvas into our obj, then onto default, then, onto this.
        jQuery.extend(true, this, DEFAULTMAP, obj);

        /* If a canvas already exists from another map instance, dispose of it before making a new one. */
        // if (sv.map) {
        //     sv.map.canvas.dispose();
        //     sv.map = undefined;
        // }

        /* Initialize Canvas */
        /* http://fabricjs.com/articles/ */
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
         * 5% is 25 grid boxes along the greater length.
         */
        let boxValue = 0.0525;
        this.maxgFWidth = Math.floor(window.outerWidth * boxValue);
        this.maxgFHeight = Math.floor(window.outerHeight * boxValue);

        if (this.maxgFWidth <= this.maxgFHeight) {
            this.gF = this.maxgFWidth;
            this.maxgFHeight = Math.floor(window.outerHeight / this.gF) - 1;
            this.maxgFWidth = Math.floor(window.outerWidth / this.gF) - 1;
        } else {
            this.gF = this.maxgFHeight;
            this.maxgFHeight = Math.floor(window.outerHeight / this.gF) - 1;
            this.maxgFWidth = Math.floor(window.outerWidth / this.gF) - 1;
        }

        /** Required due to async programming. */
        let map = this;
        waitForElm(".canvas-container").then(function () {
            $("#map").removeClass("hidden");
            $(".upper-canvas").removeClass("hidden");
            $(".canvas-container").removeClass("hidden").css("position", "unset");

            map.drawGridlines();

            /* Determine location of party icon. */
            let playerTop = 0;
            let playerLeft = 0;
            if (sv.playerLoc) {
                playerTop = sv.quest.playerLoc[0];
                playerLeft = sv.quest.playerLoc[1];
            }

            new setup.map.Interactable("assets/imported/img/png/turn_icon_pl.png", {
                top: sv.map.gF * playerTop,
                left: sv.map.gF * playerLeft,
                interactable: false,
                player: true,
            });

            map.loadEventListeners();

            /** Load initial Interactables. */
            // NOTE: This also sets the background.
            map.updateSequence(sv.quest.sequence)
        });

        /** Load custom trigger notice thing */
        $(document).on(":sequenceupdated", function () {
            sv.quest.sequence += 1;

            map.updateSequence(sv.quest.sequence);
        });

        return this;
    }

    /** Returns the top + left intersection in number of fidelity units. */
    /* TODO: Refactor into obj with x and y fields to match native fabric.js objects. */
    getGFCoords(pos, fidelity = this.gF) {
        return [(pos[0] - (pos[0] % fidelity)) / fidelity, (pos[1] - (pos[1] % fidelity)) / fidelity];
    }

    updateSequence(seqNum) {
        let svq = State.variables.quest;
        let canvas = State.variables.map.canvas;

        if (seqNum === undefined) {
            seqNum = svq.sequence;
        }

        // Destroy the objects in the interactableGroup.
        if (canvas.interactableGroup) {
            canvas.interactableGroup.forEachObject(function (obj) {
                // Don't kill objects I want to keep in the same place.
                if (!obj.keepLoc || (obj.keepLoc && seqNum >= obj.stopShowingSequence)) {
                    obj.dispose();
                }
            });
        }

        /**
         * TODO:
         * If we load up the map again (say after coming from combat), 
         * then we lose the canvas.interactableGroup. Therefore, we 
         * should go through each interactable and replace the
         * interactables that exist.
         * 
         * In reality, we should be storing just these interactables 
         * somewhere, and then calling them when they are needed.
         */ 

        // Draw New Background
        this.drawBackground(svq.mapBackground[seqNum]);

        // Add new interactables
        for (let interactable of svq.interactables[seqNum]) {
            interactable();
        }
    }

    /** Draws a background image to the canvas. Removes the previous background before redrawing. */
    drawBackground(imgSrc) {
        if (imgSrc === undefined) {
            imgSrc = "assets/imported/img/png/browncanvas.jpeg";
        }

        this.canvas.setBackgroundImage(imgSrc, this.canvas.renderAll.bind(this.canvas), {
            // Needed to position backgroundImage at (0,0).
            originX: "left",
            originY: "top",
        });
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
        let svq = State.variables.quest;
        svq.playerLoc = this.getGFCoords([player.aCoords.tl.x, player.aCoords.tl.y]);

        this.canvas.interactableGroup.forEachObject((obj) => {
            if (svq.playerLoc.toString() === this.getGFCoords([obj.aCoords.tl.x, obj.aCoords.tl.y]).toString()) {
                obj.timesVisited += 1;
                obj.intersecting(obj);
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

    resize() {
        /* I don't know where to put this or how to deal with it, but it's for resizing the map. */

        /* For zoom/resize detection */
        let px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;

        /* TODO add callback to resize canvas. */
        function isZooming() {
            var newPx_ratio =
                window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
            if (newPx_ratio !== px_ratio) {
                px_ratio = newPx_ratio;
                /* console.log("zooming"); */
                return true;
            } else {
                /* console.log("just resizing"); */
                return false;
            }
        }

        $(window).resize(function () {
            isZooming();
        });
    }

    /**
     * The map instance itself is not saved. Instead, we delete it
     * with a `:passageinit` Event Listener. Particular details of the
     * map should be in State.variables.quest, and that should be used
     * to decide map interactables and whatnot.
     *
     * This means that we do not need the clone() and toJSON() methods
     * that most classes need for SugarCube compatibility.
     */
}

// Add the required map functions to setup.
(function (S) {
    if (!S.map) {
        S.map = {};
    }

    S.map.Map = Map;
})(setup);
