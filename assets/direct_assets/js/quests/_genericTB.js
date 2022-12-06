// IIFE needed to add the textboxs to setup.
(function (S) {
    if (!S.tbs) {
        S.tbs = {};
    }

    let inn_tbs = [
        {
            lines: [
                {
                    line: "Welcome to our inn!",
                },
            ],
        },
        {
            lines: [
                {
                    line: "Oh, a visitor! Welcome!",
                },
            ],
        },
        {
            lines: [
                {
                    line: "We got rooms available, feel free to stay the night!",
                },
            ],
        },
        {
            lines: [
                {
                    line: "Welcome to our- Oh, how cute! We'll give you the best bed!",
                },
            ],
        },
        {
            lines: [
                {
                    line: "First time here? There's an extra fee involved.",
                },
            ],
        },
    ];

    let flavor_tbs = [
        {
            lines: [
                {
                    line: "No portrait here!",
                },
                {
                    line: "String 2",
                },
            ],
        },
        {
            showPortrait: true,
            lines: [
                {
                    line: "The portrait should be showing here.",
                },
                {
                    line: "String 2",
                },
            ],
        },
        {
            showSpeakerName: true,
            showPortrait: true,
            lines: [
                {
                    line: "An unknown speaker should be here.",
                },
                {
                    portrait: "assets/imported/img/png/turn_icon_pl.png",
                    speaker: "redrect3",
                    line: "The portrait and name should be showing here.",
                },
                {
                    line: "The same name should sitll be here",
                },
                {
                    portrait: "assets/imported/img/png/turn_icon.png",
                    speaker: "new name",
                    line: "A new name should now appear.",
                },
            ],
        },
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [
                {
                    line: "background image testing.",
                },
            ],
        },
    ];

    /** Gathering Info should show quest specific information. */
    let gatherinfo_tbs = [
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [
                {
                    line: "We're gathering info!",
                },
            ],
        },
    ];

    /** The tavern is for generic information about the game. Enemies, spells, items... */
    let tavern_tbs = [
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [
                {
                    line: "Stay awhile and listen.",
                },
            ],
        },
    ];

    S.tbs.inn_tbs = inn_tbs;
    S.tbs.flavor_tbs = flavor_tbs;
    S.tbs.gatherinfo_tbs = gatherinfo_tbs;
    S.tbs.tavern_tbs = tavern_tbs;
})(setup);
