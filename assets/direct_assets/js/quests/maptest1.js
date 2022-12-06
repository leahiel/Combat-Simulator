// Put Quest Details here.

// IIFE needed to add the quests to setup.
(function (S) {
    let svq = State.variables.quest;

    function map() {
        svq.playerLoc = [5, 5];
        State.temporary.interactableLocs = [[svq.playerLoc[0], svq.playerLoc[1]]];

        /** Interactables */
        // Sequence 0
        let sequence0 = [
            // Combat Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/turn_icon_en.png", {
                    intersecting: function () {
                        new setup.tb.TextBox(i0_1tb);

                        $(document).one(":textboxclosed", function () {
                            // TODO: :combatwon, :combatlost
                            setup.combats.CI_MOMMASPIDER();
                        });

                        // TODO Make ":combatwon" and ":combatlost" events so that I can update sequence on win.
                    },
                });
            },

            // Flavor Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
                    intersecting: function () {
                        // NYI This should result in the same flavorTB every time.
                        let flavortb = setup.tbs.flavor_tbs.random();

                        new setup.tb.TextBox(flavortb);
                    },
                });
            },

            // City Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/init_icon_pl.png", {
                    keepLoc: true,

                    intersecting: function () {
                        // TODO: Make this CityMenu based on UUID instead of scripting it manually.
                        let city = new setup.map.CityMenu({
                            name: "Testing City c:",
                            hasGuildHall: true,

                            hasInn: true,
                        });

                        city.display();
                    },
                });
            },
        ];

        let sequence1 = mergeArray(sequence0);
        sequence1.pop();

        /** Compile into object. */
        let map = {
            sequence: 0,

            interactables: [
                // Sequence 0
                sequence0,
                // Sequence 1
                sequence1,
            ],

            mapBackground: [
                // Sequence 0
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 1
                undefined,
            ],
        };

        return map;
    }

    if (!S.maps) {
        S.maps = {};
    }

    if (!svq) {
        svq = {};
    }

    S.maps.questTest1 = map; // This should be map, not questTest1.
})(setup);
