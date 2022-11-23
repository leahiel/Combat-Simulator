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

        this.health = this.healthMax;

        let max = this.initStart * (1 + this.initStartVariance);
        let min = this.initStart * (1 - this.initStartVariance);
        this.init = Math.floor(Math.random() * (max - min + 1)) + Math.floor(min);

        if (!this.attacks) {
            this.attacks = [];
        }

        this.triggers = [];

        /**
         * equippables
         */
        if (this.equippables) {
            for (let equippable in this.equippables) {
                let item = this.equippables[equippable];

                // Add attacks to Combatant.
                if (this.equippables[equippable].attacks) {
                    this.attacks = mergeArray(this.attacks, item.attacks);
                }

                // Update Combatant Properties with Equippable Properties
                function updateProperties(combatant, equip, propobjname) {
                    Object.keys(combatant[propobjname]).forEach(function (prop) {
                        if (prop === "more") {
                            combatant[propobjname][prop] *= equip[propobjname][prop];
                        } else {
                            combatant[propobjname][prop] += equip[propobjname][prop];
                        }
                    });
                }

                updateProperties(this, item, "absorbPercent");
                updateProperties(this, item, "absorbPercentMax");
                updateProperties(this, item, "absorbFlat");

                updateProperties(this, item, "resistance");
                updateProperties(this, item, "resistanceMax");
                updateProperties(this, item, "reduct");

                updateProperties(this.damage, item.damage, "blunt");
                updateProperties(this.damage, item.damage, "pierce");
                updateProperties(this.damage, item.damage, "acid");
                updateProperties(this.damage, item.damage, "fire");
                updateProperties(this.damage, item.damage, "frost");
                updateProperties(this.damage, item.damage, "lightning");
                updateProperties(this.damage, item.damage, "sacred");
                updateProperties(this.damage, item.damage, "shadow");
                updateProperties(this.damage, item.damage, "aether");

                this.criticalChanceBase += item.criticalChanceBase;
                this.criticalChanceIncreased += item.criticalChanceIncreased;
                this.criticalChanceMore *= item.criticalChanceMore;
                this.criticalDamageBase += item.criticalDamageBase;
                this.criticalDamageIncreased += item.criticalDamageIncreased;
                this.criticalDamageMore *= item.criticalDamageMore;

                this.directChanceBase += item.directChanceBase;
                this.directChanceIncreased += item.directChanceIncreased;
                this.directChanceMore *= item.directChanceMore;

                this.blockChanceBase += item.blockChanceBase;
                this.blockChanceIncreased += item.blockChanceIncreased;
                this.blockChanceMore *= item.blockChanceMore;

                this.deflectChanceBase += item.deflectChanceBase;
                this.deflectChanceIncreased += item.deflectChanceIncreased;
                this.deflectChanceMore *= item.deflectChanceMore;
            }
        }

        /**
         * Calculate aggregate defensive properties here.
         */
        this.deflectCalculated = this.deflectChanceBase * this.deflectChanceIncreased * this.deflectChanceMore;
        this.blockCalculated = this.blockChanceBase * this.blockChanceIncreased * this.blockChanceMore;

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
            this.health = this.healthMax;
        }

        // Keep init the same.
        // No code needed.

        // Keep buffs and debuffs the same.
        // REVIEW: Do I need to reapply buffs with onApply effects?
        this.buffs = oldCombatant.buffs;

        /**
         * Recalculate aggregate defensive properties here.
         */
        this.deflectCalculated = this.deflectChanceBase * this.deflectChanceIncreased * this.deflectChanceMore;
        this.blockCalculated = this.blockChanceBase * this.blockChanceIncreased * this.blockChanceMore;

        /**
         * NYI: Monster Rarities.
         * REVIEW: Should this be added to this.original?
         */
        if (this.family === "player") {
            this.rarity = "Player";
        } else {
            this.rarity = "Normal";
        }
    }

    /**
     * Convert the data into a string so that the player can understand the data within.
     *
     * This should be HTML text.
     */
    getInfo() {
        let iNYI = `<span class="infoNYI">NYI</span>`;
        let res = this.resistance;
        let resMax = this.resistanceMax;
        let red = this.reduct;
        let abp = this.absorbPercent;
        let abpMax = this.absorbPercentMax;
        let abf = this.absorbFlat;
        let dmg = this.damage;

        let solstr = `<span id="CombatantInformationPlate">`;

        /**
         * Miscellanious Information
         */
        solstr += `<span id='infoName'>${this.name} <span id='infoVariant'>#${this.rarity}</span></span>`; // NYI: Different colors for different rarities.
        solstr += `<span class='divider'></span>`;

        // special info
        // For uncommon stat thingies. "Absorbs Elemental."  We could also put the rarity affix info here?

        /**
         * Metrics Information
         */
        solstr += `<span id='infoMetrics'><span class='infoSectionHeader'>METRICS</span>`;
        solstr += `<grid id='infoMetricsGrid'>`;

        // Health & Mana
        let iHPMax = Math.floor(this.healthMax);
        let iHP;
        if (tags().includes(".combat")) {
            iHP = this.health;
        } else {
            iHP = iHPMax;
        }
        solstr += `<span id='infoHealth'>Health: ${iHP}<span class='infoMax'>/${iHPMax}</span><br>Mana: ${iNYI}</span>`;

        // Init
        let iInitStart = `<span class='infoMax'>/${Math.ceil(this.initStart)}</span>`;
        let iInitStartVariance = `<span class='infoMax'>±${Math.ceil(this.initStartVariance * this.initStart)}</span>`;
        let iInit;
        if (tags().includes(".combat")) {
            iInit = `${Math.ceil(this.init)}${iInitStart}`;
        } else {
            iInit = `${Math.ceil(this.init)}${iInitStartVariance}`;
        }
        let iInitDecrement = `<span id='infoInitDecrement'>${this.initDecrementModifier}<span class="infoMax">/tick</span></span>`;

        solstr += `<span id='infoInit'>Init<br>${iInit} -${iInitDecrement}</span>`;

        // Deflect
        let iDeflect = Math.floor(this.deflectCalculated * 100);
        solstr += `<span id='infoDeflect'>Deflect<br>${iDeflect}%</span>`;

        // Block
        let iBlock = Math.floor(this.blockCalculated * 100);
        let iBlockRecovery = `<span class='infoMax'>+${Math.ceil(this.blockRecovery)}init</span>`;

        solstr += `<span id='infoBlock'>Block<br>${iBlock}%<br>${iBlockRecovery}</span>`;

        // Crit
        let iCritChance = Math.ceil(
            this.criticalChanceBase * this.criticalChanceIncreased * this.criticalChanceMore * 100
        );
        let iCritDamage = `<span class='infoMax'>${+(
            this.criticalDamageBase *
            this.criticalDamageIncreased *
            this.criticalDamageMore
        ).toFixed(2)}x</span>`;

        solstr += `<span id='infoCrit'>Critical<br>${iCritChance}%<br>${iCritDamage}</span>`;

        // Direct
        let iDirectChance = Math.ceil(this.directChanceBase * this.directChanceIncreased * this.directChanceMore * 100);

        solstr += `<span id='infoDirect'>Direct<br>${iDirectChance}%</span>`;

        solstr += `</grid></span>`;

        /**
         * Resistances & Reductions
         */
        solstr += `<span id='infoResistances'><span class='infoSectionHeader'>RESISTANCES & REDUCTIONS</span>`;
        solstr += `<grid id='infoResistanceGrid'>`;

        function getMainResString(main) {
            return `${Math.floor(Math.min(res[main], resMax[main]) * 100)}%<span class='infoMax'> :${Math.floor(
                Math.max(resMax[main])
            )}%</span> - ${Math.floor(Math.min(red[main]))}`;
        }

        function getSubResString(main, sub) {
            return `${Math.floor(
                Math.min(res[main] + res[sub], resMax[sub]) * 100
            )}%<span class='infoMax'> :${Math.floor(Math.max(resMax[sub]))}%</span> - ${Math.floor(
                Math.min(red[main] + red[sub])
            )}`;
        }

        // Material
        let iMaterialRes = getMainResString("material");
        let iBluntRes = getSubResString("material", "blunt");
        let iPierceRes = getSubResString("material", "pierce");
        let iAcidRes = getSubResString("material", "acid");

        solstr += `<span class='infoMaterial'>Material<br>${iMaterialRes}</span>`;
        solstr += `<span class='infoBlunt'>Blunt<br>${iBluntRes}</span>`;
        solstr += `<span class='infoPierce'>Pierce<br>${iPierceRes}</span>`;
        solstr += `<span class='infoAcid'>Acid<br>${iAcidRes}</span>`;

        // Elemental
        let iElementalRes = getMainResString("elemental");
        let iFireRes = getSubResString("elemental", "fire");
        let iFrostRes = getSubResString("elemental", "frost");
        let iLightningRes = getSubResString("elemental", "lightning");

        solstr += `<span class='infoElemental'>Elemental<br>${iElementalRes}</span>`;
        solstr += `<span class='infoFire'>Fire<br>${iFireRes}</span>`;
        solstr += `<span class='infoFrost'>Frost<br>${iFrostRes}</span>`;
        solstr += `<span class='infoLightning'>Lightning<br>${iLightningRes}</span>`;

        // Occult
        let iOccultRes = getMainResString("occult");
        let iShadowRes = getSubResString("occult", "shadow");
        let iSacredRes = getSubResString("occult", "sacred");
        let iAetherRes = getSubResString("occult", "aether");

        solstr += `<span class='infoOccult'>Occult<br>${iOccultRes}</span>`;
        solstr += `<span class='infoShadow'>Shadow<br>${iShadowRes}</span>`;
        solstr += `<span class='infoSacred'>Sacred<br>${iSacredRes}</span>`;
        solstr += `<span class='infoAether'>Aether<br>${iAetherRes}</span>`;

        solstr += `</grid></span>`;

        /**
         * Absorbtion
         */
        solstr += `<span id='infoAbsorbtions'><span class='infoSectionHeader'>Absorbtion</span>`;
        solstr += `<grid id='infoAbsorbtionGrid'>`;

        function getMainAbsString(main) {
            return `${Math.floor(Math.min(abp[main], abpMax[main]) * 100)}%<span class='infoMax'> :${Math.floor(
                Math.max(abpMax[main])
            )}%</span> + ${Math.floor(Math.min(abf[main]))}`;
        }

        function getSubAbsString(main, sub) {
            return `${Math.floor(
                Math.min(abp[main] + abp[sub], abpMax[sub]) * 100
            )}%<span class='infoMax'> :${Math.floor(Math.max(abpMax[sub]))}%</span> + ${Math.floor(
                Math.min(abf[main] + abf[sub])
            )}`;
        }

        // Material
        let iMaterialAbs = getMainAbsString("material");
        let iBluntAbs = getSubAbsString("material", "blunt");
        let iPierceAbs = getSubAbsString("material", "pierce");
        let iAcidAbs = getSubAbsString("material", "acid");

        solstr += `<span class='infoMaterial'>Material<br>${iMaterialAbs}</span>`;
        solstr += `<span class='infoBlunt'>Blunt<br>${iBluntAbs}</span>`;
        solstr += `<span class='infoPierce'>Pierce<br>${iPierceAbs}</span>`;
        solstr += `<span class='infoAcid'>Acid<br>${iAcidAbs}</span>`;

        // Elemental
        let iElementalAbs = getMainAbsString("elemental");
        let iFireAbs = getSubAbsString("elemental", "fire");
        let iFrostAbs = getSubAbsString("elemental", "frost");
        let iLightningAbs = getSubAbsString("elemental", "lightning");

        solstr += `<span class='infoElemental'>Elemental<br>${iElementalAbs}</span>`;
        solstr += `<span class='infoFire'>Fire<br>${iFireAbs}</span>`;
        solstr += `<span class='infoFrost'>Frost<br>${iFrostAbs}</span>`;
        solstr += `<span class='infoLightning'>Lightning<br>${iLightningAbs}</span>`;

        // Occult
        let iOccultAbs = getMainAbsString("occult");
        let iShadowAbs = getSubAbsString("occult", "shadow");
        let iSacredAbs = getSubAbsString("occult", "sacred");
        let iAetherAbs = getSubAbsString("occult", "aether");

        solstr += `<span class='infoOccult'>Occult<br>${iOccultAbs}</span>`;
        solstr += `<span class='infoShadow'>Shadow<br>${iShadowAbs}</span>`;
        solstr += `<span class='infoSacred'>Sacred<br>${iSacredAbs}</span>`;
        solstr += `<span class='infoAether'>Aether<br>${iAetherAbs}</span>`;

        solstr += `</grid></span>`;

        /**
         * Added Damage
         */
        /**
         * Since damage is calculated at the time of attack, I should display it differently:
         * Added (Min) - (Max)
         * (Increased * More)x  // NYI: This stat doesn't actaully exist.
         */
        solstr += `<span id='infoDamage'><span class='infoSectionHeader'>Damage</span>`;
        solstr += `<grid id='infoDamageGrid'>`;

        function getDmgString(sub) {
            return `${Math.floor(dmg[sub].min)} - ${Math.floor(dmg[sub].max)}<br><span class="infoMax">x${+(
                dmg[sub].more *
                (1 + dmg[sub].increased)
            ).toFixed(2)}</span>`;
        }

        // Material
        let iBluntDmg = getDmgString("blunt");
        let iPierceDmg = getDmgString("pierce");
        let iAcidDmg = getDmgString("acid");

        solstr += `<span class='infoMaterial'>Material</span>`;
        solstr += `<span class='infoBlunt'>Blunt<br>${iBluntDmg}</span>`;
        solstr += `<span class='infoPierce'>Pierce<br>${iPierceDmg}</span>`;
        solstr += `<span class='infoAcid'>Acid<br>${iAcidDmg}</span>`;

        // Elemental
        let iFireDmg = getDmgString("fire");
        let iFrostDmg = getDmgString("frost");
        let iLightningDmg = getDmgString("lightning");

        solstr += `<span class='infoElemental'>Elemental</span>`;
        solstr += `<span class='infoFire'>Fire<br>${iFireDmg}</span>`;
        solstr += `<span class='infoFrost'>Frost<br>${iFrostDmg}</span>`;
        solstr += `<span class='infoLightning'>Lightning<br>${iLightningDmg}</span>`;

        // Occult
        let iShadowDmg = getDmgString("shadow");
        let iSacredDmg = getDmgString("sacred");
        let iAetherDmg = getDmgString("aether");

        solstr += `<span class='infoOccult'>Occult</span>`;
        solstr += `<span class='infoShadow'>Shadow<br>${iShadowDmg}</span>`;
        solstr += `<span class='infoSacred'>Sacred<br>${iSacredDmg}</span>`;
        solstr += `<span class='infoAether'>Aether<br>${iAetherDmg}</span>`;

        solstr += `</grid></span>`;

        /**
         * Buffs & Debuffs
         */
        if (this.buffs.length > 0) {
            solstr += `<span id='infoBuffs'><span class='infoSectionHeader'>BUFFS & DEBUFFS</span>`;
            // NYI buff and debuff information
            solstr += `<span class='infoNYI'>Buff and debuff information are NYI, but you currently have at least one.</span>`;
            solstr += `</span>`;
        }

        /**
         * Flavor
         */
        if (!(this.family === "player")) {
            solstr += `<span class='infoSectionHeader'>FLAVOR</span>`;
            solstr += `<grid><span class='infoNYI'>${this.description}</span></grid>`;
        }

        solstr += `</span>`;
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
