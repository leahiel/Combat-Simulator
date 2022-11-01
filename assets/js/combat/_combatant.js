/**
 * The Combatant is the actionable, fully derived, object on the
 * combat field.
 *
 * Currently, this is largely unimplemented: Only what needs to work
 * is currently functional.
 */
class Combatant {
    constructor(obj) {
        Object.assign(this, obj);

        this.original = obj;
        this.buffs = [];
        this.debuffs = [];

        this.health = this.healthMax;

        let max = this.initStart * (1 + this.initVariance);
        let min = this.initStart * (1 - this.initVariance);
        this.init = Math.floor(Math.random() * (max - min + 1)) + Math.floor(min);

        this.deflectedCalculated = 0.05;
        this.blockCalculated = 0.05;
    }

    reform() {
        // Apply buffs and debuffs
    }
};

// Add the Combatant class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Combatant = Combatant;
})(setup);
