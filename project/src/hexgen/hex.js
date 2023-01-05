let DEFAULT_HEX = {
    configuration: "default",
};

/**
 * A Hex is associated with a background image, and stores that
 * background image's edge types and configuration.
 *
 * #### `<Hex>`.getFaces()
 * You can get the edges of a Hex in it's current configuration by
 * using `<Hex>.getFaces()`:
 * ```js
 * <Hex>.getFaces(); // => ["forest", "forest", "plains", "lake", "lake", "road"]
 * ```
 * Hexagon edges are laid out like this:
 *
 *            0 1
 *           5 ⬡ 2
 *            4 3
 *
 * #### Configuration
 * Hexes can be configured by being rotated or inverted. This changes
 * the associated background image by rotating [clockwise] or
 * inverting it [along the x-axis], and the Hex keeps track of these 
 * edge types. This allows us to make a grid of Hexes in various 
 * configurations, meaning we can use less art assets to make more 
 * backgrounds.
 *
 *   Rotated x1   Inverted
 *
 *      A B          E D
 *     F ⬡ C        F ⬡ C
 *      E D          A B
 *
 * TODO: Double check inversion.
 *
 * #### Automated Configuration
 * Hexes should be made from an object that contain all possible
 * configuration of edges in a field object named `edgelines`. That
 * is, the object should have an `edgelines` field that contains
 * something like:
 * ```js
 * edgelines: {
 *     default: ["forest", "forest", "plains", "lake", "lake", "road"],
 *     rOnce: ["road", "forest", "forest", "plains", "lake", "lake"],
 *     rTwice: ["lake", "road", "forest", "forest", "plains", "lake"],
 *     rThrice: ["lake", "lake", "road", "forest", "forest", "plains"],
 *     rQuarce: ["plains", "lake", "lake", "road", "forest", "forest"],
 *     rQuince: ["forest", "plains", "lake", "lake", "road", "forest"],
 *     inverted: ["forest", "forest", "road", "lake", "lake", "plains"],
 *     irOnce: ["plains", "forest", "forest", "road", "lake", "lake"],
 *     irTwice: ["lake", "plains", "forest", "forest", "road", "lake"],
 *     irThrice: ["lake", "lake", "plains", "forest", "forest", "road"],
 *     irQuarce: ["road", "lake", "lake", "plains", "forest", "forest"],
 *     irQuince: ["forest", "road", "lake", "lake", "plains", "forest"],
 * }
 * ```
 * This prevents uneccesary computation at the cost of ROM memory.
 * Should a Hex not have these fields, then when it is created, the
 * Hex will output the required configurations possible, based on the
 * `default` configuration, so that you can copy and paste them into
 * the hex object used to create the Hex.
 */
class Hex {
    constructor(hexSrc) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULT_HEX, hexSrc);

        /** If we don't have all the configurations for the hex, print to console some code that we can copy and paste in to make the configurations. */
        if (this.edgelines.rOnce === undefined || this.edgelines.inverted === undefined) {
            /** Returns an array that non-destructively moved the first item in the given array into the last place, effectively rotating it. */
            function rotate(arr) {
                let solarr = [...arr];
                solarr.unshift(solarr.pop());
                return solarr;
            }

            this.edgelines.rOnce = rotate(this.edgelines.default);
            this.edgelines.rTwice = rotate(this.edgelines.rOnce);
            this.edgelines.rThrice = rotate(this.edgelines.rTwice);
            this.edgelines.rQuarce = rotate(this.edgelines.rThrice);
            this.edgelines.rQuince = rotate(this.edgelines.rQuarce);

            // Default: [A, B, C, D, E, F]
            // Inverted: [E, D, C, B, A, F]
            // Note: We invert Hexes among the x-axis.
            this.edgelines.inverted = [...this.edgelines.rQuarce].reverse();
            this.edgelines.irOnce = rotate(this.edgelines.inverted);
            this.edgelines.irTwice = rotate(this.edgelines.irOnce);
            this.edgelines.irThrice = rotate(this.edgelines.irTwice);
            this.edgelines.irQuarce = rotate(this.edgelines.irThrice);
            this.edgelines.irQuince = rotate(this.edgelines.irQuarce);

            console.error(
                `This hex does not have the values in all possible configurations. Please copy and paste this code into the <Hex>.edgelines field object for ${this.src}:`
            );
            console.log(
                `rOnce: [${Hex.reportEdgelines(this.edgelines.rOnce)}],`,
                `\nrTwice: [${Hex.reportEdgelines(this.edgelines.rTwice)}],`,
                `\nrThrice: [${Hex.reportEdgelines(this.edgelines.rThrice)}],`,
                `\nrQuarce: [${Hex.reportEdgelines(this.edgelines.rQuarce)}],`,
                `\nrQuince: [${Hex.reportEdgelines(this.edgelines.rQuince)}],`,
                `\ninverted: [${Hex.reportEdgelines(this.edgelines.inverted)}],`,
                `\nirOnce: [${Hex.reportEdgelines(this.edgelines.irOnce)}],`,
                `\nirTwice: [${Hex.reportEdgelines(this.edgelines.irTwice)}],`,
                `\nirThrice: [${Hex.reportEdgelines(this.edgelines.irThrice)}],`,
                `\nirQuarce: [${Hex.reportEdgelines(this.edgelines.irQuarce)}],`,
                `\nirQuince: [${Hex.reportEdgelines(this.edgelines.irQuince)}],`
            );
        }

        return this;
    }

    /** Return the current order of the edgelines. */
    // DESIRED: Make Getter.
    getFaces() {
        return this.edgelines[this.configuration];
    }

    /** Rotate the hexagon's edges clockwise once. */
    // REVIEW: Make private?
    rotate() {
        switch (this.configuration) {
            case "default":
                this.configuration = "rOnce";
                break;
            case "rOnce":
                this.configuration = "rTwice";
                break;
            case "rTwice":
                this.configuration = "rThrice";
                break;
            case "rThrice":
                this.configuration = "rQuarce";
                break;
            case "rQuarce":
                this.configuration = "rQuince";
                break;
            case "rQuince":
                this.configuration = "default";
                break;
            case "inverted":
                this.configuration = "irOnce";
                break;
            case "irOnce":
                this.configuration = "irTwice";
                break;
            case "irTwice":
                this.configuration = "irThrice";
                break;
            case "irThrice":
                this.configuration = "irQuarce";
                break;
            case "irQuarce":
                this.configuration = "irQuince";
                break;
            case "irQuince":
                this.configuration = "inverted";
                break;
        }
    }

    /** Invert the edges along the x-axis. */
    // REVIEW: This isn't used. Keep it?
    // REVIEW: Make private?
    invert() {
        switch (this.configuration) {
            case "default":
                this.configuration = "inverted";
                break;
            case "rOnce":
                this.configuration = "irOnce";
                break;
            case "rTwice":
                this.configuration = "irTwice";
                break;
            case "rThrice":
                this.configuration = "irThrice";
                break;
            case "rQuarce":
                this.configuration = "irQuarce";
                break;
            case "rQuince":
                this.configuration = "irQuince";
                break;
            case "inverted":
                this.configuration = "default";
                break;
            case "irOnce":
                this.configuration = "rOnce";
                break;
            case "irTwice":
                this.configuration = "rTwice";
                break;
            case "irThrice":
                this.configuration = "rThrice";
                break;
            case "irQuarce":
                this.configuration = "rQuarce";
                break;
            case "irQuince":
                this.configuration = "rQuince";
                break;
        }
    }

    /** 
     * Turn the edges Array of a Hex into a string. This will let us 
     * copy and paste it, so that we don't have to manually compute 
     * each possible configuration of edges for a Hex.
     */
    static reportEdgelines(configuration) {
        let solStr = "";
        solStr += `"${configuration[0]}", `;
        solStr += `"${configuration[1]}", `;
        solStr += `"${configuration[2]}", `;
        solStr += `"${configuration[3]}", `;
        solStr += `"${configuration[4]}", `;
        solStr += `"${configuration[5]}"`;

        return solStr;
    }
}

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.Hex = Hex;
})(setup);
