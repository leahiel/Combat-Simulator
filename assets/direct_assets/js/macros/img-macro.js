/*
        <<img "src/to/image" hori/verti-left/verti-right blur=true>>
*/

Macro.add("img", {
    handler() {
        if (typeof this.args[0] !== "string") {
            return this.error("the first arg must be the src to your image");
        }

        if (typeof this.args[1] !== "string") {
            return this.error(`the second arg must be one of: "hori", "verti-left", "verti-right"`);
        }

        let blurred = "";
        if (typeof this.args[2] === "undefined" || this.args[2] === true) {
            // TODO: If settings.noblur, don't blur images.
            blurred = `class=blurred`;
        }

        if (this.args[1] === "hori") {
            // Horizontally position the image.
            $(this.output).wiki(`<br><imghori><img src="${this.args[0]}" ${blurred}></imghori>`);
        }

        if (this.args[1] === "verti-left") {
            // Horizontally position the image.
            $(this.output).wiki(
                `<br><imgverti style="float: left; clear: left;"><img src="${this.args[0]}" ${blurred}></imgverti>`
            );
        }

        if (this.args[1] === "verti-right") {
            // Horizontally position the image.
            $(this.output).wiki(
                `<br><imgverti style="float: right; clear: right;"><img src="${this.args[0]}" ${blurred}></imgverti>`
            );
        }
    },
});
