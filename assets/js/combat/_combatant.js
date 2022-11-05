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
         * NYI: equippables
         */
        if (this.equippables) {
            // The base obj has an equippable object, but that does not mean that anything is equipped.
            if (this.equippables.mainhand) {
                // I need a function that adds stats from equippables to combatant stats.
            }
        } 

        /**
         * NYI: These should be calculated with a function here, but
         * that ability is NYI.
         */
        this.deflectedCalculated = 0.05;
        this.blockCalculated = 0.05;

        /**
         * NYI: Monster Rarities.
         */
        if (this.family === "player") {
            this.rarity = "Player";
        } else {
            this.rarity = "Normal";
        }
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
        if (this.health > this.healthMax) {
            this.health = healthMax;
        }

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

        // misc info
        solstr += `<span id='infoName'>${this.name}</span>`;
        solstr += `<span id='infoVariant'>#${this.rarity}</span>`; // NYI: Different colors for different rarities.
        solstr += `<span class='divider'></span>`;

        // special info
        // For uncommon stat thingies. "Absorbs Elemental."  We could also put the rarity affix info here?

        // metrics info
        if (this.family === "player") {
            solstr += `<span id='infoMetrics'><span class='infoSectionHeader'>METRICS</span>`;
            solstr += `<grid id='infoMetricsGrid'>`;
            solstr += `<span id='infoHealth'>Health: ${Math.floor(this.health)} / ${Math.floor(this.healthMax)}</span>`;
            solstr += `<span id='init'>Init: ${Math.floor(this.init)}</span>`;
            solstr += `</grid></span>`;
        }

        // resistances info
        solstr += `<span id='infoResistances'><span class='infoSectionHeader'>RESISTANCES</span>`;
        solstr += `<grid id='infoResistanceGrid'>`;
        solstr += `<span style="font-weight:bold">Material</span>`;
        solstr += `<span>Blunt: ${Math.min(
            (this.resistance.material += this.resistance.blunt),
            this.resistanceMax.blunt
        )}</span>`;
        solstr += `<span>Pierce: ${Math.min(
            (this.resistance.material += this.resistance.pierce),
            this.resistanceMax.pierce
        )}</span>`;
        solstr += `<span>Acid: ${Math.min(
            (this.resistance.material += this.resistance.acid),
            this.resistanceMax.acid
        )}</span>`;

        solstr += `<span style="font-weight:bold">Elemental</span>`;
        solstr += `<span>Fire: ${Math.min(
            (this.resistance.elemental += this.resistance.fire),
            this.resistanceMax.fire
        )}</span>`;
        solstr += `<span>Frost: ${Math.min(
            (this.resistance.elemental += this.resistance.frost),
            this.resistanceMax.frost
        )}</span>`;
        solstr += `<span>Lightning: ${Math.min(
            (this.resistance.elemental += this.resistance.lightning),
            this.resistanceMax.lightning
        )}</span>`;

        solstr += `<span style="font-weight:bold">Occult</span>`;
        solstr += `<span>Sacred: ${Math.min(
            (this.resistance.occult += this.resistance.sacred),
            this.resistanceMax.sacred
        )}</span>`;
        solstr += `<span>Shadow: ${Math.min(
            (this.resistance.occult += this.resistance.shadow),
            this.resistanceMax.shadow
        )}</span>`;
        solstr += `<span>Aether: ${Math.min(
            (this.resistance.occult += this.resistance.aether),
            this.resistanceMax.aether
        )}</span>`;
        solstr += `</grid></span>`;

        // buffs & debuffs
        // NYI buff and debuff icons

        // flavor text
        if (!(this.family === "player")) {
            solstr += `<span class='infoSectionHeader'>FLAVOR</span>`;
            solstr += `<grid><span>${this.flavortext}</span></grid>`;
        }

        return solstr;
    }
}

// Add the Combatant class to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.Combatant = Combatant;
})(setup);
