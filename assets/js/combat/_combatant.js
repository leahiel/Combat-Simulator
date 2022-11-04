/**
 * The Combatant is the actionable, fully derived, object on the
 * combat field.
 *
 * Currently, this is largely unimplemented: Only what needs to work
 * is currently functional.
 */
class Combatant {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTCOMBATANT, */ obj);

        this.original = cloneDeep(obj);
        this.buffs = [];

        this.health = this.healthMax;

        let max = this.initStart * (1 + this.initVariance);
        let min = this.initStart * (1 - this.initVariance);
        this.init = Math.floor(Math.random() * (max - min + 1)) + Math.floor(min);

        /**
         * NYI: These should be calculated with a function here, but 
         * that ability is NYI. 
         */
        this.deflectedCalculated = 0.05;
        this.blockCalculated = 0.05;
    }

    /**
     * Buffs and debuffs can change the stats of Combatants, however,
     * when they expire, the stats need to be reassigned.
     * 
     * To do this, we will simply remake the Combatant, but certain 
     * values must remain the same:
     * 
     * Current Health [Maximum amount equal to healthMax]
     * Current Init
     * Current Buffs
     * Current Debuffs
     */
    reform() {
        let newBaseObj = cloneDeep(this.original);
        let oldCombatant = cloneDeep(this);

        Object.assign(this, newBaseObj);
        
        // Keep health the same.
        if (this.health > this.healthMax) { this.health = healthMax };

        // Keep init the same.
        // No code needed.

        // Keep buffs and debuffs the same.
        this.buffs = oldCombatant.buffs;
    }

    /** 
     * Convert the data into a string so that the player can understand the data within. 
     * 
     * This can be HTML text.
     */
    getInfo() {
        let solstr = "";
        solstr += this.name;
        solstr += "'s Combatant information screen.";

        return solstr;
    }
};

// Add the Combatant class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Combatant = Combatant;
})(setup);
