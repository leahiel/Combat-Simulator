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

    let tarvern_tbs = [
        {
            showBackground: true,
            backgroundSrc: "assets/imported/img/png/tavern1.png",
            lines: [
                {
                    line: "We've at the tavern!",
                },
            ],
        },
    ];

    S.tbs.inn_tbs = inn_tbs;
    S.tbs.flavor_tbs = flavor_tbs;
    S.tbs.gatherinfo_tbs = gatherinfo_tbs;
    S.tbs.tarvern_tbs = tarvern_tbs;
})(setup);
