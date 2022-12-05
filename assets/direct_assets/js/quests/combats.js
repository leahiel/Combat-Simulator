// IIFE needed to add the quests to setup.
(function (S) {
    let combats = {


        CI_MOMMASPIDER: function() {
            State.variables.ci = new setup.COM.CombatInstance({
                winPassage: "MapTesting",
                losePassage: "MapTesting",
                ep: ["EN_BABY_SPIDER", "EN_MOMMY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER", "EN_BABY_SPIDER"],
            });

            Engine.play("Combat_Overlord");
        }
    }

    S.combats = combats;
})(setup);
