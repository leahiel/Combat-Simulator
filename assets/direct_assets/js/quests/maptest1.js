// IIFE needed to add the quests to setup.
(function (S) {
    let sv = State.variables;

    if (!S.maps) {
        S.maps = {};
    }

    if (!S.quests) {
        S.quests = {};
    }

    if (!sv.quest) {
        sv.quest = {};
    }

    /** This eventually will be given by the quest class, and not the map. */
    let uuid = setup.uuid_v4();

    State.variables.quest.playerLoc = [5, 5];

    /** Interactables */
    let i0_0 = function () {
        let svm = State.variables.map;

        new setup.map.Interactable("assets/imported/img/png/turn_icon_en.png", {
            top: svm.gF * 3, // TODO Make deterministic on uuid within DEFAULT_TB and remove these lines from all interactables
            left: svm.gF * 3, // TODO Make deterministic on uuid within DEFAULT_TB
            intersecting: function () {
                new setup.tb.TextBox(i0_1tb);

                $(document).one(":textboxclosed", function () {
                    // TODO: :combatwon, :combatlost
                    setup.combats.CI_MOMMASPIDER();
                });

                // TODO Make ":combatwon" and ":combatlost" events so that I can update sequence on win.
            },
        });
    };

    let i0_1 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 4,
            left: svm.gF * 4,
            intersecting: function () {
                // In order to make RNG things, I would need to seed a UUID into the quest, which is then used here to pick a textbox from an array.
                new setup.tb.TextBox(setup.tbs.flavor_tbs[0]);
            },
        });
    };

    let i0_2 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 8,
            left: svm.gF * 12,
            intersecting: function () {
                new setup.tb.TextBox(setup.tbs.flavor_tbs[1]);
            },
        });
    };

    let i0_3 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 6,
            left: svm.gF * 22,
            intersecting: function () {
                new setup.tb.TextBox(setup.tbs.flavor_tbs[2]);
            },
        });
    };

    let i0_4 = function () {
        let svm = State.variables.map;
        new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
            top: svm.gF * 15,
            left: svm.gF * 21,
            intersecting: function () {
                new setup.tb.TextBox(setup.tbs.flavor_tbs[3]);
            },
        });
    };

    const i1_0city = new setup.map.CityMenu({
        uuid: uuid,
        name: "Testing City c:",
        hasGuildHall: true,

        hasInn: true,
        
    });

    let i1_0 = function () {
        let svm = State.variables.map;

        new setup.map.Interactable("assets/imported/img/png/init_icon_pl.png", {
            top: svm.gF * 15,
            left: svm.gF * 15,
            intersecting: function () {
                // TODO: Make this CityMenu based on UUID instead of scripting it manually.
                i1_0city.display();
            },
        });
    };

    /** Compile into object. */
    let map = {
        sequence: 0,

        interactables: [
            // Sequence 0
            [i0_0, i0_1, i0_2, i0_3, i0_4],
            // Sequence 1
            [i0_1, i1_0],
        ],
    };

    S.quests.uuid = uuid;
    S.maps.questTest1 = map; // This should be map, not questTest1.
})(setup);
