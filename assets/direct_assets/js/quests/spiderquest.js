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
        /**
         * 88""Yb 888888 88   88 .dP"Y8 888888 8888b.         db    .dP"Y8 .dP"Y8 888888 888888 .dP"Y8
         * 88__dP 88__   88   88 `Ybo." 88__    8I  Yb       dPYb   `Ybo." `Ybo." 88__     88   `Ybo."
         * 88"Yb  88""   Y8   8P o.`Y8b 88""    8I  dY      dP__Yb  o.`Y8b o.`Y8b 88""     88   o.`Y8b
         * 88  Yb 888888 `YbodP' 8bodP' 888888 8888Y"      dP""""Yb 8bodP' 8bodP' 888888   88   8bodP'
         */
        // Quest Interactable
        let ittybittyman = function () {
            let interactableInstance = new setup.quest.Interactable({
                removeAfterInteracting: true,
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
                removeAfterCombatWin: true,
                removeAfterSequenceUpdate: true,

                intersecting: function () {
                    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                    $(document).one(":textboxclosed", function () {
                        let sv = State.variables;

                        // TODO: This should be in a quest method.
                        sv.map = null;
                        State.variables.pixi = null;
                        $("#passage-map canvas").remove();

                        sv.quest.afterCombatWinFunction = function () {
                            let sv = State.variables;
                            // NOTE: This should be in a Quest method.
                            sv.quest.subquest += 1;

                            sv.quest.afterCombatWinFunction = undefined;
                        };

                        setup.combats.CI_SPIDERS();
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
            // Traveling to city, but encounters smol spooder.
            [
                // Combat Interactable
                function () {
                    let interactable = new setup.quest.Interactable({
                        imgSrc: "assets/imported/img/png/turn_icon_en.png",
                        position: { x: 4, y: 6 },
                        removeAfterSequenceUpdate: true,
                        intersecting: function () {
                            new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                            $(document).one(":textboxclosed", function () {
                                let sv = State.variables;

                                sv.map = null;
                                sv.pixi = null;
                                $("#passage-map canvas").remove();

                                sv.quest.afterCombatWinFunction = function () {
                                    let sv = State.variables;

                                    // NOTE: This should be in a Quest method.
                                    sv.quest.sequence += 1;
                                    sv.quest.sequenceLoaded = false;

                                    sv.quest.afterCombatWinFunction = undefined;
                                };

                                setup.combats.CI_BABYSPIDER1();
                            });
                        },
                    });

                    return interactable;
                },

                ittybittyman,
            ],

            // Sequence 1
            // Continue on to the city and talk to the mayor.
            [
                // City Interactable
                function () {
                    let sv = State.variables;

                    let town = new setup.quest.Interactable({
                        imgSrc: "assets/imported/img/png/init_icon_pl.png",

                        intersecting: function () {
                            // TODO: Make this CityMenu based on UUID instead of scripting it manually.
                            let city = new setup.map.CityMenu({
                                name: "Testing City c:",
                                hasGuildHall: true,

                                hasInn: true,
                            });

                            if (sv.quest.sequence === 1) {
                                sv.quest.sequence += 1;
                                sv.quest.sequenceLoaded = false;

                                let city_tb = {
                                    showBackground: false,
                                    backgroundSrc: "",
                                    showDimmer: true,
                                    showPortrait: false,
                                    showSpeakerName: true,
                                    lines: [
                                        {
                                            portrait: "assets/imported/img/png/turn_icon_pl.png",
                                            speaker: "Mayor",
                                            line: "There sure are a lot of spiders around. Why do you go to the guild and get some buddies and slay some of them for us.",
                                        },
                                        {
                                            speaker: "Narrator",
                                            line: "You thank the man and move on.",
                                        },
                                    ],
                                };

                                new setup.tb.TextBox(city_tb);
                            }

                            if (sv.quest.sequence === 4) {
                                sv.quest.sequence += 1;
                                sv.quest.sequenceLoaded = false;

                                let city_tb2 = {
                                    showBackground: false,
                                    backgroundSrc: "",
                                    showDimmer: true,
                                    showPortrait: false,
                                    showSpeakerName: true,
                                    lines: [
                                        {
                                            portrait: "assets/imported/img/png/turn_icon_pl.png",
                                            speaker: "Mayor",
                                            line: "Momma Spider time.",
                                        },
                                        {
                                            speaker: "Narrator",
                                            line: "You thank the man and move on.",
                                        },
                                    ],
                                };

                                new setup.tb.TextBox(city_tb2);
                            }

                            city.display();
                        },
                    });

                    return town;
                },
            ],

            // Sequence 2
            // Fight 5 spiders.
            [spiders, spiders, spiders, spiders, spiders],

            // Sequence 3
            // Fight Daddy Spider
            [
                // Combat Interactable
                function () {
                    let interactable = new setup.quest.Interactable({
                        imgSrc: "assets/imported/img/png/turn_icon_en.png",
                        removeAfterSequenceUpdate: true,
                        intersecting: function () {
                            new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                            $(document).one(":textboxclosed", function () {
                                let sv = State.variables;

                                // TODO Turn these three lines into Map.dispose()
                                sv.map = null;
                                sv.pixi = null;
                                $("#passage-map canvas").remove();

                                sv.quest.afterCombatWinFunction = function () {
                                    let sv = State.variables;

                                    // NOTE: This should be in a Quest method.
                                    sv.quest.sequence += 1;
                                    sv.quest.sequenceLoaded = false;

                                    sv.quest.afterCombatWinFunction = undefined;
                                };

                                setup.combats.CI_DADDYSPIDER();
                            });
                        },
                    });

                    return interactable;
                },
            ],

            // Sequence 4
            // Return back to town. We already put the code there.
            [],

            // Sequence 5
            // Fight Momma Spider
            [
                // Combat Interactable
                function () {
                    let interactable = new setup.quest.Interactable({
                        imgSrc: "assets/imported/img/png/turn_icon_en.png",
                        removeAfterSequenceUpdate: true,
                        intersecting: function () {
                            new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

                            $(document).one(":textboxclosed", function () {
                                let sv = State.variables;

                                // TODO Turn these three lines into Map.dispose()
                                sv.map = null;
                                sv.pixi = null;
                                $("#passage-map canvas").remove();

                                sv.quest.afterCombatWinFunction = function () {
                                    let sv = State.variables;

                                    // NOTE: This should be in a Quest method.
                                    sv.quest.sequence += 1;
                                    sv.quest.sequenceLoaded = false;

                                    sv.quest.afterCombatWinFunction = undefined;
                                };

                                setup.combats.CI_MOMMASPIDER();
                            });
                        },
                    });

                    return interactable;
                },
            ],

            // Sequence 6
            // Quest complete! Return to town.
            [],
        ];

        let quest = {
            playerLoc: { x: 2, y: 6 },
            interactables: [],
            sequence: 0,
            sequences: sequences,

            // TODO Make sequence an object that holds all of the below things. Maybe even make it its own class as it has a lot of default values it needs.

            // This is run every canvas loop.
            conditionals: [
                // Sequence 0
                function () {
                    return;
                },
                // Sequence 1
                function () {
                    State.variables.quest.subquest = 0;
                    return;
                },
                // Sequence 2
                function () {
                    let sv = State.variables;

                    if (sv.quest.subquest >= 5) {
                        sv.quest.sequence += 1;
                        sv.quest.subquest = 0;
                        sv.quest.sequenceLoaded = false;

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

                        new setup.tb.TextBox(big_spider_tb);
                    }
                },
                // Sequence 3
                function () {
                    return;
                },
                // Sequence 4
                function () {
                    return;
                },
                // Sequence 5
                function () {
                    return;
                },
                // Sequence 6
                function () {
                    return;
                },
            ],

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
            // REVIEW: Is this idea bad? Should I switch it to quest? I can update it when a sequence is updated instead.
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
