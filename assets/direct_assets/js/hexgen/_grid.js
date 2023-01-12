let DEFAULT_GRID = {
    // Number of Columns
    width: 6,
    // Number of Rows
    height: 6,
    debug: true,
};

/**
 * Makes a grid out of Hexii.
 *
 * NOTE: This requires the hexii object.
 * NOTE: This requires the Hex class.
 * Perhaps both of these should be embedded into the Grid class.
 *
 * Be aware that due to how hexagons tile, a grid will have odd
 * numbered rows indented. Consider the x-positions of each hex in a
 * 5x7 grid:
 * ```
 *    0 1 2 3 4 5 6    // Non-Indented
 *     0 1 2 3 4 5     // Indented
 *    0 1 2 3 4 5 6    // Non-Indented
 *     0 1 2 3 4 5     // Indented
 *    0 1 2 3 4 5 6    // Non-Indented
 * ```
 */
class Grid {
    constructor(gridOptions) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_GRID, gridOptions);

        if (this.debug) {
            console.debug("Grid Debug is checking all hexii.");
            // Make every single hex so we can see if they have any errors.
            for (let hex of hexii) {
                new Hex(hex);
            }
            console.debug("All hexii have been verified.");
        }

        this.generateEmptyGrid();
        this.generatePopulatedGrid();

        if (this.debug) {
            console.log("Populated Grid successfully created.");
        }

        return this;
    }

    /** Generates an empty grid based on the width and height values. */
    // REVIEW: Make Private?
    generateEmptyGrid() {
        // Width dictates the length of each row.
        // Height dictates the number of rows.

        // REVIEW: Do I want to fill the Arrays with `0` or with `'empty'` or with an empty/special `Hex`? Currently they are filled with `0`.

        // Make Rows
        this.grid = Array(this.height).fill(0);

        // Make Columns
        this.grid.forEach((_, idx) => {
            if (idx % 2 === 1) {
                this.grid[idx] = Array(this.width - 1).fill(0);
            } else {
                this.grid[idx] = Array(this.width).fill(0);
            }
        });
    }

    /** Populates an empty grid with Hexes. */
    // REVIEW: Make Private?
    generatePopulatedGrid() {
        /* Hexagon edges are laid out like this:
         *            0 1
         *           5 ⬡ 2
         *            4 3
         */

        // Go through each coord and assign them a value.
        for (let rowNum = 0; rowNum < this.height; rowNum++) {
            for (let columnNum = 0; columnNum < this.width; columnNum++) {
                // // NOTE: Ignore this commented out codeblock.
                // // I decided that I want the cell to appear anyways.
                // /**
                //  * A hexagonal grid will have some rows indented.
                //  * Consider the x-positions of each hex in a 5x7 grid:
                //  * ```
                //  *    0 1 2 3 4 5 6    // Non-Indented
                //  *     0 1 2 3 4 5     // Indented
                //  *    0 1 2 3 4 5 6    // Non-Indented
                //  *     0 1 2 3 4 5     // Indented
                //  *    0 1 2 3 4 5 6    // Non-Indented
                //  * ```
                //  * Because of this indentation, there is one less cell
                //  * to populate on odd indexed rows.
                //  */
                // if (rowNum % 2 === 1 && columnNum === this.width - 1) {
                //     continue;
                // }

                /** An array of the edgelines around the hex that is to be placed. */
                let adjacentEdgelines = this.getAdjacentEdgelines([columnNum, rowNum]);

                /** An array of hexes with their configurations that fulfill the adjacentEdgelines conditions. */
                let potentialHexii = this.getPotentialHexii(adjacentEdgelines);

                // If there are no viable solutions for a Hex,
                // potentialHexii can return an empty Array.
                if (potentialHexii.length === 0) {
                    if (this.debug) {
                        console.log("Reattempting...");
                    }
                    return this.generatePopulatedGrid();
                }

                // Pick Hex.
                let chosenHex = potentialHexii.random(); // TODO: Add weights to the hexii.
                let hex = new Hex(chosenHex.hex);
                hex.configuration = chosenHex.configuration;
                hex.required = chosenHex.required;

                this.setHexAtCoord([columnNum, rowNum], hex);
            }
        }
    }

    /**
     * Returns an Array of Objects containing information on every
     * Hex that could potentially be placed next.
     *
     * The individual Objects in the Array are formatted like:
     * ```
     * obj = {
     *      hex: <Hex>,
     *      configuration: "configuration",
     *      required: edgelineArray,
     *      weight: Number, // NYI: Determine the rarity weight of a Hex.
     * }
     * ```
     *
     * WARNING: The Array's length can be of any size, including 0.
     * 0 occurs when there are no potential Hexes that can be placed.
     */
    // TODO: Don't allow the same Hex as one of the already existing
    // touching hexes to be duplicated.
    // REVIEW: Make private?
    // NOTE: This method is called every single Hex, so if
    // there are a lot of Hexes to check, then it becomes
    // computationally heavy. As such, it is highly desired to
    // optimize this method.
    // One way to optimize would be to make a subclass/array/object
    // for each Hex edgeset, so that we don't have to check every hex,
    // but rather each set of edgesets that we have.
    getPotentialHexii(edgelineArray) {
        // [ "lake", "lake", "none", "none", "none", "plains" ]
        let solarr = [];

        // DESIRED: Convert to standard loop. `let idx of ...` is the slowest way to loop through arrays.
        for (let hex of hexii) {
            // DESIRED: Convert to standard loop. `let idx in ...` is the slowest way to loop through arrays.
            for (let configuration in hex.edgelines) {
                let isUsable = true;

                if (edgelineArray[0] !== "none" && hex.edgelines[configuration][0] !== edgelineArray[0]) {
                    isUsable = false;
                }
                if (edgelineArray[1] !== "none" && hex.edgelines[configuration][1] !== edgelineArray[1]) {
                    isUsable = false;
                }
                if (edgelineArray[2] !== "none" && hex.edgelines[configuration][2] !== edgelineArray[2]) {
                    isUsable = false;
                }
                if (edgelineArray[3] !== "none" && hex.edgelines[configuration][3] !== edgelineArray[3]) {
                    isUsable = false;
                }
                if (edgelineArray[4] !== "none" && hex.edgelines[configuration][4] !== edgelineArray[4]) {
                    isUsable = false;
                }
                if (edgelineArray[5] !== "none" && hex.edgelines[configuration][5] !== edgelineArray[5]) {
                    isUsable = false;
                }

                if (isUsable) {
                    solarr.push({
                        hex: hex,
                        configuration: configuration,
                        required: edgelineArray,
                    });
                }
            }
        }

        // Log to console if no viable hex solutions were found.
        if (solarr.length === 0 && this.debug) {
            console.debug(`No viable hex solutions were found for [${Hex.reportEdgelines(edgelineArray)}].`);
        }

        return solarr;
    }

    /**
     * Returns an array with the adjacent edges.
     */
    // REVIEW: Make private?
    getAdjacentEdgelines(coordArr) {
        /**
         * Because of how Hexagons tile, we need to be aware of whether
         * a row is indented or not. If it is, we need to offset its
         * column.
         *
         * Consider the x-positions of each hex in a 5x7 hexagon grid:
         * ```
         *    0 1 2 3 4 5 6    // Non-Indented
         *     0 1 2 3 4 5 6   // Indented
         *    0 1 2 3 4 5 6    // Non-Indented
         *     0 1 2 3 4 5 6   // Indented
         *    0 1 2 3 4 5 6    // Non-Indented
         * ```
         */
        let columnOffset = 0;
        if (coordArr[1] % 2 === 0) {
            columnOffset = 1;
        }

        /**
         * Hexagon edges are laid out like this:
         *            0 1
         *           5 ⬡ 2
         *            4 3
         */

        // Non-Indented: [-1, -1] Indented [0 , -1]
        let hex0 = { loc: [coordArr[0] - columnOffset, coordArr[1] - 1] };
        // Non-Indented: [0, -1] Indented [1 , -1]
        let hex1 = { loc: [coordArr[0] + 1 - columnOffset, coordArr[1] - 1] };
        // Either: [1, 0]
        let hex2 = { loc: [coordArr[0] + 1, coordArr[1]] };
        // Non-Indented: [0, 1] Indented [1 , 1]
        let hex3 = { loc: [coordArr[0] + 1 - columnOffset, coordArr[1] + 1] };
        // Non-Indented: [-1, 1] Indented [1 , 1]
        let hex4 = { loc: [coordArr[0] - columnOffset, coordArr[1] + 1] };
        // Either: [-1, 0]
        let hex5 = { loc: [coordArr[0] - 1, coordArr[1]] };

        hex0.hex = this.getHexAtCoord(hex0.loc);
        hex1.hex = this.getHexAtCoord(hex1.loc);
        hex2.hex = this.getHexAtCoord(hex2.loc);
        hex3.hex = this.getHexAtCoord(hex3.loc);
        hex4.hex = this.getHexAtCoord(hex4.loc);
        hex5.hex = this.getHexAtCoord(hex5.loc);

        hex0.edgeline = hex0.hex === 0 ? "none" : hex0.hex.getFaces()[3];
        hex1.edgeline = hex1.hex === 0 ? "none" : hex1.hex.getFaces()[4];
        hex2.edgeline = hex2.hex === 0 ? "none" : hex2.hex.getFaces()[5];
        hex3.edgeline = hex3.hex === 0 ? "none" : hex3.hex.getFaces()[0];
        hex4.edgeline = hex4.hex === 0 ? "none" : hex4.hex.getFaces()[1];
        hex5.edgeline = hex5.hex === 0 ? "none" : hex5.hex.getFaces()[2];

        return [hex0.edgeline, hex1.edgeline, hex2.edgeline, hex3.edgeline, hex4.edgeline, hex5.edgeline];
    }

    /** Sets the Hex at the coordinate pair. */
    // REVIEW: Make private?
    setHexAtCoord(coordArr, hex) {
        // NTS: We only invert the coordinate pair when we access the multidimensional array.
        this.grid[coordArr[1]][coordArr[0]] = hex;
    }

    /** Returns the Hex at the requested coordinate pair. */
    // REVIEW: Make private?
    getHexAtCoord(coordArr) {
        if (this.grid[coordArr[1]] === undefined) {
            // Uninitialized hexes are 0, so if the hex can't exist, then return 0.
            return 0;
        }

        if (this.grid[coordArr[1]][coordArr[0]] === undefined) {
            // Uninitialized hexes are 0, so if the hex can't exist, then return 0.
            return 0;
        }

        // NTS: We only invert the coordinate pair when we access the multidimensional array.
        return this.grid[coordArr[1]][coordArr[0]];
    }

    /**
     * Creates the Hexagon grid with its Hex images to be used on a
     * PIXI application. Returns the Sprites in an array.
     *
     * ```
     * let st = State.temporary;
     * st.pixi = new PIXI.Application({width: 960, height: 540});
     *
     * st.grid = new setup.hex.Grid({width: 6, height: 4});
     * st.grid.createGrid(st.pixi);
     * // Grid is now displayed to the PIXI application.
     * ```
     */
    createGrid(pixiApp) {
        /** Get the scale of each image, so we know the grid can fully fit on the PIXI app. */
        // BUG: Not scaling to smaller of two values.
        let solarr = [];
        let scale;
        if (pixiApp.renderer.width / this.width <= pixiApp.renderer.height / this.height) {
            scale = this.width - 3;
        } else {
            scale = this.height - 3;
        }

        // DESIRED: Convert to standard loop. `let idx in ...` is the slowest way to loop through arrays.
        for (let row in this.grid) {
            row = parseInt(row);

            let columnOffset = 0;
            if (row % 2 === 1) {
                columnOffset = 1;
            }

            for (let column in this.grid[row]) {
                column = parseInt(column);
                let hex = this.getHexAtCoord([column, row]);

                // Set the image to be used.
                let sprite = PIXI.Sprite.from(hex.src);

                // Scale the image appropriately.
                // TODO: Scaling currently weird.
                sprite.width = sprite.width / scale;
                sprite.height = sprite.height / scale;

                // Center the anchor point of the sprite to the
                // middle of the image so we can easily place each
                // cell of the grid.
                sprite.anchor.set(0.5, 0.5);

                // Determine the exact coordinate pair of each cell.
                sprite.x = (sprite.width / 2) * (column * 2 + 1 + columnOffset) - sprite.width / 2;
                sprite.y = (sprite.height / 2) * (row * 1.5 + 1) - sprite.height / 2;

                // Invert the image based on its configuration.
                switch (hex.configuration) {
                    case "inverted":
                    case "irOnce":
                    case "irTwice":
                    case "irThrice":
                    case "irQuarce":
                    case "irQuince":
                        sprite.scale.x *= -1;
                        break;
                }

                // Rotate the image based on its configuration.
                switch (hex.configuration) {
                    case "default":
                    case "inverted":
                        sprite.angle = 0;
                        break;
                    case "rOnce":
                    case "irOnce":
                        sprite.angle = 60;
                        break;
                    case "rTwice":
                    case "irTwice":
                        sprite.angle = 120;
                        break;
                    case "rThrice":
                    case "irThrice":
                        sprite.angle = 180;
                        break;
                    case "rQuarce":
                    case "irQuarce":
                        sprite.angle = 240;
                        break;
                    case "rQuince":
                    case "irQuince":
                        sprite.angle = 300;
                        break;
                }

                // Ensure no single pixel gap between Hexagons.
                sprite.scale.x *= 1.01;
                sprite.scale.y *= 1.01;

                // Set up some debug information.
                function debugCallback() {
                    console.log(`Hex ${hex.name} placed at: [${column}, ${row}]`);
                    // console.log(hex.required);
                }

                if (this.debug) {
                    sprite.interactive = true;
                    sprite.on("click", debugCallback);
                }

                solarr.push(sprite);
            }
        }
        return solarr;
    }
}

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.Grid = Grid;
})(setup);
