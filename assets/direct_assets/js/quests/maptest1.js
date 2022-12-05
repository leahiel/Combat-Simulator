// Add the quests to setup.
(function (S) {
    if (!S.quests) {
        S.quests = {};
    }

    /** Interactables */
    let i0_0 = function () {
        let svm = State.variables.map;

        new setup.map.Interactable("assets/imported/img/png/turn_icon_en.png", {
            top: svm.gF * 3,
            left: svm.gF * 3,
            intersecting: function () {
                State.variables.ci = new setup.COM.CombatInstance({
                    winPassage: "MapTesting",
                    losePassage: "MapTesting",
                    ep: ["EN_BABY_SPIDER", "EN_MOMMY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
                });

                Engine.play("Combat_Overlord");
            },
        });
    };

    let i0_1tb = {
        lines: [{
                line: "No portrait here!",
            },
            {
                line: "String 2",
            },
        ],
    };

    let i0_1 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 4,
            left: svm.gF * 4,
            intersecting: function () {
                new setup.tb.TextBox(i0_1tb);
            },
        });
    };

    let i0_2tb = {
        showPortrait: true,
        lines: [{
                line: "The portrait should be showing here.",
            },
            {
                line: "String 2",
            },
        ],
    };

    let i0_2 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 8,
            left: svm.gF * 12,
            intersecting: function () {
                new setup.tb.TextBox(i0_2tb);
            },
        });
    };

    let i0_3tb = {
        showSpeakerName: true,
        showPortrait: true,
        lines: [{
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
    };

    let i0_3 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 6,
            left: svm.gF * 22,
            intersecting: function () {
                new setup.tb.TextBox(i0_3tb);
            },
        });
    };

    let i0_4tb = {
        showBackground: true,
        backgroundSrc: "assets/imported/img/png/tavern1.png",
        lines: [{
            line: "background image testing.",
        }, ],
    };

    let i0_4 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 15,
            left: svm.gF * 21,
            intersecting: function () {
                new setup.tb.TextBox(i0_4tb);
            },
        });
    };

    let i1_0gatherinfotb = {
        showBackground: true,
        backgroundSrc: "assets/imported/img/png/tavern1.png",
        lines: [{
            line: "We're gathering info!",
        },],
    };

    let i1_0taverntb = {
        showBackground: true,
        backgroundSrc: "assets/imported/img/png/tavern1.png",
        lines: [{
            line: "We've at the tavern!",
        },],
    };

    const i1_0city = new setup.map.CityMenu({
        name: "Testing City c:",
        hasGuildHall: true,

        hasInn: true,
        innHandler: function (menu) {},

        hasGatherInfo: true,
        gatherInfoHandler: function (menu) {
            new setup.tb.TextBox(i1_0gatherinfotb);
        },
        hasTavern: true,
        tavernHandler: function (menu) {
            new setup.tb.TextBox(i1_0taverntb);
        },
    });

    let i1_0 = function () {
        let svm = State.variables.map;

        new setup.map.Interactable("assets/imported/img/png/init_icon_pl.png", {
            top: svm.gF * 15,
            left: svm.gF * 15,
            intersecting: function () {
                i1_0city.display();
            },
        });
    };

    /** Compile into object. */
    let questTest1 = {
        sequence: 0,

        interactables: [
            // Sequence 0
            [i0_0, i0_1, i0_2, i0_3, i0_4],
            // Sequence 1
            [i1_0],
        ],
    };

    S.quests.questTest1 = questTest1;
})(setup);
