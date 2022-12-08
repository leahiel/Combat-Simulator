let DEFAULT_HEX = {
    configuration: "default",
};

/**
 *
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

            // Default: [1, 2, 3, 4, 5, 6]
            // Inverted: [5, 4, 3, 2, 1, 6]  // [6, 1, 2, 3, 4, 5]
            // That's just how the inversion should be since we invert on the x-axis.
            this.edgelines.inverted = [...this.edgelines.rQuarce].reverse();
            this.edgelines.irOnce = rotate(this.edgelines.inverted);
            this.edgelines.irTwice = rotate(this.edgelines.irOnce);
            this.edgelines.irThrice = rotate(this.edgelines.irTwice);
            this.edgelines.irQuarce = rotate(this.edgelines.irThrice);
            this.edgelines.irQuince = rotate(this.edgelines.irQuarce);

            console.error(
                `This hex does not have the values in all possible configurations. Please copy and paste this code into the <Hex>.edgelines array for ${this.src}:`
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
    getFaces() {
        return this.edgelines[this.configuration];
    }

    /** Invert the edgelines. */
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

    /** Rotate the hexagon's edgelines. */
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

        console.log(this.getFaces());
    }

    /** Turn the array into a string that can be copy and pasted. */
    static reportEdgelines(configuration) {
        let solStr = "";
        solStr += `"${configuration[0]}", `;
        solStr += `"${configuration[1]}", `;
        solStr += `"${configuration[2]}", `;
        solStr += `"${configuration[3]}", `;
        solStr += `"${configuration[4]}", `;
        solStr += `"${configuration[5]}"`;

        return solStr;
    };
}

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.Hex = Hex;
})(setup);
