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
                $(".canvas-container").addClass("hidden");
                svm = undefined;

                State.variables.ci = new setup.COM.CombatInstance({
                    winPassage: "MapTesting",
                    losePassage: "MapTesting",
                    ep: ["EN_BABY_SPIDER", "EN_MOMMY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
                });

                Engine.play("Combat_Overlord");
            },
        });
    };

    /** Compile into object. */
    let questTest2 = {
        sequence: 0,

        interactables: [
            // Sequence 0
            [i0_0],
        ],
    };

    S.quests.questTest2 = questTest2;
})(setup);
