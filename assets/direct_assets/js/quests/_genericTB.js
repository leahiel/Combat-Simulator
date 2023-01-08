// IIFE needed to add the textboxs to setup.
(function (S) {
    if (!S.tbs) {
        S.tbs = {};
    }

    let inn_tbs = [
        {
            lines: [
                new Line({
                    line: "Welcome to our inn!",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    line: "Oh, a visitor! Welcome!",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    line: "We got rooms available, feel free to stay the night!",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    line: "Welcome to our- Oh, how cute! We'll give you the best bed!",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    line: "First time here? There's an extra fee involved.",
                }),
            ],
        },
    ];

    let flavor_tbs = [
        {
            lines: [
                new Line({
                    line: "No portrait here!",
                }),
                new Line({
                    line: "String 2",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    portrait: "assets/imported/img/png/turn_icon_pl.png",
                    line: "The portrait should be showing here.",
                }),
                new Line({
                    line: "And here too!.",
                }),
            ],
        },
        {
            lines: [
                new Line({
                    line: "An unknown speaker should be here.",
                }),

                new Line({
                    portrait: "assets/imported/img/png/turn_icon_pl.png",
                    speaker: "redrect3",
                    line: "The portrait and name should be showing here.",
                }),
                new Line({
                    line: "The same and portrait name should sitll be here",
                }),
                new Line({
                    portrait: "assets/imported/img/png/turn_icon.png",
                    speaker: "new name",
                    line: "A new name should now appear.",
                }),
            ],
        },
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [new Line({ line: "background image testing." })],
        },
    ];

    /** Gathering Info should show quest specific information. */
    let gatherinfo_tbs = [
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [new Line({ line: "We're gathering info!" })],
        },
    ];

    /** The tavern is for generic information about the game. Enemies, spells, items... */
    let tavern_tbs = [
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [new Line({ line: "Stay awhile and listen." })],
        },
    ];

    S.tbs.inn_tbs = inn_tbs;
    S.tbs.flavor_tbs = flavor_tbs;
    S.tbs.gatherinfo_tbs = gatherinfo_tbs;
    S.tbs.tavern_tbs = tavern_tbs;
})(setup);
