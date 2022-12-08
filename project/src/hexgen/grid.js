let DEFAULT_GRID = {
    // Number of Columns
    width: 4,
    // Number of Rows
    height: 4,
    debug: true,
};

/**
 *
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
            console.debug("All hexii have been checked.");
        }

        this.generateEmptyGrid();
        this.generatePopulatedGrid();

        return this;
    }

    /** Generates an empty grid based on the built-in width and height values. */
    generateEmptyGrid() {
        // Width dictates the length of each row.
        // Height dictates the number of rows.

        // REVIEW: Do I want to fill the Arrays with `0` or with `'empty'` or with an empty/special `<Hex>`? Currently they are filled with `0`.

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

    /** Populates an empty grid with hexes. */
    generatePopulatedGrid() {
        /* Of note, hexagon edgelines are laid out like this:
         *
         *              1       2
         *
         *          6      hex       3
         *
         *              5       4
         */

        // Go through each coord and assign them a value.
        for (let rowNum = 0; rowNum < this.height; rowNum++) {
            for (let columnNum = 0; columnNum < this.width; columnNum++) {
                // Because the grid is offset on odd rows, there is one less cell to populate on those rows.
                if (rowNum % 2 === 1 && columnNum === this.width - 1) {
                    continue;
                }

                /** An array of the edgelines around the hex that is to be placed. */
                let adjacentEdgelines = this.getAdjacentEdgelines([columnNum, rowNum]);

                // Get array of hexes with their configurations that fulfill the adjacentEdgelines conditions.
                let potentialHexii = this.getPotentialHexii(adjacentEdgelines);

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
     * Returns an array of objects.
     *
     * The objects are formatted like:
     * obj = {
     *      hex: <Hex>,
     *      configuration: "configuration",
     *      required: edgelineArray,
     *      weight: 10, // NYI
     * }
     */
    getPotentialHexii(edgelineArray) {
        // [ "lake", "lake", "none", "none", "none", "plains" ]
        let solarr = [];

        for (let hex of hexii) {
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

        // Bare minimal error checking.
        if (solarr.length === 0) {
            throw `No viable hex solutions were found for [${Hex.reportEdgelines(edgelineArray)}].`;
        }

        return solarr;
    }

    /** Returns an array with the adjacent edgelines. */
    getAdjacentEdgelines(coordArr) {
        let columnOffset = 0;
        if (coordArr[1] % 2 === 0) {
            // Account for the row offset.
            columnOffset = 1;
        }

        /**
         *              1       2
         *
         *          6      hex       3
         *
         *              5       4
         */

        // ☑ Non-Indented: [-1, -1] Indented [0 , -1]
        let hex1 = { loc: [coordArr[0] - columnOffset, coordArr[1] - 1] };
        // ☑ Non-Indented: [0, -1] Indented [1 , -1]
        let hex2 = { loc: [coordArr[0] + 1 - columnOffset, coordArr[1] - 1] };
        // ☑ Either: [1, 0]
        let hex3 = { loc: [coordArr[0] + 1, coordArr[1]] };
        // ☑ Non-Indented: [0, 1] Indented [1 , 1]
        let hex4 = { loc: [coordArr[0] + 1 - columnOffset, coordArr[1] + 1] };
        // ☑ Non-Indented: [-1, 1] Indented [1 , 1]
        let hex5 = { loc: [coordArr[0] - columnOffset, coordArr[1] + 1] };
        // ☑ Either: [-1, 0]
        let hex6 = { loc: [coordArr[0] - 1, coordArr[1]] };

        hex1.hex = this.getHexAtCoord(hex1.loc);
        hex2.hex = this.getHexAtCoord(hex2.loc);
        hex3.hex = this.getHexAtCoord(hex3.loc);
        hex4.hex = this.getHexAtCoord(hex4.loc);
        hex5.hex = this.getHexAtCoord(hex5.loc);
        hex6.hex = this.getHexAtCoord(hex6.loc);

        hex1.edgeline = hex1.hex === 0 ? "none" : hex1.hex.getFaces()[3];
        hex2.edgeline = hex2.hex === 0 ? "none" : hex2.hex.getFaces()[4];
        hex3.edgeline = hex3.hex === 0 ? "none" : hex3.hex.getFaces()[5];
        hex4.edgeline = hex4.hex === 0 ? "none" : hex4.hex.getFaces()[0];
        hex5.edgeline = hex5.hex === 0 ? "none" : hex5.hex.getFaces()[1];
        hex6.edgeline = hex6.hex === 0 ? "none" : hex6.hex.getFaces()[2];

        return [hex1.edgeline, hex2.edgeline, hex3.edgeline, hex4.edgeline, hex5.edgeline, hex6.edgeline];
    }

    /** Sets the hex at the coordinate pair. */
    setHexAtCoord(coordArr, hex) {
        this.grid[coordArr[1]][coordArr[0]] = hex;
    }

    /** Returns the hex at the request coordinate pair. */
    getHexAtCoord(coordArr) {
        if (this.grid[coordArr[1]] === undefined) {
            // Uninitialized hexes are 0, so if the hex can't exist, then return 0.
            return 0;
        }

        if (this.grid[coordArr[1]][coordArr[0]] === undefined) {
            // Uninitialized hexes are 0, so if the hex can't exist, then return 0.
            return 0;
        }

        return this.grid[coordArr[1]][coordArr[0]];
    }

    displayGrid(pixiApp) {
        /** Get the scale of each image, so we know the grid can fully fit on the PIXI app. */
        /** BUG: Not scaling to smaller of two values. */
        let scale;
        if (pixiApp.renderer.width / this.width <= pixiApp.renderer.height / this.height) {
            scale = this.width;
        } else {
            scale = this.height;
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

                // TODO: Scaling currently weird.
                sprite.width = sprite.width / scale;
                sprite.height = sprite.height / scale;

                // Center the anchor point of the sprite to the middle of the image so we can easily place each cell of the grid.
                sprite.anchor.set(0.5, 0.5);

                // Determine the exact coordinate pair of each cell.
                sprite.x = (sprite.width / 2) * (column * 2 + 1 + columnOffset);
                sprite.y = (sprite.height / 2) * (row * 1.5 + 1);

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

                function debugcallback() {
                    console.log(`Following Hex ${hex.name} placed at: [${column}, ${row}]`);
                    console.log(hex.required);
                }

                if (this.debug) {
                    sprite.interactive = true;
                    sprite.on("click", debugcallback);
                }

                pixiApp.stage.addChild(sprite);
            }
        }
    }
}

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.Grid = Grid;
})(setup);
