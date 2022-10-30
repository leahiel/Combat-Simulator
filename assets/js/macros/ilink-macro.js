/*
        <<ilink "link text", "#idname", ".classname">>
        <<ilink "link text", "data-passage name text" "#idname", ".classname">>
        <<ibutton "button text", "#idname", ".classname">>
        <<ibutton "button text", "data-passage name text" "#idname", ".classname">>


        TODO: Update from this macro to Malifacious's <<a>> macro:
        https://github.com/MalifaciousGames/Mali-s-Macros#the-a-macro
*/

Macro.add(["ibutton", "ilink"], {
    isAsync: true,
    tags: ["comment"],
    handler() {
        if (this.args.length === 0) {
            return this.error(`no ${this.name === "ibutton" ? "button" : "link"} text specified`);
        }

        const $link = jQuery(document.createElement(this.name === "ibutton" ? "button" : "a"));
        /** @type {string|undefined} */
        let passage;
        /** @type {string[]} */
        let extraClasses = [];
        /** @type {string|undefined} */
        let extraId;

        if (typeof this.args[0] === "object") {
            if (this.args[0].isImage) {
                // Argument was in wiki image syntax.
                const $image = jQuery(document.createElement("img")).attr("src", this.args[0].source).appendTo($link);

                if (this.args[0].hasOwnProperty("passage")) {
                    $image.attr("data-passage", this.args[0].passage);
                }
                if (this.args[0].hasOwnProperty("title")) {
                    $image.attr("title", this.args[0].title);
                }
                if (this.args[0].hasOwnProperty("align")) {
                    $image.attr("align", this.args[0].align);
                }

                passage = this.args[0].link;
            } else {
                // Argument was in wiki link syntax.
                $link.append(document.createTextNode(this.args[0].text));
                passage = this.args[0].link;
            }
        } else {
            // Argument was simply the link text.
            $link.wikiWithOptions(
                {
                    profile: "core",
                },
                this.args[0]
            );
            let passageIdx = 1;
            while (this.args.length > passageIdx) {
                let val = String(this.args[passageIdx]);
                if (val.startsWith(".")) {
                    extraClasses.push(val.substring(1));
                } else if (val.startsWith("#")) {
                    extraId = val.substring(1);
                } else {
                    passage = val;
                }
                ++passageIdx;
            }
        }

        if (passage != null) {
            // lazy equality for null
            $link.attr("data-passage", passage);

            if (Story.has(passage)) {
                $link.addClass("link-internal");

                if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
                    $link.addClass("link-visited");
                }
            } else {
                $link.addClass("link-broken");
            }
        } else {
            $link.addClass("link-internal");
        }
        extraClasses.filter((c) => !!c).forEach((c) => $link.addClass(c));
        extraId && $link.attr("id", extraId);

        $link
            .addClass(`macro-${this.name}`)
            .ariaClick(
                {
                    namespace: ".macros",
                    one: passage != null, // lazy equality for null
                },
                this.createShadowWrapper(
                    this.payload[0].contents !== "" ? () => Wikifier.wikifyEval(this.payload[0].contents.trim()) : null,
                    passage != null // lazy equality for null
                        ? () => Engine.play(passage)
                        : null
                )
            )
            .appendTo(this.output);
    },
});
