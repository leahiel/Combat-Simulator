let DEFAULT_GRID = {
    width: 5,
    height: 5,
};

/**
 *
 */
class Grid {
    constructor(gridOptions) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_GRID, gridOptions);

        this.generateEmptyGrid();
        this.generatePopulatedGrid();

        return this;
    }

    /** Generates an empty grid based on the built-in width and height values. */
    generateEmptyGrid() {
        // Width dictates the length of each row.
        // Height dictates the number of rows.

        this.grid = Array(this.height).fill(0);
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
        let int = 1;

        for (let h = 0; h < this.height; h++) {
            for (let w = 0; w < this.width; w++) {
                // Because the grid is offset on odd rows, there is one less cell to populate on those rows.
                if (this.getHexAtCoord([w, h]) !== undefined) {
                    // TODO: Ensure the Hex follows the rules for proper placement.
                    let hex = new Hex(setup.hex.hexii[0]);
                    this.setHexAtCoord([w, h], hex);
                }

                int++;
            }
        }
    }

    /** Sets the hex at the coordinate pair. */
    setHexAtCoord(coordArr, hex) {
        this.grid[coordArr[1]][coordArr[0]] = hex;
    }

    /** Returns the hex at the request coordinate pair. */
    getHexAtCoord(coordArr) {
        if (this.grid[coordArr[1]] === undefined) {
            return undefined;
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
            let columnOffset = 0;
            if (row % 2 === 1) {
                columnOffset = 1;
            }

            for (let column in this.grid[row]) {
                // TODO: Set using Hex.configuration.
                let sprite = PIXI.Sprite.from("project/src/hexgen/heximg/ph_1.png");

                // Scaling currently weird.
                sprite.width = sprite.width / scale;
                sprite.height = sprite.height / scale;

                // Center the anchor point of the sprite to the middle of the image so we can easily place each cell of the grid.
                sprite.anchor.set(0.5, 0.5);

                // Determine the exact coordinate pair of each cell.
                sprite.x = (sprite.width / 2) * (column * 2 + 1 + columnOffset);
                sprite.y = (sprite.height / 2) * (row * 1.5 + 1);

                // TODO: Invert the image.
                // TODO: Set using Hex.configuration.

                // Rotate the image.
                // TODO: Set using Hex.configuration.
                sprite.angle = 60 * column;

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
