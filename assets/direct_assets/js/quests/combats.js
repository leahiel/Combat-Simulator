// IIFE needed to add the quests to setup.
(function (S) {
    let combats = {
        CI_BABYSPIDER1: function () {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "Map",
                losePassage: "Map",
                ep: ["EN_BABY_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        },

        CI_BABYSPIDERS: function () {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "Map",
                losePassage: "Map",
                ep: ["EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        },

        CI_SPIDERS: function () {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "Map",
                losePassage: "Map",
                // TODO Make EP randomized, though only baby spiders and spiders will be in it.
                ep: ["EN_BABY_SPIDER", ], // "EN_SPIDER", "EN_SPIDER", "EN_BABY_SPIDER", "EN_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        },

        CI_DADDYSPIDER: function () {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "Map",
                losePassage: "Map",
                // TODO Make EP randomized, with a daddy spiderthough only baby spiders and spiders will be in it.
                ep: ["EN_BABY_SPIDER", "EN_DADDY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        },

        CI_MOMMASPIDER: function () {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "Map",
                losePassage: "Map",
                ep: ["EN_BABY_SPIDER", "EN_MOMMY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        },
    };

    S.combats = combats;
})(setup);
