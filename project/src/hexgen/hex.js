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
            /** Turn the array into a string that can be copy and pasted. */
            function reportEdgelines(configuration) {
                let solStr = "";
                solStr += `"${configuration[0]}", `;
                solStr += `"${configuration[1]}", `;
                solStr += `"${configuration[2]}", `;
                solStr += `"${configuration[3]}", `;
                solStr += `"${configuration[4]}", `;
                solStr += `"${configuration[5]}"`;

                return solStr;
            }

            this.edgelines.rOnce = [...this.edgelines.default];
            this.edgelines.rOnce.push(this.edgelines.rOnce.shift());

            this.edgelines.rTwice = [...this.edgelines.rOnce];
            this.edgelines.rTwice.push(this.edgelines.rTwice.shift());

            this.edgelines.rThrice = [...this.edgelines.rTwice];
            this.edgelines.rThrice.push(this.edgelines.rThrice.shift());

            this.edgelines.rQuarce = [...this.edgelines.rThrice];
            this.edgelines.rQuarce.push(this.edgelines.rQuarce.shift());

            this.edgelines.rQuince = [...this.edgelines.rQuarce];
            this.edgelines.rQuince.push(this.edgelines.rQuince.shift());

            this.edgelines.inverted = [...this.edgelines.default].reverse();

            this.edgelines.irOnce = [...this.edgelines.inverted];
            this.edgelines.irOnce.push(this.edgelines.irOnce.shift());

            this.edgelines.irTwice = [...this.edgelines.irOnce];
            this.edgelines.irTwice.push(this.edgelines.irTwice.shift());

            this.edgelines.irThrice = [...this.edgelines.irTwice];
            this.edgelines.irThrice.push(this.edgelines.irThrice.shift());

            this.edgelines.irQuarce = [...this.edgelines.irThrice];
            this.edgelines.irQuarce.push(this.edgelines.irQuarce.shift());

            this.edgelines.irQuince = [...this.edgelines.irQuarce];
            this.edgelines.irQuince.push(this.edgelines.irQuince.shift());

            console.error(
                `This hex does not display the correct values in all possible configurations. Please copy and paste this code into the hex information for ${this.src}:`
            );
            console.log(
                `rOnce: [${reportEdgelines(this.edgelines.rOnce)}],`,
                `\nrTwice: [${reportEdgelines(this.edgelines.rTwice)}],`,
                `\nrThrice: [${reportEdgelines(this.edgelines.rThrice)}],`,
                `\nrQuarce: [${reportEdgelines(this.edgelines.rQuarce)}],`,
                `\nrQuince: [${reportEdgelines(this.edgelines.rQuince)}],`,
                `\ninverted: [${reportEdgelines(this.edgelines.inverted)}],`,
                `\nirOnce: [${reportEdgelines(this.edgelines.irOnce)}],`,
                `\nirTwice: [${reportEdgelines(this.edgelines.irTwice)}],`,
                `\nirThrice: [${reportEdgelines(this.edgelines.irThrice)}],`,
                `\nirQuarce: [${reportEdgelines(this.edgelines.irQuarce)}],`,
                `\nirQuince: [${reportEdgelines(this.edgelines.irQuince)}],`
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
        // TODO: Test this.
        console.warning("Inverting hexes may display the wrong rotation. Proper math simply has not yet been done.");

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
}

(function (S) {
    if (!S.hex) {
        S.hex = {};
    }

    S.hex.Hex = Hex;
})(setup);
