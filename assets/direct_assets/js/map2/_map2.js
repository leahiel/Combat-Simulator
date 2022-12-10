/**
 * https://pixijs.download/release/docs/index.html
 *
 * In order to run PIXI, I need a passage with:
 *      let st = State.temporary;
 *      st.pixi = new PIXI.Application({width: 960, height: 540});
 *      $(`#passage-hexgen`).append(st.pixi.view);
 */

/**
 * The map should just be canvas. It will ONLY draw already existing objects.
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
 *      Interactbles, which can call these 100% separated objects:
 *          Textboxes
 *          City Menu
 *          Combat
 *
 *  In effect, the map should be 95% read only. The only input it takes is to move the player.
 *
 *  In theory, _city_inn, _city_guildhall, and _city_menu don't need to be rewritten.
 *
 */

const DEFAULTMAP = {
    debug: true,
};

class Map {
    constructor(obj) {
        // The PIXI App
        let pixiApp = State.temporary.pixi;

        // Merge the canvas into our obj, then onto default, then, onto this.
        jQuery.extend(true, this, DEFAULTMAP, obj);

        // Set the scale of the canvas.
        this.gridFidelity = Map.getGF();

        // Prepare the player icon.
        this.playerIcon = "";
        this.player = this.preparePlayer(this.playerIcon);

        // Prepare and draw the background.
        this.drawBackground(pixiApp, "");
        if (this.debug) {
            this.drawGridlines(pixiApp);
        }

        // this.drawNonInteractbles(pixiApp, []);
        // this.drawInteractables(pixiApp, []);
        // this.drawPlayer(pixiApp, this.player);

        // Start the animation!
        // This currently draws the player.
        Map.gameLoop(pixiApp);

        return this;
    }

    /**
     * "Grid Fidelity"
     * The distance, in px, between the lines in the grid.
     *
     * 5% is 25 grid boxes along the greater length.
     */
    static getGF() {
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
    static getGFCoords(pos, fidelity) {
        return { x: (pos.x - (pos.x % fidelity)) / fidelity, y: (pos.y - (pos.y % fidelity)) / fidelity };
    }

    /** Draws the background of the canvas. */
    drawBackground(app, background) {
        if (this.debug) {
            background = new PIXI.Sprite(PIXI.Texture.WHITE);
        }

        background.width = app.screen.width;
        background.height = app.screen.height;
        background.tint = 0x9c284b;

        let canvas = this;
        if (this.debug) {
            background.interactive = true;
            background.on("click", function (event) {
                console.log(
                    `GF Coord: [${
                        Map.getGFCoords({ x: event.data.global.x, y: event.data.global.y }, canvas.gridFidelity)["x"]
                    }, ${
                        Map.getGFCoords({ x: event.data.global.x, y: event.data.global.y }, canvas.gridFidelity)["y"]
                    }]`
                );
                canvas.movePlayer(
                    canvas.player,
                    Map.getGFCoords({ x: event.data.global.x, y: event.data.global.y }, canvas.gridFidelity)
                );
            });
        }
        app.stage.addChild(background);
    }

    /** DEBUG FEATURE: Grid lines. */
    drawGridlines(app) {
        /* Draw Vertical Lines */
        for (let i = 0; i <= window.innerWidth / this.gridFidelity; i++) {
            let start = { x: i * this.gridFidelity, y: 0 };
            let end = { x: i * this.gridFidelity, y: window.innerHeight };

            let line = new PIXI.Graphics();
            line.lineStyle(1, 0x808080, 1);
            line.moveTo(start.x, start.y);
            line.lineTo(end.x, end.y);

            app.stage.addChild(line);
        }

        /* Draw Horizontal Lines */
        for (let i = 0; i <= window.innerWidth / this.gridFidelity; i++) {
            let start = { x: 0, y: i * this.gridFidelity };
            let end = { x: window.innerWidth, y: i * this.gridFidelity };

            let line = new PIXI.Graphics();
            line.lineStyle(1, 0x808080, 1);
            line.moveTo(start.x, start.y);
            line.lineTo(end.x, end.y);

            app.stage.addChild(line);
        }
    }

    /** Draw noninteractable object. */

    /** Draw interactable objects. */

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

    /** Draw the player */
    drawPlayer(app, playerObj) {
        app.stage.addChild(playerObj);
    }

    /** 
     * Set the location the player should arrive at.
     * 
     * Actual movement is done in `Map.gameLoop`
     */
    movePlayer(playerObj, endLocation) {
        playerObj.endx = endLocation.x;
        playerObj.endy = endLocation.y;
    }

    /** Determine if player is interacting with any interactables. */
    isPlayerIntersecting(player) {
        // let svq = State.variables.quest;
        // svq.playerLoc = this.getGFCoords([player.aCoords.tl.x, player.aCoords.tl.y]);
        // this.canvas.interactableGroup.forEachObject((obj) => {
        //     if (svq.playerLoc.toString() === this.getGFCoords([obj.aCoords.tl.x, obj.aCoords.tl.y]).toString()) {
        //         obj.timesVisited += 1;
        //         obj.intersecting(obj);
        //     }
        // });
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

    static gameLoop(app) {
        let sv = State.variables;

        app.ticker.add((delta) => {
            /**
             * Move the player.
             */
            let playerVelocity = 4;

            // Set x velocity.
            if (sv.map.player.endx * sv.map.gridFidelity < sv.map.player.x) {
                // Ensure the velocity is always negative.
                sv.map.player.vx = - Math.abs(playerVelocity);
            } else if (sv.map.player.endx * sv.map.gridFidelity > sv.map.player.x) {
                // Ensure the velocity is always positive.
                sv.map.player.vx = Math.abs(playerVelocity);
            } else {
                sv.map.player.vx = 0;
            }

            // Set y velocity.
            if (sv.map.player.endy * sv.map.gridFidelity < sv.map.player.y) {
                // Ensure the velocity is always negative.
                sv.map.player.vy = - Math.abs(playerVelocity);
            } else if (sv.map.player.endy * sv.map.gridFidelity > sv.map.player.y) {
                // Ensure the velocity is always positive.
                sv.map.player.vy = Math.abs(playerVelocity);
            } else {
                sv.map.player.vy = 0;
            }

            // Determine x position.
            if (playerVelocity * 1.05 >= Math.abs(Math.abs(sv.map.player.endx * sv.map.gridFidelity) - sv.map.player.x)) {
                // Don't move on x axis if we're within 5% of playerVelocity.
                sv.map.player.x = sv.map.player.endx * sv.map.gridFidelity;
                sv.map.player.vx = 0;
            } else {
                sv.map.player.x += sv.map.player.vx;
            }

            // Determine y position.
            if (playerVelocity * 1.05 >= Math.abs(Math.abs(sv.map.player.endy * sv.map.gridFidelity) - sv.map.player.y)) {
                // Don't move on y axis if we're within 5% of playerVelocity.
                sv.map.player.y = sv.map.player.endy * sv.map.gridFidelity;
                sv.map.player.vy = 0;
            } else {
                sv.map.player.y += sv.map.player.vy;
            }

            // Log closest player grid fidelity coords.
            sv.quest.playerLoc = Map.getGFCoords({ y: sv.map.player.y, x: sv.map.player.x });

            // Render the player.
            sv.map.drawPlayer(app, sv.map.player);
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
