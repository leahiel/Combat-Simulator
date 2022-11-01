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

        // NYI: These values should be updates as the battle goes on.
        // NYI: When the frontline is dead, the backline should be targetable, which is why these values exist.
        this.epfrontlineTargetable = true;
        this.epbacklineTargetable = false;
        this.ppfrontlineTargetable = true;
        this.ppbacklineTargetable = false;

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

/**
 * Given an attack, attacker, and the target, return a bool regarding
 * whether the attack is able to hit the target.
 *
 * NYI: If all frontline characters are dead, frontline attacks should
 *   be able to hit the backline. I have no idea how to do this
 *   properly.
 */
function determineTargetViability(attack, attacker, target) {
    if (target === undefined) {
        return false;
    }

    if (target.health <= 0) {
        return false;
    }

    /**
     * The Combat Instance gives us information on the state of the
     * combat. Relevant information for this function includes:
     *
     * CombatInstance.ep // Which gives us access to ep/pp.ally,
     * CombatInstance.pp // ep/pp.enemy, ep/pp.location.
     * CombatInstance.allyTargetable
     * CombatInstance.opponentTargetable
     * CombatInstance.frontlineTargetable
     * CombatInstance.backlineTargetable
     */
    let ci = State.variables.ci;
    let attackerStatus = "";
    if (attacker.location.includes("player")) {
        attackerStatus = "player";
    } else {
        attackerStatus = "enemy";
    }

    // Determine if/which enemies are targetable.
    if (
        (attack.allyTargetable && attackerStatus === "enemy") ||
        (attack.opponentTargetable && attackerStatus === "player")
    ) {
        if (attack.frontlineTargetable || ci.epfrontlineTargetable) {
            if ([ci.ep[0], ci.ep[1], ci.ep[2]].includes(target)) return true;
        }

        if (attack.backlineTargetable || ci.epbacklineTargetable) {
            if ([ci.ep[3], ci.ep[4]].includes(target)) return true;
        }
    }

    // Determine if/which players are targetable.
    if (
        (attack.allyTargetable && attackerStatus === "player") ||
        (attack.opponentTargetable && attackerStatus === "enemy")
    ) {
        if (attack.frontlineTargetable || ci.ppfrontlineTargetable) {
            if ([ci.pp[0], ci.pp[1]].includes(target)) return true;
        }

        if (attack.backlineTargetable || ci.ppbacklineTargetable) {
            if ([ci.pp[2], ci.pp[3]].includes(target)) return true;
        }
    }

    return false;
}

// If player attack, use this result to assign buttons.
// If enemy attack, use this result to deal damage.
// Will require a rewrite in attackCalculations, and probably an
//   enemyAttack(attack, attacker, assignAttack()) function, which
//   just calls attackCalculations.
/**
 * Returns an array of the objects that are viable targets for an attack.
 */
function assignViableTargets(attack, attacker) {
    /**
     * The Combat Instance gives us information on the state of the
     * combat. Relevant information for this function includes:
     *
     * CombatInstance.ep // Which gives us access to ep/pp.ally,
     * CombatInstance.pp // ep/pp.enemy, ep/pp.location.
     * CombatInstance.allyTargetable
     * CombatInstance.opponentTargetable
     * CombatInstance.frontlineTargetable
     * CombatInstance.backlineTargetable
     */
    let ci = State.variables.ci;
    let solTargets = [];

    // Determine Targets on Enemy side of the field.
    if (determineTargetViability(attack, attacker, ci.ep[0])) {
        solTargets.push(ci.ep[0]);
    }
    if (determineTargetViability(attack, attacker, ci.ep[1])) {
        solTargets.push(ci.ep[1]);
    }
    if (determineTargetViability(attack, attacker, ci.ep[2])) {
        solTargets.push(ci.ep[2]);
    }
    if (determineTargetViability(attack, attacker, ci.ep[3])) {
        solTargets.push(ci.ep[3]);
    }
    if (determineTargetViability(attack, attacker, ci.ep[4])) {
        solTargets.push(ci.ep[4]);
    }

    // Determine Targets on Player side of the field.
    if (determineTargetViability(attack, attacker, ci.pp[0])) {
        solTargets.push(ci.pp[0]);
    }
    if (determineTargetViability(attack, attacker, ci.pp[1])) {
        solTargets.push(ci.pp[1]);
    }
    if (determineTargetViability(attack, attacker, ci.pp[2])) {
        solTargets.push(ci.pp[2]);
    }
    if (determineTargetViability(attack, attacker, ci.pp[3])) {
        solTargets.push(ci.pp[3]);
    }

    return solTargets;
}

/**
 * Randomly decided on an attack, then randomly determine the targets
 * of the attack, then processes the attack.
 */
function attackRandomWithRandom(attacker) {
    let attacksClone = cloneDeep(attacker.attacks);
    let determiningAttack = true;
    let chosenAttack;
    let targets;

    /**
     * Determine which attack to use, but if the attack has no viable
     * targets, then chose a different attack.
     */
    while (determiningAttack) {
        if (attacksClone.length === 0) {
            // There are no viable targets left.
            chosenAttack = null;
            determiningAttack = false;
        }

        chosenAttack = ranItems(1, attacksClone)[0];
        targets = assignViableTargets(chosenAttack, attacker);

        if (targets.length === 0) {
            /* If no targets, remove attack from attacksClone and get another attack. */
            attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
        } else {
            determiningAttack = false;
        }
    }

    if (chosenAttack.targetType === "single") {
        // Pick one target at random.
        targets = ranItems(1, targets);
    }

    attackCalculations(chosenAttack, attacker, targets);
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
     *
     * REVIEW: There could be a buff that changes target
     * characteristics, should be this be done elsewhere to account
     * for that?
     *
     * If so, then applyStats wouldn't be able to applyOpponentStats
     * as well, so the idea of the function would need to be split in
     * two.
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
     * Null generally means no viable attack was generated with
     * attackRandomWithRandom().
     */
    if (attack === null) {
        combatMessage(
            `C:${critMsg} D:${directMsg} B:${blockMsg} Df:${deflectMsg} \n Had no viable attacks.`,
            "default",
            attacker.location
        );
        attacker.init += attacker.initStart;
    }

    /*
     * Actual Attack Calculations
     */
    let solobj = {};
    targets.forEach((target, idx) => {
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
        // Apply Damage
        targets[key].health -= solobj[key].damage;
        if (targets[key].health < 0) {
            targets[key].health = 0;
        }

        // Apply Block Recovery
        if (solobj[key].blocked) {
            targets[key].init += targets[key].blockRecovery;
        }

        // Apply Stun
        // REVIEW: Should stunning always be applied, or have a percentage chance to apply?
        // Probably have a percentage chance.
        targets[key].init += attack.stun;

        // Apply Buffs
        if (attack.buffs.length > 0) {
            for (let buff of attack.buffs) {
                // Get an array of buff names from targets[key].
                // Do not apply buff if target already has buff.
                // TODO: It should update duration.
                let buffNames = assignFieldOfObjectsToArray(targets[key].buffs, "names");
                if (buff.type === "buff" && !buffNames.includes(buff.name)) {
                    targets[key].buffs.push(cloneDeep(buff));
                }

                // Get an array of debuff names from targets[key].
                // Do not apply debuff if target already has debuff.
                // TODO: It should update duration.
                let debuffNames = assignFieldOfObjectsToArray(targets[key].debuffs, "names");
                if (buff.type === "debuff" && !debuffNames.includes(buff.name)) {
                    targets[key].debuffs.push(cloneDeep(buff));
                }
            }
        }

        // Prepare Combat Notification Message
        let blockMsg = solobj[key].blocked ? "✓" : "";
        let critMsg = solobj[key].critical ? "✓" : "";
        let directMsg = solobj[key].direct ? "✓" : "";
        let deflectMsg = solobj[key].deflected ? "✓" : "";

        combatMessage(
            `C:${critMsg} D:${directMsg} B:${blockMsg} Df:${deflectMsg} \n Took ${Math.floor(
                solobj[key].damage
            )} damage.`,
            "default",
            targets[key].location
        );
    }

    attacker.init += attack.initRecovery;
}

// Add combat functions to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    // S.COM.determineTargetViability = function (attack, attacker, target) {
    //     return determineTargetViability(attack, attacker, target);
    // };

    S.COM.assignViableTargets = function (attacker, attack) {
        return assignViableTargets(attacker, attack);
    };

    S.COM.attackRandomWithRandom = function (attacker) {
        return attackRandomWithRandom(attacker);
    };

    S.COM.attackCalculations = function (attack, attacker, targets) {
        return attackCalculations(attack, attacker, targets);
    };
    S.COM.CombatInstance = CombatInstance;
})(setup);
