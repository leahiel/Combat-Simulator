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
        solstr += `<span id='infoName'>${this.name} <span id='infoVariant'>#${this.rarity.toUpperCase()}</span></span>`; // NYI: Different colors for different rarities.
        solstr += `<span class='divider'></span>`;

        // special info
        // For uncommon stat thingies. "Absorbs Elemental."  We could also put the rarity affix info here?

        /**
         * Metrics Information
         */
        solstr += `<span id='infoMetrics'><span class='infoSectionHeader'>METRICS</span>`;
        solstr += `<grid id='infoMetricsGrid'>`;

        // Health & Mana
        let iHPMax = Math.ceil(this.healthMax);
        let iHP;
        if (tags().includes(".combat")) {
            iHP = Math.ceil(this.health);
        } else {
            iHP = iHPMax;
        }
        solstr += `<span id='infoHealth'>Health: ${iHP}<span class='infoMax'> /${iHPMax}</span><br>Mana: ${iNYI}</span>`;

        // Init
        let iInitStart = `<span class='infoMax'>/${Math.ceil(this.initStart)}</span>`;
        let iInitStartVariance = `<span class='infoMax'> ±${Math.ceil(this.initStartVariance * this.initStart)}</span>`;
        let iInitRecoveryModifier = `<span class="infoMax">Recovery: </span>x${+this.initRecoveryModifier.toFixed(
            2
        )}`;

        let iInit;
        if (tags().includes(".combat")) {
            iInit = `${Math.ceil(this.init)}${iInitStart}`;
        } else {
            iInit = `${Math.ceil(this.initStart)}${iInitStartVariance}`;
        }
        let iInitDecrement = `<span id='infoInitDecrement'>${this.initDecrementModifier}<span class="infoMax">/tick</span><br>${iInitRecoveryModifier}</span>`;

        solstr += `<span id='infoInit'>Init<br>${iInit} -${iInitDecrement}</span>`;

        // Deflect
        let iDeflect = Math.floor(this.deflectCalculated * 100);
        if (iDeflect <= 5) {
            solstr += `<span id='infoDeflect' class='infoDarkGrey'>Deflect<br>${iDeflect}%</span>`;
        } else {
            solstr += `<span id='infoDeflect'>Deflect<br>${iDeflect}%</span>`;
        }

        // Block
        let iBlock = Math.floor(this.blockCalculated * 100);
        let iBlockRecovery = `<span class='infoMax'>+${Math.ceil(this.blockRecovery)}init</span>`;
        if (iBlock <= 0) {
            solstr += `<span id='infoBlock' class='infoDarkGrey'>Block<br>${iBlock}%<br>${iBlockRecovery}</span>`;
        } else {
            solstr += `<span id='infoBlock'>Block<br>${iBlock}%<br>${iBlockRecovery}</span>`;
        }

        // Crit
        let iCritChance = Math.ceil(
            this.criticalChanceBase * this.criticalChanceIncreased * this.criticalChanceMore * 100
        );
        let iCritDamage = `<span class='infoMax'>${+(
            this.criticalDamageBase *
            this.criticalDamageIncreased *
            this.criticalDamageMore
        ).toFixed(2)}x</span>`;
        if (iCritChance <= 5) {
            solstr += `<span id='infoCrit' class='infoDarkGrey'>Critical<br>${iCritChance}%<br>${iCritDamage}</span>`;
        } else {
            solstr += `<span id='infoCrit'>Critical<br>${iCritChance}%<br>${iCritDamage}</span>`;
        }

        // Direct
        let iDirectChance = Math.ceil(this.directChanceBase * this.directChanceIncreased * this.directChanceMore * 100);
        if (iDirectChance <= 5) {
            solstr += `<span id='infoDirect' class='infoDarkGrey'>Direct<br>${iDirectChance}%</span>`;
        } else {
            solstr += `<span id='infoDirect'>Direct<br>${iDirectChance}%</span>`;
        }

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
         * Resistances & Reductions
         */
        solstr += `<span id='infoResistances'><span class='infoSectionHeader'>RESISTANCES & REDUCTIONS</span>`;
        solstr += `<grid id='infoResistanceGrid'>`;
        let sub1realRes = "";
        let sub1maxRes = "";
        let sub1flatRes = "";

        /** If all of the subs are equal, add them to main and hide the subs. */
        function determineResEquivalances(main, sub1, sub2, sub3) {
            sub1realRes = Math.floor(Math.min(res[main] + res[sub1], resMax[sub1]) * 100);
            sub1maxRes = Math.floor(Math.max(resMax[sub1]));
            sub1flatRes = Math.floor(Math.min(red[main] + red[sub1]));

            let sub2real = Math.floor(Math.min(res[main] + res[sub2], resMax[sub2]) * 100);
            let sub2max = Math.floor(Math.max(resMax[sub2]));
            let sub2flat = Math.floor(Math.min(red[main] + red[sub2]));

            let sub3real = Math.floor(Math.min(res[main] + res[sub3], resMax[sub3]) * 100);
            let sub3max = Math.floor(Math.max(resMax[sub3]));
            let sub3flat = Math.floor(Math.min(red[main] + red[sub3]));

            let realeq = sub1realRes === sub2real && sub1realRes === sub3real ? true : false;
            let maxeq = sub1maxRes === sub2max && sub1maxRes === sub3max ? true : false;
            let flateq = sub1flatRes === sub2flat && sub1flatRes === sub3flat ? true : false;

            let actuallyeq = realeq === maxeq && realeq === flateq ? true : false;

            return actuallyeq;
        }

        /** subsEq indicates whether all the subs are the same. */
        function getMainResString(subsEq, main) {
            if (subsEq) {
                // TODO: If max'd, add `infoGold` class.

                // Determine if stats are zero'd.
                let isZeroedClass = "";
                if (sub1realRes === 0 && sub1flatRes === 0) {
                    isZeroedClass = " infoDarkGrey";
                }

                return `class='info${main.replace(/^\w/, (c) =>
                    c.toUpperCase()
                )} plateInformationGridsSpan3Rows${isZeroedClass}'> All ${main.replace(/^\w/, (c) =>
                    c.toUpperCase()
                )} Resistances: ${Math.floor(Math.min(sub1realRes, sub1maxRes))}%<span class='infoMax'> :${Math.floor(
                    sub1maxRes
                )}%</span> - ${Math.floor(sub1flatRes)}`;
            } else {
                return `class='info${main.replace(/^\w/, (c) => c.toUpperCase())} infoUpper'> ${main.replace(
                    /^\w/,
                    (c) => c.toUpperCase()
                )}`;
            }
        }

        function getSubResString(main, sub) {
            // TODO: If max'd, add `infoGold` class.

            let subrealRes = Math.floor(Math.min(res[main] + res[sub], resMax[sub]) * 100);
            let submaxRes = Math.floor(Math.max(resMax[sub]));
            let subflatRes = Math.floor(Math.min(red[main] + red[sub]));

            console.log(sub);
            console.log(subrealRes);
            console.log(subflatRes);

            // Determine if stats are zero'd.
            let isZeroedClass = "";
            if (subrealRes === 0 && subflatRes === 0) {
                isZeroedClass = " infoDarkGrey";
            }
            console.log(isZeroedClass);

            return `class='info${sub.replace(/^\w/, (c) => c.toUpperCase())}${isZeroedClass}'>${sub.replace(
                /^\w/,
                (c) => c.toUpperCase()
            )}<br>${subrealRes}%<span class='infoMax'> :${submaxRes}%</span> + ${subflatRes}`;
        }

        // Material
        let iMaterialEqRes = determineResEquivalances("material", "blunt", "pierce", "acid");
        let iMaterialRes = iMaterialEqRes ? getMainResString(true, "material") : getMainResString(false, "material");

        solstr += `<span ${iMaterialRes}</span>`;

        if (!iMaterialEqRes) {
            let iBluntRes = getSubResString("material", "blunt");
            let iPierceRes = getSubResString("material", "pierce");
            let iAcidRes = getSubResString("material", "acid");

            solstr += `<span ${iBluntRes}</span>`;
            solstr += `<span ${iPierceRes}</span>`;
            solstr += `<span ${iAcidRes}</span>`;
        }

        // Elemental
        let iElementalEqRes = determineResEquivalances("elemental", "fire", "frost", "lightning");
        let iElementalRes = iElementalEqRes
            ? getMainResString(true, "elemental")
            : getMainResString(false, "elemental");

        solstr += `<span ${iElementalRes}</span>`;

        if (!iElementalEqRes) {
            let iFireRes = getSubResString("elemental", "fire");
            let iFrostRes = getSubResString("elemental", "frost");
            let iLightningRes = getSubResString("elemental", "lightning");

            solstr += `<span ${iFireRes}</span>`;
            solstr += `<span ${iFrostRes}</span>`;
            solstr += `<span ${iLightningRes}</span>`;
        }

        // Occult
        let iOccultEqRes = determineResEquivalances("occult", "shadow", "aether", "sacred");
        let iOccultRes = iOccultEqRes ? getMainResString(true, "occult") : getMainResString(false, "occult");

        solstr += `<span ${iOccultRes}</span>`;

        if (!iOccultEqRes) {
            let iShadowRes = getSubResString("occult", "shadow");
            let iSacredRes = getSubResString("occult", "sacred");
            let iAetherRes = getSubResString("occult", "aether");

            solstr += `<span ${iShadowRes}</span>`;
            solstr += `<span ${iSacredRes}</span>`;
            solstr += `<span ${iAetherRes}</span>`;
        }

        solstr += `</grid></span>`;

        /**
         * Absorbtion
         */
        solstr += `<span id='infoAbsorbtions'><span class='infoSectionHeader'>Absorbtion</span>`;
        solstr += `<grid id='infoAbsorbtionGrid'>`;

        let sub1realAb = "";
        let sub1maxAb = "";
        let sub1flatAb = "";

        /** If all of the subs are equal, add them to main and hide the subs. */
        function determineAbEquivalances(main, sub1, sub2, sub3) {
            sub1realAb = Math.floor(Math.min(abp[main] + abp[sub1], abpMax[sub1]) * 100);
            sub1maxAb = Math.floor(Math.max(abpMax[sub1]));
            sub1flatAb = Math.floor(Math.min(abf[main] + abf[sub1]));

            let sub2real = Math.floor(Math.min(abp[main] + abp[sub2], abpMax[sub2]) * 100);
            let sub2max = Math.floor(Math.max(abpMax[sub2]));
            let sub2flat = Math.floor(Math.min(abf[main] + abf[sub2]));

            let sub3real = Math.floor(Math.min(abp[main] + abp[sub3], abpMax[sub3]) * 100);
            let sub3max = Math.floor(Math.max(abpMax[sub3]));
            let sub3flat = Math.floor(Math.min(abf[main] + abf[sub3]));

            let realeq = sub1realAb === sub2real && sub1realAb === sub3real ? true : false;
            let maxeq = sub1maxAb === sub2max && sub1maxAb === sub3max ? true : false;
            let flateq = sub1flatAb === sub2flat && sub1flatAb === sub3flat ? true : false;

            let actuallyeq = realeq === maxeq && realeq === flateq ? true : false;

            return actuallyeq;
        }

        /** subsEq indicates whether all the subs are the same. */
        function getMainAbsString(subsEq, main) {
            if (subsEq) {
                // Determine if stats are zero'd.
                let isZeroedClass = "";
                if (sub1realAb === 0 && sub1flatAb === 0) {
                    isZeroedClass = " infoDarkGrey";
                }

                return `class='info${main.replace(/^\w/, (c) =>
                    c.toUpperCase()
                )} plateInformationGridsSpan3Rows${isZeroedClass}'> All ${main.replace(/^\w/, (c) =>
                    c.toUpperCase()
                )} Absorptions: ${Math.floor(Math.min(sub1realAb, sub1maxAb))}%<span class='infoMax'> :${Math.floor(
                    sub1maxAb
                )}%</span> - ${Math.floor(sub1flatAb)}`;
            } else {
                return `class='info${main.replace(/^\w/, (c) => c.toUpperCase())}'> ${main.replace(/^\w/, (c) =>
                    c.toUpperCase()
                )}: ${Math.floor(Math.min(abp[main], abpMax[main]) * 100)}%<span class='infoMax'> :${Math.floor(
                    abpMax[main]
                )}%</span> - ${Math.floor(abf[main])}`;
            }
        }

        function getSubAbsString(main, sub) {
            let subrealAb = Math.floor(Math.min(abp[main] + abp[sub], abpMax[sub]) * 100);
            let submaxAb = Math.floor(Math.max(abpMax[sub]));
            let subflatAb = Math.floor(Math.min(abf[main] + abf[sub]));

            // Determine if stats are zero'd.
            let isZeroedClass = "";
            if (sub1realAb === 0 && sub1flatAb === 0) {
                isZeroedClass = " infoDarkGrey";
            }
            return `class='info${sub.replace(/^\w/, (c) => c.toUpperCase())}${isZeroedClass}'>${sub.replace(
                /^\w/,
                (c) => c.toUpperCase()
            )}<br>${subrealAb}%<span class='infoMax'> :${submaxAb}%</span> + ${subflatAb}`;
        }

        // Material
        let iMaterialEqAb = determineAbEquivalances("material", "blunt", "pierce", "acid");
        let iMaterialAb = iMaterialEqAb ? getMainAbsString(true, "material") : getMainAbsString(false, "material");

        solstr += `<span ${iMaterialAb}</span>`;

        if (!iMaterialEqAb) {
            let iBluntAbs = getSubAbsString("material", "blunt");
            let iPierceAbs = getSubAbsString("material", "pierce");
            let iAcidAbs = getSubAbsString("material", "acid");

            solstr += `<span ${iBluntAbs}</span>`;
            solstr += `<span ${iPierceAbs}</span>`;
            solstr += `<span ${iAcidAbs}</span>`;
        }

        // Elemental
        let iElementalEqAb = determineAbEquivalances("elemental", "fire", "frost", "lightning");
        let iElementalAb = iElementalEqAb ? getMainAbsString(true, "elemental") : getMainAbsString(false, "elemental");

        solstr += `<span ${iElementalAb}</span>`;

        if (!iElementalEqAb) {
            let iFireAbs = getSubAbsString("elemental", "fire");
            let iFrostAbs = getSubAbsString("elemental", "frost");
            let iLightningAbs = getSubAbsString("elemental", "lightning");

            solstr += `<span ${iFireAbs}</span>`;
            solstr += `<span ${iFrostAbs}</span>`;
            solstr += `<span ${iLightningAbs}</span>`;
        }

        // Occult
        let iOccultEqAb = determineAbEquivalances("occult", "shadow", "aether", "sacred");
        let iOccultAb = iOccultEqAb ? getMainAbsString(true, "occult") : getMainAbsString(false, "occult");

        solstr += `<span ${iOccultAb}</span>`;

        if (!iOccultEqAb) {
            let iShadowAbs = getSubAbsString("occult", "shadow");
            let iSacredAbs = getSubAbsString("occult", "sacred");
            let iAetherAbs = getSubAbsString("occult", "aether");

            solstr += `<span ${iShadowAbs}</span>`;
            solstr += `<span ${iSacredAbs}</span>`;
            solstr += `<span ${iAetherAbs}</span>`;
        }

        solstr += `</grid></span>`;

        /**
         * Added Damage
         */
        solstr += `<span id='infoDamage'><span class='infoSectionHeader'>Damage</span>`;
        solstr += `<grid id='infoDamageGrid'>`;

        function getDmgString(sub) {
            let dmgmin = Math.floor(dmg[sub].min);
            let dmgmax = Math.ceil(dmg[sub].max);
            let dmgmore = dmg[sub].more * (1 + dmg[sub].increased);

            // Determine if stats are zero'd.
            let isZeroedClass = "";
            if (dmgmin === 0 && dmgmax === 0) {
                isZeroedClass = " infoDarkGrey";
            }

            let isHiddenClass = "";
            if (dmgmore === 1) {
                isHiddenClass = " infoHidden";
            }

            return `class='info${sub.replace(/^\w/, (c) => c.toUpperCase())} ${isZeroedClass}'>${sub.replace(
                /^\w/,
                (c) => c.toUpperCase()
            )}<br>${dmgmin} - ${dmgmax}<br><span class="infoMax${isHiddenClass}">x${+dmgmore.toFixed(2)}</span>`;
        }

        // Material
        let iBluntDmg = getDmgString("blunt");
        let iPierceDmg = getDmgString("pierce");
        let iAcidDmg = getDmgString("acid");

        solstr += `<span class='infoMaterial infoUpper'>Material</span>`;
        solstr += `<span ${iBluntDmg}</span>`;
        solstr += `<span ${iPierceDmg}</span>`;
        solstr += `<span ${iAcidDmg}</span>`;

        // Elemental
        let iFireDmg = getDmgString("fire");
        let iFrostDmg = getDmgString("frost");
        let iLightningDmg = getDmgString("lightning");

        solstr += `<span class='infoElemental infoUpper'>Elemental</span>`;
        solstr += `<span ${iFireDmg}</span>`;
        solstr += `<span ${iFrostDmg}</span>`;
        solstr += `<span ${iLightningDmg}</span>`;

        // Occult
        let iShadowDmg = getDmgString("shadow");
        let iSacredDmg = getDmgString("sacred");
        let iAetherDmg = getDmgString("aether");

        solstr += `<span class='infoOccult infoUpper'>Occult</span>`;
        solstr += `<span ${iShadowDmg}</span>`;
        solstr += `<span ${iSacredDmg}</span>`;
        solstr += `<span ${iAetherDmg}</span>`;

        solstr += `</grid></span>`;

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
