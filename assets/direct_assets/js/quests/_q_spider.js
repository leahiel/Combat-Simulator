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

/**
 * ########  ######## ##     ##  ######  ######## ########        ###     ######   ######  ######## ########  ######
 * ##     ## ##       ##     ## ##    ## ##       ##     ##      ## ##   ##    ## ##    ## ##          ##    ##    ##
 * ##     ## ##       ##     ## ##       ##       ##     ##     ##   ##  ##       ##       ##          ##    ##
 * ########  ######   ##     ##  ######  ######   ##     ##    ##     ##  ######   ######  ######      ##     ######
 * ##   ##   ##       ##     ##       ## ##       ##     ##    #########       ##       ## ##          ##          ##
 * ##    ##  ##       ##     ## ##    ## ##       ##     ##    ##     ## ##    ## ##    ## ##          ##    ##    ##
 * ##     ## ########  #######   ######  ######## ########     ##     ##  ######   ######  ########    ##     ######
 */
// Non-Combat Interactable
let ittybittyman = function () {
    return new setup.quest.Interactable({
        removeAfterSequenceUpdate: true,
        removeAfterInteracting: true,
        imgSrc: "assets/imported/img/svg/icons/beard.svg",
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
};

let spider_intersection = function () {
    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

    $(document).one(":textboxclosed", function () {
        let sv = State.variables;

        Map.destroyMap();

        //TODO: Test making this into a Quest static method that takes a call back. That would make I don't have to `sv.quest.afterCombatWinFunction = undefined;`
        sv.quest.afterCombatWinFunction = function () {
            let sv = State.variables;
            // NOTE: This should be in a Quest method.
            sv.quest.subquest += 1;

            sv.quest.afterCombatWinFunction = undefined;
        };

        setup.combats.CI_SPIDERS();
    });
};

let spiders = function () {
    return new setup.quest.Interactable({
        imgSrc: "assets/imported/img/svg/icons/masked-spider.svg",
        removeAfterCombatWin: true,
        removeAfterSequenceUpdate: true,

        intersecting: spider_intersection,
    });
};

/**
 *  ######  ########  #######  ##     ## ######## ##    ##  ######  ########  ######
 * ##    ## ##       ##     ## ##     ## ##       ###   ## ##    ## ##       ##    ##
 * ##       ##       ##     ## ##     ## ##       ####  ## ##       ##       ##
 *  ######  ######   ##     ## ##     ## ######   ## ## ## ##       ######    ######
 *       ## ##       ##  ## ## ##     ## ##       ##  #### ##       ##             ##
 * ##    ## ##       ##    ##  ##     ## ##       ##   ### ##    ## ##       ##    ##
 *  ######  ########  ##### ##  #######  ######## ##    ##  ######  ########  ######
 */
/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888      dP"Yb
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       dP   Yb
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""       Yb   dP
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888      YbodP
 */
// Traveling to city, but encounters smol spooder.

let sequence0a_intersecting = function () {
    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

    $(document).one(":textboxclosed", function () {
        let sv = State.variables;

        Map.destroyMap();

        sv.quest.afterCombatWinFunction = function () {
            let sv = State.variables;

            Quest.increaseSequence();

            sv.quest.afterCombatWinFunction = undefined;
        };

        setup.combats.CI_BABYSPIDER1();
    });
};

let sequence0a = function () {
    return new setup.quest.Interactable({
        imgSrc: "assets/imported/img/svg/icons/hanging-spider.svg",
        position: { x: 4, y: 6 },
        removeAfterSequenceUpdate: true,
        intersecting: sequence0a_intersecting,
    });
};

let sequence0 = new Sequence({
    objective: "Quell the sudden enemy.",
    interactables: [sequence0a, ittybittyman],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888       .d
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       .d88
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""         88
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888       88
 */
// Continue on to the city and talk to the mayor.

// City Interactable
let city_seq1_interaction = function () {
    Quest.increaseSequence();

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
                line: "There sure are a lot of spiders around. Why don't ya go to the guild and get some buddies and slay some of them for us.",
            },
            {
                speaker: "Narrator",
                line: "You thank the man and move on.",
            },
        ],
    };

    new setup.tb.TextBox(city_tb);
};

let city_seq4_interaction = function () {
    Quest.increaseSequence();

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
                line: "Momma Spider time.",
            },
            {
                speaker: "Narrator",
                line: "You thank the man and move on.",
            },
        ],
    };

    new setup.tb.TextBox(city_tb);
};

let city = function () {
    return new setup.quest.Interactable({
        imgSrc: "assets/imported/img/svg/icons/village.svg",
        scaleX: 1.75,
        scaleY: 1.75,

        intersecting: function () {
            let sv = State.variables;

            // TODO: Make this CityMenu based on UUID instead of scripting it manually.
            // REVIEW: setup.map.CityMenu() or CityMenu() ?
            let city = new setup.map.CityMenu({
                name: "Testing City c:",
                hasGuildHall: true,

                hasInn: true,
            });

            if (sv.quest.sequence === 1) {
                city_seq1_interaction();
            }

            if (sv.quest.sequence === 4) {
                city_seq4_interaction();
            }

            city.display();
        },
    });
};

let sequence1 = new Sequence({
    objective: "Find the city and visit the Mayor.",
    interactables: [city],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     oP"Yb.
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       "' dP'
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""         dP'
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888     .d8888
 */
// Fight 5 spiders.

let sequence3intro_tb = {
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

let sequence2 = new Sequence({
    objective: "Slay the sudden onslaught of spiders.",
    interactables: [spiders, spiders, spiders, spiders, spiders],
    conditional: function () {
        let sv = State.variables;

        if (sv.quest.subquest >= 2) {
            sv.quest.subquest = 0;

            new setup.tb.TextBox(sequence3intro_tb);

            Quest.increaseSequence();
        }
    },
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     88888
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__         .dP
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""       o `Yb
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888     YbodP
 */
// Fight Daddy Spider

// Combat Interactable
let daddyinteraction = function () {
    // BUG: This interaction is running as soon as sequence 3 is reached.
    console.log("This shouldn't run until interaction");

    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

    $(document).one(":textboxclosed", function () {
        let sv = State.variables;

        Map.destroyMap();

        sv.quest.afterCombatWinFunction = function () {
            let sv = State.variables;

            Quest.increaseSequence();

            sv.quest.afterCombatWinFunction = undefined;
        };

        setup.combats.CI_DADDYSPIDER();
    });
};

let daddyspider = function () {
    return new setup.quest.Interactable({
        imgSrc: "assets/imported/img/svg/icons/spider-alt.svg",
        removeAfterSequenceUpdate: true,
        intersecting: function () {
            daddyinteraction();
        },
    });
};

let sequence3 = new Sequence({
    playerLoc: { x: 2, y: 2 },
    objective: "Slay the spider ringleader.",
    interactables: [daddyspider],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888       dP88
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__        dP 88
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""       d888888
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888         88
 */
// Return back to town.
// We already put the code for the interaction when we made the city.

let sequence4 = new Sequence({
    objective: "Return back to town.",
    interactables: [],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     888888
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       88oo."
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""          `8b
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888     8888P'
 */
// Fight Momma Spider
let mommainteractation = function () {
    new setup.tb.TextBox(setup.tbs.flavor_tbs.random());

    $(document).one(":textboxclosed", function () {
        let sv = State.variables;

        Map.destroyMap();

        sv.quest.afterCombatWinFunction = function () {
            let sv = State.variables;

            Quest.increaseSequence();

            sv.quest.afterCombatWinFunction = undefined;
        };

        setup.combats.CI_MOMMASPIDER();
    });
};

// Combat Interactable
let mommaspider = function () {
    return new setup.quest.Interactable({
        imgSrc: "assets/imported/img/png/turn_icon_en.png",
        removeAfterSequenceUpdate: true,
        intersecting: mommainteractation,
    });
};

let sequence5 = new Sequence({
    objective: "Return back to town.",
    interactables: [mommaspider],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888       dP'
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       .d8'
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""       8P"""Yb
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888     `YboodP
 */
// Quest complete! Return to town.

let sequence6 = new Sequence({
    objective: "Demo complete!",
    interactables: [],
});

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     888888P
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__           dP
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""          dP
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888       dP
 */

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     .dP"o.
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       `8b.d'
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""       d'`Y8b
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888     `bodP'
 */

/**
 * .dP"Y8 888888  dP"Yb  88   88 888888 88b 88  dP""b8 888888     dP""Yb
 * `Ybo." 88__   dP   Yb 88   88 88__   88Yb88 dP   `" 88__       Ybood8
 * o.`Y8b 88""   Yb b dP Y8   8P 88""   88 Y88 Yb      88""         .8P'
 * 8bodP' 888888  `"YoYo `YbodP' 888888 88  Y8  YboodP 888888      .dP'
 */

let quest = new Quest({
    playerLoc: { x: 2, y: 6 },
    guild: {},
    sequences: [sequence0, sequence1, sequence2, sequence3, sequence4, sequence5, sequence6],
});

// Add the required quest functions to setup.
(function (S) {
    if (!S.quests) {
        S.quests = {};
    }

    S.quests.spiderQuest2 = quest;
})(setup);
