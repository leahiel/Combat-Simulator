// IIFE needed to add the quests to setup.
(function (S) {
    if (!S.maps) {
        S.maps = {};
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
    let map = {
        sequence: 0,

        interactables: [
            // Sequence 0
            [i0_0],
        ],
    };

    S.maps.questTest2 = map
})(setup);
