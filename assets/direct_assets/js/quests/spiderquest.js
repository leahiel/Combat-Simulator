/**
 * Exterminate a spider infestion.
 *
 * Part A: Fight spiders on path to city.
 * Part B: Get to city and talk to mayor.
 * Part C: Exterminate many groups of spiders, culminating against miniboss with Daddy Spider.
 * Part D: Talk to mayor again, get pointed to main nest.
 * Part E: Kill momma spider boss. Duing this point, repeatable combat zones with baby spiders should occur.
 * Part F: Mission complete!
 */

// IIFE needed to add the quests to setup.
(function (S) {
    let svq = State.variables.quest;

    function map() {
        // TODO: Player Location should be functional. Atm it is random.
        svq.playerLoc = [5, 5];
        State.variables.canvas.interactableLocs = [[svq.playerLoc[0], svq.playerLoc[1]]];

        /**
         *  Reused Assets
         */
        // Quest Interactable
        let ittybittyman = function () {
            let interactableInstance = new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
                keepLoc: true, // This will always show.
                stopShowingSequence: 2,
                intersecting: function () {
                    let seq1_tb = {
                        showBackground: false,
                        backgroundSrc: "",
                        showDimmer: true,
                        showPortrait: false,
                        showSpeakerName: true,
                        lines: [
                            {
                                portrait: "assets/imported/img/png/turn_icon_pl.png",
                                speaker: "Concerned Man",
                                line: "There sure have been a lot of the itty bitties around recently, but they don't seem to do much damage, so they'll be perfect for some young folk like you to handle.",
                            },
                            {
                                speaker: "Narrator",
                                line: "You thank the man and move on.",
                            },
                        ],
                    };

                    new setup.tb.TextBox(seq1_tb);
                },
            });

            return interactableInstance;
        };

        let spiders = function () {
            new setup.map.Interactable("assets/imported/img/png/turn_icon_en.png", {
                intersecting: function () {
                    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                    // $(document).one(":textboxclosed", function () {
                    //     // TODO: :combatwon, :combatlost
                    //     setup.combats.CI_SPIDERS();
                    // });

                    console.log(this);

                    $(document).one(":combatwon", function () {
                        this.dispose();
                    });

                    $(document).one(":combatlost", function () {
                        $(document).off(":combatwon");
                    });
                },
            });
        };

        /**
         * Sequences
         */
        // Sequence 0
        let sequence0 = [
            // Combat Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/turn_icon_en.png", {
                    intersecting: function () {
                        new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                        $(document).one(":textboxclosed", function () {
                            $(document).one(":combatwon", function () {
                                State.variables.quest.sequence += 1;
                            });

                            $(document).one(":combatlost", function () {
                                $(document).off(":combatwon");
                            });

                            setup.combats.CI_BABYSPIDER1();
                        });

                        // TODO Make ":combatwon" and ":combatlost" events so that I can update sequence on win.
                    },
                });
            },

            ittybittyman,
        ];

        // Sequence 1
        let sequence1 = [
            // Flavor Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/turn_icon.png", {
                    intersecting: function () {
                        // Give the same flavor text box every time.
                        // TODO: It should be different from every other flavor textbox.
                        let value = uuidToNum(State.variables.uuid);
                        let flavortb = setup.tbs.flavor_tbs[value % setup.tbs.flavor_tbs.length];

                        new setup.tb.TextBox(flavortb);
                    },
                });
            },

            // City Interactable
            function () {
                new setup.map.Interactable("assets/imported/img/png/init_icon_pl.png", {
                    keepLoc: true,

                    intersecting: function (obj) {
                        let burkvin1 = {
                            showBackground: false, // TODO: Set True
                            backgroundSrc: "", // TODO: Image Src
                            showDimmer: true,
                            showPortrait: false,
                            showSpeakerName: true,
                            lines: [
                                {
                                    speaker: "Narrator",
                                    line: "Upon reaching Burkvinville, you and your party decide to head to the mayor's and see whats going on with all the spiders.",
                                },
                                {
                                    speaker: "Mayor",
                                    line: "Oh you're help to help us with our spider problem? Well it's quite simple, there are a lot of spiders! Can ya thin them out for us? We're still looking for their nest.",
                                },
                                {
                                    speaker: "Narrator",
                                    line: "You nod and leave the mayor's building.",
                                },
                            ],
                        };

                        // TODO: Make this CityMenu based on UUID instead of scripting it manually.
                        let city = new setup.map.CityMenu({
                            name: "Burkvinville",
                            hasGuildHall: true,
                            hasInn: true,
                        });

                        if (obj.timesVisited === 1) {
                            new setup.tb.TextBox(burkvin1);
                            $(document).trigger(":sequenceupdated");
                        }

                        city.display();
                    },
                });
            },
        ];

        let sequence2 = [spiders, spiders, spiders, spiders, spiders];

        /** Compile into object. */
        let map = {
            sequence: 0,

            interactables: [sequence0, sequence1, sequence2],

            mapBackground: [
                // Sequence 0
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 1
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 2
                "assets/imported/img/png/browncanvas.jpeg",
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

    S.maps.spiderQuest = map;
})(setup);
