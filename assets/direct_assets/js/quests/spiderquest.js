// TODO: Get this quest functional, then make a quest class with this as a base.

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
    function map() {
        let sv = State.variables;

        /**
         * 88""Yb 888888 88   88 .dP"Y8 888888 8888b.         db    .dP"Y8 .dP"Y8 888888 888888 .dP"Y8
         * 88__dP 88__   88   88 `Ybo." 88__    8I  Yb       dPYb   `Ybo." `Ybo." 88__     88   `Ybo."
         * 88"Yb  88""   Y8   8P o.`Y8b 88""    8I  dY      dP__Yb  o.`Y8b o.`Y8b 88""     88   o.`Y8b
         * 88  Yb 888888 `YbodP' 8bodP' 888888 8888Y"      dP""""Yb 8bodP' 8bodP' 888888   88   8bodP'
         */
        // Quest Interactable
        let ittybittyman = function () {
            let interactableInstance = new setup.quest.Interactable({
                imgSrc: "assets/imported/img/png/turn_icon.png",
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
            let interactable = new setup.quest.Interactable({
                imgSrc: "assets/imported/img/png/turn_icon_en.png",
                intersecting: function () {
                    let big_spider_tb = {
                        showBackground: false,
                        backgroundSrc: "",
                        showDimmer: true,
                        showPortrait: false,
                        showSpeakerName: true,
                        lines: [
                            {
                                portrait: "assets/imported/img/png/turn_icon_pl.png",
                                speaker: "Narrator",
                                line: "In the distance you see a bigger spider along with its family moving about. Curious about the size of the beast, you decide to check it out.",
                            },
                        ],
                    };

                    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                    $(document).one(":textboxclosed", function () {
                        // TODO: :combatwon, :combatlost
                        setup.combats.CI_SPIDERS();
                    });

                    $(document).one(":combatwon", function () {
                        sv.quest.subquest += 1;
                        if (sv.quest.subquest >= 5) {
                            sv.quest.sequence += 1;
                            new setup.tb.TextBox(big_spider_tb);
                        }
                    });

                    $(document).one(":combatlost", function () {
                        $(document).off(":combatwon");
                    });
                },
            });

            return interactable;
        };

        /**
         * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888 .dP"Y8
         * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__   `Ybo."
         * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""   o.`Y8b
         * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888 8bodP'
         */

        let sequences = [
            // Sequence 0
            [
                // Combat Interactable
                function () {
                    let interactable = new setup.quest.Interactable({
                        imgSrc: "assets/imported/img/png/turn_icon_en.png",
                        position: {x: 3, y: 6},
                        intersecting: function () {
                            new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                            $(document).one(":textboxclosed", function () {
                                sv.map = null;
                                State.variables.pixi = null;
                                $('#passage-map canvas').remove();

                                $(document).one(":combatwon", function () {
                                    // NOTE: These two lines should be a quest method
                                    console.log(sv.quest.sequence);
                                    sv.quest.sequence += 1;
                                    console.log(sv.quest.sequence);
                                    sv.quest.sequenceLoaded = false;
                                });

                                $(document).one(":combatlost", function () {
                                    $(document).off(":combatwon");
                                });

                                setup.combats.CI_BABYSPIDER1();
                            });
                        },
                    });

                    return interactable;
                },

                ittybittyman,
            ],

            // Sequence 1
            [spiders],
        ];

        // Sequence 2
        let sequence2 = [spiders, spiders, spiders, spiders, spiders];

        // Sequence 3
        let sequence3 = [
            // Combat Interactable
            function () {
                new setup.quest.Interactable({
                    imgSrc: "assets/imported/img/png/turn_icon_en.png", 
                    intersecting: function () {
                        new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                        $(document).one(":textboxclosed", function () {
                            $(document).one(":combatwon", function () {
                                State.variables.quest.sequence += 1;
                            });

                            $(document).one(":combatlost", function () {
                                $(document).off(":combatwon");
                            });

                            setup.combats.CI_DADDYSPIDER();
                        });

                        // TODO Make ":combatwon" and ":combatlost" events so that I can update sequence on win.
                    },
                });
            },
        ];

        // Sequence 4
        let sequence4 = []; // Return back to town.

        // Sequence 5
        let sequence5 = []; // Return back to town.

        let quest = {
            playerLoc: { x: 2, y: 6 },
            interactables: [],
            sequence: 0,
            sequences: sequences,

            // NYI
            objectives: [
                // Sequence 0
                "Find the city.",
                // Sequence 1
                "Talk to mayor.",
                // Sequence 2
                "Exterminate five groups of spiders.",
                // Sequence 3
                "Exterminate the bigger spider.",
                // Sequence 4
                "Report back to the mayor.",
                // Sequence 5
                "Exterminate the momma spider",
                // Sequence 6
                "Mission complete: Report to the guild hall.",
            ],

            // NYI
            mapBackground: [
                // Sequence 0
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 1
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 2
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 3
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 4
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 5
                "assets/imported/img/png/browncanvas.jpeg",
                // Sequence 6
                "assets/imported/img/png/browncanvas.jpeg",
            ],
        };

        return quest;
    }

    if (!S.quests) {
        S.quests = {};
    }

    // TODO Make this an object which takes the map parameter and an info parameter, for guild quest information.
    S.quests.spiderQuest = map;
})(setup);
