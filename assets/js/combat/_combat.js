/**
 * The combat in this game should also be able to:
 *     Be Sped Up
 *         - i.e. Requires an AI for both sides.
 *             [Actually, the player should have a Macro system a la
 *              Siralim. But that will take awhile to get programmed.]
 *
 *     Have two AI settings:
 *         - Intended
 *         - Realistic
 *             [This means there will be an Intended and Realistic
 *              mode for every single combat related object: Items,
 *              magic, enemies, attacks, etc etc.]
 *
 * In the future, the combat passage will be expanded to instead take
 * combatInstances data, which detail the setting (music, background
 * etc), enemies, status, victory/lose conditions, and more.
 */

class CombatInstance {
    constructor(obj) {
        // This is required as we need to deep assign.
        // let merger = mergeDeep(DEFAULTCOMBATINSTANCE, obj);
        Object.assign(this, obj);

        /* Default Values */
        this.epFrontlineTargetable = true;
        this.epBacklineTargetable = false;
        this.ppFrontlineTargetable = true;
        this.ppBacklineTargetable = false;

        /* Initialize Player Party */
        let temp_ppo = this.pp;
        this.pp = [];
        for (let uninitPlayer of temp_ppo) {
            this.pp.push(new setup.COM.Combatant(uninitPlayer));
        }

        /* Initialize Enemy Party */
        let temp_epo = this.ep;
        this.ep = [];
        for (let uninitEnemy of temp_epo) {
            this.ep.push(new setup.COM.Combatant(setup.COM.monsters[uninitEnemy]));
        }

        /* Add the locations of each character to their obj. */
        for (let i = 0; i < this.ep.length; i++) {
            this.ep[i].ally = false;
            this.ep[i].enemy = true;
            switch (i) {
                case 0:
                    this.ep[i].location = "enemyA";
                    break;
                case 1:
                    this.ep[i].location = "enemyB";
                    break;
                case 2:
                    this.ep[i].location = "enemyC";
                    break;
                case 3:
                    this.ep[i].location = "enemyD";
                    break;
                case 4:
                    this.ep[i].location = "enemyE";
                    break;
            }
        }
        for (let i = 0; i < this.pp.length; i++) {
            this.pp[i].ally = true;
            this.pp[i].enemy = false;
            switch (i) {
                case 0:
                    this.pp[i].location = "playerA";
                    break;
                case 1:
                    this.pp[i].location = "playerB";
                    break;
                case 2:
                    this.pp[i].location = "playerC";
                    break;
                case 3:
                    this.pp[i].location = "playerD";
                    break;
            }
        }
    }
}

// If player attack, use this result to assign buttons.
// If enemy attack, use this result to deal damage.
// Will require a rewrite in attackCalculations, and probably an
//   enemyAttack(attack, attacker, assignAttack()) function, which
//   just calls attackCalculations.
function assignAttack(attack) {
    /**
     * The Combat Instance gives us information on the state of the
     * combat: e.g. Whether backlines are targetable.
     */
    let combatInstance = State.variables.ci;

    console.log(targets);
}

/**
 *
 * @param {*} attack
 * @param {*} attacker
 * @param {*} targets Either ep or pp
 */
function attackCalculations(attack, attacker, targets) {
    /**
     * Calculate the damage dealt to each of the targets from one element.
     *
     * @param {Object} statusobj Lets us know if stuff was crit or defleccted or whatnot.
     * @param {Attack} attack
     * @param {Combatant} attacker
     * @param {[...Combatant]} targets
     * @param {String} subDamageType The specific damage type being calculated for.
     *
     * @returns Integer
     */
    function calculateDamage(statusobj, attack, target, subDamageType) {
        let mainDamageType = "";
        switch (subDamageType) {
            case "blunt":
            case "pierce":
            case "acid":
                mainDamageType = "material";
                break;
            case "fire":
            case "frost":
            case "lightning":
                mainDamageType = "elemental";
                break;
            case "sacred":
            case "shadow":
            case "aether":
                mainDamageType = "occult";
                break;
        }

        let absorbPercent = Math.max(target.absorbPercent[mainDamageType], target.absorbPercent[subDamageType]);
        absorbPercent = Math.min(absorbPercent, target.absorbPercentMax[subDamageType]);
        let absorb = 0; // This should be moved to Enemy/Combatant
        let absorbFlat = 0; // This should be moved to Enemy/Combatant
        let damageResult;
        let blockedDamageModifier = 0;

        // Determine Initial Damage Value
        if (statusobj.direct && !statusobj.deflected) {
            // Direct Hit
            damageResult = attack.damage[subDamageType].max;

            // Direct Hits "pierce" this percentage of Block.
            blockedDamageModifier = 0.2;
        } else {
            // TODO: I need a randomValue function.
            damageResult = Math.max(
                Math.random() * (attack.damage[subDamageType].min - attack.damage[subDamageType].max) +
                    attack.damage[subDamageType].max,
                0
            );
        }

        // Apply Blocked Damage
        if (statusobj.blocked) {
            switch (mainDamageType) {
                case "material":
                    damageResult *= 0 + blockedDamageModifier; // 100% Less Material Damage.
                    break;
                case "elemental":
                    damageResult *= 0.2 + blockedDamageModifier; // 80% Less Elemental Damage.
                    break;
                case "occult":
                    damageResult *= 0.35 + blockedDamageModifier; // 65% Less Occult Damage.
                    break;
            }
        }

        // If we do no damage, don't bother with the rest of the damage calculations.
        if (damageResult === 0) {
            return 0;
        }

        // NYI: Apply Expertise Modifier
        // Shouldn't that be done in applyStats()?

        // Apply Critical Strike Damage if Applicable
        if (statusobj.critical && !statusobj.deflected) {
            damageResult *= attack.criticalDamageCalculated;
        }

        // Apply Deflected Damage
        if (statusobj.deflected && !(statusobj.critical || statusobj.direct)) {
            // We don't apply Deflected if the attack was a Critical or
            // Direct Hit. Instead, Deflected turns those attacks into
            // normal attacks.
            switch (mainDamageType) {
                case "material":
                    damageResult *= 0.5; // 50% Less Material Damage.
                    break;
                case "elemental":
                    damageResult *= 0.65; // 35% Less Elemental Damage.
                    break;
                case "occult":
                    damageResult *= 0.85; // 15% Less Occult Damage.
                    break;
            }
        }

        // Apply Resistance Percentage.
        damageResult =
            damageResult *
            (1 -
                Math.max(
                    Math.min(target.resistance[mainDamageType], target.resistanceMax[mainDamageType]),
                    Math.min(target.resistance[subDamageType], target.resistanceMax[subDamageType])
                ));

        // Apply Absorb Percentage.
        absorb = damageResult * absorbPercent;
        damageResult = damageResult - absorb;

        // Apply Flat Reduct.
        if (damageResult > 0) {
            damageResult = Math.max(damageResult - target.reduct[mainDamageType] - target.reduct[subDamageType], 0);
        }

        // Apply Flat Absorb.
        if (damageResult > 0) {
            absorbFlat = Math.max(
                target.absorbFlat[subDamageType] + target.absorbFlat[mainDamageType],
                damageResult * -1
            );
            damageResult = damageResult - absorbFlat;
        }

        return Math.floor(damageResult * 10000) / 10000;
    }

    /**
     * Applies the char's stats to the Attack.
     * Does not modify original Attack.
     *
     * @param {Attack} attack
     * @param {Combatant} char
     *
     * @returns new Attack
     */
    function applyStats(attack, char) {
        let solAttack = cloneDeep(attack);
        solAttack.criticalChanceBase += char.criticalChanceBase;
        solAttack.criticalChanceIncreased += char.criticalChanceIncreased;
        solAttack.criticalChanceMore *= char.criticalChanceMore;
        solAttack.criticalChanceCalculated =
            solAttack.criticalChanceBase * solAttack.criticalChanceIncreased * solAttack.criticalChanceMore;

        solAttack.criticalDamageBase += char.criticalDamageBase;
        solAttack.criticalDamageIncreased += char.criticalDamageIncreased;
        solAttack.criticalDamageMore *= char.criticalDamageMore;
        solAttack.criticalDamageCalculated =
            solAttack.criticalDamageBase * solAttack.criticalDamageIncreased * solAttack.criticalDamageMore;

        solAttack.directChanceBase += char.directChanceBase;
        solAttack.directChanceIncreased += char.directahanceIncreased;
        solAttack.directChanceMore *= char.directChanceMore;
        solAttack.directChanceCalculated =
            solAttack.directChanceBase * solAttack.directChanceIncreased * solAttack.directChanceMore;

        return solAttack;
    }

    /**
     * The Combat Instance gives us information on the state of the
     * combat: e.g. Whether backlines are targetable.
     */
    let combatInstance = State.variables.ci;

    // TODO: A proper assignAttack function needs to be made.
    /* NYI: Frontline/Backline target/attack mechanics. */
    // The output of that will replace viableTargets and targetsHit.
    let viableTargets = [];
    for (let i = 0; i < targets.length; i++) {
        if (targets[i].health > 0) {
            viableTargets.push(targets[i]);
        }
    }

    let targetsHit = ranItems(1, viableTargets);

    /*
     * Actual Attack Calculations
     */
    let solobj = {};
    targetsHit.forEach((target, idx) => {
        solobj[idx] = {};

        // Apply the attacker's stats to a copy of the attack.
        let thisAttack = applyStats(attack, attacker);

        // Order of Operations
        // Determine Modifiers (Direct, Critical, Glancing, Blocking)
        // Use Modifiers to get initial Damage Value.
        // Resistance
        // Remove Percentage Absorb
        // Flat Reduct
        // Remove Flat Absorb
        // Add Healing from Absorb

        // Determine if Direct Hit.
        if (Math.random() < thisAttack.directChanceCalculated) {
            solobj[idx].direct = true;
        } else {
            solobj[idx].direct = false;
        }

        // Calculate if Blocked.
        if (Math.random() < target.blockCalculated) {
            solobj[idx].blocked = true;
        } else {
            solobj[idx].blocked = false;
        }

        // Determine if Critical Strike.
        if (Math.random() < thisAttack.criticalChanceCalculated && !solobj[idx].blocked) {
            // Critical Strikes do not occur if the attack was blocked.
            solobj[idx].critical = true;
        } else {
            solobj[idx].critical = false;
        }

        // Calculate if Deflected.
        if (Math.random() < target.deflectedCalculated) {
            solobj[idx].deflected = true;
        } else {
            solobj[idx].deflected = false;
        }

        // NYI: Calculate if Stunned.

        // Any other On-Hit should be calculated here.

        let damageobj = {
            blunt: calculateDamage(solobj[idx], thisAttack, target, "blunt"),
            pierce: calculateDamage(solobj[idx], thisAttack, target, "pierce"),
            acid: calculateDamage(solobj[idx], thisAttack, target, "acid"),
            fire: calculateDamage(solobj[idx], thisAttack, target, "fire"),
            frost: calculateDamage(solobj[idx], thisAttack, target, "frost"),
            lightning: calculateDamage(solobj[idx], thisAttack, target, "lightning"),
            sacred: calculateDamage(solobj[idx], thisAttack, target, "sacred"),
            shadow: calculateDamage(solobj[idx], thisAttack, target, "shadow"),
            aether: calculateDamage(solobj[idx], thisAttack, target, "aether"),
        };

        damageobj.total = 0;
        for (let amount in damageobj) {
            if (damageobj[amount] === damageobj.total) continue;
            damageobj.total += damageobj[amount];
        }

        // if (Config.debug) {
        //   console.table(solobj);
        //   console.table(damageobj);
        // }

        solobj[idx].damage = damageobj.total;
    });

    // Apply solobj to party
    for (let key in solobj) {
        targetsHit[key].health -= solobj[key].damage;
        if (targetsHit[key].health < 0) {
            targetsHit[key].health = 0;
        }
        // TODO: The combat message should change based on Block/Crit/etc.
        let blockMsg = solobj[key].blocked ? "✓" : "";
        let critMsg = solobj[key].critical ? "✓" : "";
        let directMsg = solobj[key].direct ? "✓" : "";
        let deflectMsg = solobj[key].deflected ? "✓" : "";

        combatMessage(
            `C:${critMsg} D:${directMsg} B:${blockMsg} Df:${deflectMsg} \n Took ${Math.floor(
                solobj[key].damage
            )} damage.`,
            "default",
            targetsHit[key].location
        );
    }

    // TODO: The target(s) may need to recover from a block/stun.
    attacker.init += attack.initRecovery;
}

// Add combat functions to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.attackCalculations = function (attack, attacker, targets) {
        return attackCalculations(attack, attacker, targets);
    };
    S.COM.CombatInstance = CombatInstance;
})(setup);
