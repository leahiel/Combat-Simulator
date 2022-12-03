/*
        <<bg "src/to/image" decimal>>
*/

// Essentially adds this:
// html[data-tags~="start"] {
//     background-image: linear-gradient(rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), url("project/imported_assets/img/mangroves.jpeg");
//     background-size: cover;
//     height: 100vh;
// }

Macro.add("bg", {
    handler() {
        if (this.args.length !== 2) {
            return this.error("requires precisely two args: a url and a decimal");
        }

        if (typeof this.args[0] !== "string") {
            return this.error("the first arg must be a string");
        }

        if (typeof this.args[1] !== "number" && this.args[1] >= 0 && this.args[1] <= 1) {
            return this.error("the second arg must be a decimal between 0 and 1");
        }

        // Just insert the code into whatever style sheet is first lmao.
        let sheet = window.document.styleSheets[0];
        // If we just keep inserting more rules into the first place, we'll be in trouble.
        // XXX: Surely there's an issue with this. I'm deleting whatever is at 0 before making sure it's my code...
        // Just gotta find the future bug first...
        sheet.deleteRule(0);
        // DESIRED: I should have this transition nicely. At the moment, it's effectively just a harsh jump cut.
        sheet.insertRule(
            `
            html {
                background-image: linear-gradient(rgba(0, 0, 0, ${this.args[1]}), rgba(0, 0, 0, ${this.args[1]})), url(${this.args[0]});
                background-size: cover;
            }
        `,
            0
        );
    },
});
