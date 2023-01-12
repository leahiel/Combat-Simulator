/**
 * PIXI Documentation:
 * https://pixijs.download/release/docs/index.html
 *
 * The map is only the canvas. It will ONLY draw already existing objects.
 * The PIXI app is stored in sv.pixi.
 *
 *  In effect, the map should be 95% read only. The only time it can effect other things is with inputs, such as when the user clicks the map, and the map then calls Map.movePlayer().
 */

// TODO: Move <Map>.preparePlayer() into <Quest>, and Map.movePlayer() into Quest.movePlayer().

const DEFAULT_MAP = {
    debug: true,
    /**
     * The map sequence is what is actually on the map. Since we're
     * making a new map, the sequence has to be less than the Quest
     * sequence.
     */
    sequence: -1, //
};

class Map {
    constructor(obj) {
        // The PIXI App
        let pixiApp = State.temporary.pixi;

        // Merge the canvas into our obj, then onto default, then, onto this.
        jQuery.extend(true, this, DEFAULT_MAP, obj);

        // Set the scale of the canvas.
        this.gridFidelity = Map.getGridFidelity();

        // Prepare the player icon.
        this.playerIcon = "assets/imported/img/svg/icons/private.svg";
        this.player = this.preparePlayer(this.playerIcon);

        // If the sequence is already loaded, we don't need to manipulate it.
        // This occurs most often after combat, when we need to remake the map.
        if (State.variables.quest.sequenceLoaded) {
            this.sequence = State.variables.quest.sequence;
        }

        // Prepare and draw the background.
        this.backgroundHexes = State.variables.grid.createGrid(pixiApp);
        this.background = this.createBackground(pixiApp);

        // this.drawBackground(pixiApp);
        if (this.debug) {
            this.drawGridlines(pixiApp);
        }

        // Start the animation!
        Map.gameLoop(pixiApp);

        return this;
    }

    /**
     * "Grid Fidelity"
     * The distance, in px, between the lines in the grid.
     *
     * 5% is 25 grid boxes along the greater length.
     */
    static getGridFidelity() {
        let boxValue = 0.0525;
        let maxgFWidth = Math.floor(window.innerWidth * boxValue);
        let maxgFHeight = Math.floor(window.innerHeight * boxValue);
        let gridFidelity;

        if (maxgFWidth <= maxgFHeight) {
            gridFidelity = maxgFWidth;
            maxgFHeight = Math.floor(window.innerHeight / gridFidelity) - 1;
            maxgFWidth = Math.floor(window.innerWidth / gridFidelity) - 1;
        } else {
            gridFidelity = maxgFHeight;
            maxgFHeight = Math.floor(window.innerHeight / gridFidelity) - 1;
            maxgFWidth = Math.floor(window.innerWidth / gridFidelity) - 1;
        }

        return gridFidelity;
    }

    /** Returns the top + left intersection in number of fidelity units. */
    static getGridFidelityCoords(pos, fidelity) {
        return { x: (pos.x - (pos.x % fidelity)) / fidelity, y: (pos.y - (pos.y % fidelity)) / fidelity };
    }

    /** Draws the background of the canvas. */
    createBackground(pixiApp) {
        // Create an invisible background Sprite that we use for interactivity.
        let background = new PIXI.Sprite("");
        background.width = pixiApp.screen.width;
        background.height = pixiApp.screen.height;

        // Add interactivity to the background Sprite.
        let canvas = this;
        if (this.debug) {
            background.interactive = true;
            background.on("click", function (event) {
                console.log(
                    `GF Coord: [${
                        Map.getGridFidelityCoords(
                            { x: event.data.global.x, y: event.data.global.y },
                            canvas.gridFidelity
                        )["x"]
                    }, ${
                        Map.getGridFidelityCoords(
                            { x: event.data.global.x, y: event.data.global.y },
                            canvas.gridFidelity
                        )["y"]
                    }]`
                );
                Map.movePlayer(
                    canvas.player,
                    Map.getGridFidelityCoords({ x: event.data.global.x, y: event.data.global.y }, canvas.gridFidelity)
                );
            });
        } else {
            background.interactive = true;
            background.on("click", function (event) {
                Map.movePlayer(
                    canvas.player,
                    Map.getGridFidelityCoords({ x: event.data.global.x, y: event.data.global.y }, canvas.gridFidelity)
                );
            });
        }

        return background;
    }

    /** DEBUG FEATURE: Grid lines. */
    drawGridlines(pixiApp) {
        /* Draw Vertical Lines */
        for (let i = 0; i <= window.innerWidth / this.gridFidelity; i++) {
            let start = { x: i * this.gridFidelity, y: 0 };
            let end = { x: i * this.gridFidelity, y: window.innerHeight };

            let line = new PIXI.Graphics();
            line.lineStyle(1, 0x808080, 1);
            line.moveTo(start.x, start.y);
            line.lineTo(end.x, end.y);

            pixiApp.stage.addChild(line);
        }

        /* Draw Horizontal Lines */
        for (let i = 0; i <= window.innerWidth / this.gridFidelity; i++) {
            let start = { x: 0, y: i * this.gridFidelity };
            let end = { x: window.innerWidth, y: i * this.gridFidelity };

            let line = new PIXI.Graphics();
            line.lineStyle(1, 0x808080, 1);
            line.moveTo(start.x, start.y);
            line.lineTo(end.x, end.y);

            pixiApp.stage.addChild(line);
        }
    }

    /** Prepare the player. */
    preparePlayer(imgSrc) {
        if (imgSrc === "") {
            imgSrc = "assets/imported/img/png/turn_icon_pl.png";
        }

        let player = PIXI.Sprite.from(imgSrc);

        player.width = this.gridFidelity;
        player.height = this.gridFidelity;
        player.x = this.gridFidelity * State.variables.quest.playerLoc.x;
        player.y = this.gridFidelity * State.variables.quest.playerLoc.y;

        return player;
    }

    /**
     * Set the location the player should arrive at.
     *
     * Actual movement is done in `Map.gameLoop`
     */
    static movePlayer(playerObj, endLocation) {
        playerObj.endx = endLocation.x;
        playerObj.endy = endLocation.y;
    }

    /**
     * Destroys the map data, PIXI app, and <canvas>. This should be called before passage transition.
     *
     * REVIEW: Do I want to automatically this in rendering.tw?
     */
    static destroyMap() {
        let sv = State.variables;

        sv.map = null;
        sv.pixi = null;
        $("#passage-map canvas").remove();
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

    static gameLoop(pixiApp) {
        let sv = State.variables;

        pixiApp.ticker.add((delta) => {
            if (sv.map === null) {
                // Map was intentionally erased.
                return;
            }

            /**
             * Check the sequence.
             */
            // Figure out which Interactactables to render.
            if (sv.map.sequence !== sv.quest.sequence && !sv.quest.sequenceLoaded) {
                // TODO: Make this a loop from sv.map.sequence to sv.quest.sequence. This will let us add old things on canvas reload.
                sv.map.sequence = sv.quest.sequence;

                // Remove interactables.
                for (let i = 0; i < sv.quest.interactables.length; i++) {
                    if (sv.quest.interactables[i].removeAfterSequenceUpdate) {
                        sv.quest.interactables[i].removeFromCanvas();

                        sv.quest.interactables.splice(i, 1);

                        // Since we removed an index, we need to recheck the new value in this index.
                        i -= 1;
                    }
                }

                // Add interactables.
                sv.quest.sequences[sv.map.sequence].interactables.forEach((interactable) => {
                    sv.quest.interactables.push(interactable());
                });

                sv.quest.sequenceLoaded = true;
            }

            /**
             * Removes the current interactable if one of many conditions are met.
             */
            function removeInteractableIfRequested() {
                let sv = State.variables;

                if (sv.quest.currentInteractable === undefined) {
                    return;
                }

                if (sv.quest.currentInteractableIdx === undefined) {
                    return;
                }

                // ...Interaction.
                if (sv.quest.currentInteractable.isInteracting && sv.quest.currentInteractable.removeAfterInteracting) {
                    sv.quest.currentInteractable.removeFromCanvas();

                    sv.quest.interactables.splice(sv.quest.currentInteractableIdx, 1);
                    sv.quest.currentInteractableIdx = undefined;
                    sv.quest.currentInteractable = undefined;
                    return;
                }

                // ...Combat win.
                if (
                    sv.quest.currentInteractable.isInteracting &&
                    sv.quest.combatOutcome === "win" &&
                    sv.quest.currentInteractable.removeAfterCombatWin
                ) {
                    sv.quest.currentInteractable.removeFromCanvas();
                    sv.quest.combatOutcome = undefined;

                    sv.quest.interactables.splice(sv.quest.currentInteractableIdx, 1);
                    sv.quest.currentInteractableIdx = undefined;
                    return;
                }

                // ...Combat loss.
                if (
                    sv.quest.currentInteractable.isInteracting &&
                    sv.quest.combatOutcome === "loss" &&
                    sv.quest.currentInteractable.removeAfterCombatLoss
                ) {
                    sv.quest.currentInteractable.removeFromCanvas();
                    sv.quest.combatOutcome = undefined;

                    sv.quest.interactables.splice(sv.quest.currentInteractableIdx, 1);
                    sv.quest.currentInteractableIdx = undefined;
                    return;
                }
            }

            removeInteractableIfRequested();

            // Check conditionals for this sequence.
            sv.quest.sequences[sv.quest.sequence].conditional();

            /**
             * Move the player.
             */
            let playerVelocity = 5;

            // Set x velocity.
            if (sv.map.player.endx * sv.map.gridFidelity < sv.map.player.x) {
                // Ensure the velocity is always negative.
                sv.map.player.vx = -Math.abs(playerVelocity);
            } else if (sv.map.player.endx * sv.map.gridFidelity > sv.map.player.x) {
                // Ensure the velocity is always positive.
                sv.map.player.vx = Math.abs(playerVelocity);
            } else {
                sv.map.player.vx = 0;
            }

            // Set y velocity.
            if (sv.map.player.endy * sv.map.gridFidelity < sv.map.player.y) {
                // Ensure the velocity is always negative.
                sv.map.player.vy = -Math.abs(playerVelocity);
            } else if (sv.map.player.endy * sv.map.gridFidelity > sv.map.player.y) {
                // Ensure the velocity is always positive.
                sv.map.player.vy = Math.abs(playerVelocity);
            } else {
                sv.map.player.vy = 0;
            }

            // Determine x position.
            if (
                playerVelocity * 1.05 >=
                Math.abs(Math.abs(sv.map.player.endx * sv.map.gridFidelity) - sv.map.player.x)
            ) {
                // Don't move on x axis if we're within 5% of playerVelocity.
                sv.map.player.x = sv.map.player.endx * sv.map.gridFidelity;
                sv.map.player.vx = 0;
            } else {
                sv.map.player.x += sv.map.player.vx;
            }

            // Determine y position.
            if (
                playerVelocity * 1.05 >=
                Math.abs(Math.abs(sv.map.player.endy * sv.map.gridFidelity) - sv.map.player.y)
            ) {
                // Don't move on y axis if we're within 5% of playerVelocity.
                sv.map.player.y = sv.map.player.endy * sv.map.gridFidelity;
                sv.map.player.vy = 0;
            } else {
                sv.map.player.y += sv.map.player.vy;
            }

            // Log closest player grid fidelity coords.
            sv.quest.playerLoc = Map.getGridFidelityCoords(
                { y: sv.map.player.y, x: sv.map.player.x },
                sv.map.gridFidelity
            );

            /**
             * Render Background
             */
            // Background Cells
            // DESIRED: I cannot figure out how to properly load SVGs
            // so for now I just remove the hexes and make new sprites
            // that will eventually have the loaded SVG textures and
            // display those.
            for (let hex of sv.map.backgroundHexes) {
                pixiApp.stage.removeChild(hex);
            }
            sv.map.backgroundHexes = State.variables.grid.createGrid(pixiApp);
            for (let hex of sv.map.backgroundHexes) {
                pixiApp.stage.addChild(hex);
            }
            // Invisible Background Sprite
            pixiApp.stage.addChild(sv.map.background);

            /**
             * Render NonInteractables
             */
            // TODO: Rendering NonInteractables.

            /**
             * Render Interactables.
             */
            sv.quest.interactables.forEach((interactable) => {
                pixiApp.stage.addChild(interactable.icon);
            });

            /**
             * Render Stuff
             */
            // Render the player.
            pixiApp.stage.addChild(sv.map.player);

            /**
             * Check if there are any intersections.
             */
            for (let idx = 0; idx < sv.quest.interactables.length; idx++) {
                let interactable = sv.quest.interactables[idx];

                // Compare grid fidelity coordinates.
                if (
                    interactable.position.x === sv.quest.playerLoc.x &&
                    interactable.position.y === sv.quest.playerLoc.y
                ) {
                    // Track the interactable that the player is intersecting with.
                    sv.quest.currentInteractable = interactable;
                    sv.quest.currentInteractableIdx = idx;

                    // We don't want the callback to be called 60 times a second, so we just check if we have already interacted without moving away first.
                    if (!interactable.isInteracting) {
                        interactable.isInteracting = true;

                        // Interrupt the movement of the player to force them to interact with the interactable they've intersected with.
                        // DESIRED: This functionality should be based on a bool in the interactable.
                        Map.movePlayer(sv.map.player, interactable.position);

                        interactable.timesVisited += 1;

                        interactable.intersecting();
                    }
                } else {
                    interactable.isInteracting = false;
                    // sv.quest.currentInteractable = undefined;
                    // sv.quest.currentInteractableIdx = undefined;
                }
            }
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
