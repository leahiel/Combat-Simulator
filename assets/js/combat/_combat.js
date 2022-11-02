/// The combat in this game should also be able to:
///     Be Sped Up
///         - i.e. Requires an AI for both sides.
///             [Actually, the player should have a Macro system a la
///              Siralim. But that will take awhile to get programmed.]
///
///     Have two AI settings:
///         - Intended
///         - Realistic
///             [This means there will be an Intended and Realistic
///              mode for every single combat related object: Items,
///              magic, enemies, attacks, etc etc.]

/**
 * The CombatInstance object contains information about the current
 * combat instance, such as the parties of the opponents and whether
 * backlines are targetable.
 *
 * It also initializes a combat as a whole, and as such, modifies
 * Combatant data with information only it knows, like location data.
 *
 * In the future, the CombatInstance will be expanded to instead take
 * data which details the setting (music, background, etc), as well as
 * victory/lose conditions, and more.
 */
class CombatInstance {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, /* DEFAULTATTACK, */ obj);

        /* Default Values */

        this.epfrontlineTargetable = true; // FIXME: This value never toggles.
        this.epbacklineTargetable = false;
        this.ppfrontlineTargetable = true; // FIXME: This value never toggles.
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
        let alphabet = ["A", "B", "C", "D", "E", "F"];
        let int = 0;
        // Enemy Party locations.
        for (let char of this.ep) {
            char.ally = false;
            char.enemy = true;
            char.location = `enemy${alphabet[int]}`;
            int += 1;
        }

        int = 0;
        // Player Party locations.
        for (let char of this.pp) {
            char.ally = true;
            char.enemy = false;
            char.location = `player${alphabet[int]}`;
            int += 1;
        }
    }
}

/**
 * Given an attack, attacker, and the target, return a bool regarding
 * whether the attack is able to hit the target.
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
    let attackerStatus = attacker.location.includes("player") ? "player" : "enemy";

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

/**
 * Returns an array of the objects that are viable targets for an attack.
 */
function assignViableTargets(attack, attacker) {
    /**
     * The Combat Instance gives us information on the state of the
     * combat.
     */
    let ci = State.variables.ci;
    let solTargets = [];

    // Determine Targets on Enemy side of the field.
    for (let char of ci.ep) {
        if (determineTargetViability(attack, attacker, char)) {
            solTargets.push(char);
        }
    }

    // Determine Targets on Player side of the field.
    for (let char of ci.pp) {
        if (determineTargetViability(attack, attacker, char)) {
            solTargets.push(char);
        }
    }

    return solTargets;
}

/**
 * Randomly decided on an attack, then randomly determine the targets
 * of the attack, then processes the attack.
 */
function attackRandomWithRandom(attacker) {
    let attacksClone = cloneDeep(attacker.attacks);
    let chosenAttack;
    let targets;

    /**
     * Determine which attack to use, but if the attack has no viable
     * targets, then chose a different attack.
     */
    let determiningAttack = true;
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
     * Returns an Integer.
     *
     * @param {Object} statusobj Lets us know if stuff was crit or defleccted or whatnot.
     * @param {Attack} attack
     * @param {Combatant} target
     * @param {String} subDamageType The specific damage type being calculated for.
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
        solobj[idx].direct = Math.random() < thisAttack.directChanceCalculated ? true : false;

        // Calculate if Blocked.
        solobj[idx].blocked = Math.random() < target.blockCalculated ? true : false;

        // Determine if Critical Strike.
        solobj[idx].critical =
            Math.random() < thisAttack.criticalChanceCalculated && !solobj[idx].blocked ? true : false;

        // Calculate if Deflected.
        solobj[idx].deflected = Math.random() < target.deflectedCalculated ? true : false;

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
            total: 0,
        };

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

    /** Apply solobj to party */
    for (let idx in solobj) {
        // Apply Damage
        targets[idx].health -= solobj[idx].damage;
        if (targets[idx].health < 0) {
            targets[idx].health = 0;
        }

        // Apply Block Recovery
        if (solobj[idx].blocked) {
            targets[idx].init += targets[idx].blockRecovery;
        }

        // Apply Stun
        // REVIEW: Should stunning always be applied, or have a percentage chance to apply?
        // Probably have a percentage chance.
        targets[idx].init += attack.stun;

        // Apply Buffs and Debuffs
        if (attack.buffs.length > 0) {
            for (let buff of attack.buffs) {
                // Get an array of buff names from targets[idx].
                let buffNames = assignFieldOfObjectsToArray(targets[idx].buffs, "name");

                // Do not apply buff if target already has the buff.
                if (!buffNames.includes(buff.name)) {
                    targets[idx].buffs.push(cloneDeep(buff));
                    buff.onApply(targets[idx]);

                    // Reapply buff if target already has the buff.
                } else if (buffNames.includes(buff.name)) {
                    // The index of the buff in buffNames should be the same as the index of the buff in targets[idx].buffs.
                    let buffidx = buffNames.indexOf(buff.name);
                    // Reset the duration of the buff.
                    targets[idx].buffs[buffidx].duration = buff.duration;

                    // Reapply the buff.
                    buff.onReapply(targets[idx]);
                }
            }
        }

        // Prepare Combat Notification Message
        let blockMsg = solobj[idx].blocked ? "✓" : "";
        let critMsg = solobj[idx].critical ? "✓" : "";
        let directMsg = solobj[idx].direct ? "✓" : "";
        let deflectMsg = solobj[idx].deflected ? "✓" : "";

        combatMessage(
            `C:${critMsg} D:${directMsg} B:${blockMsg} Df:${deflectMsg} \n Took ${Math.floor(
                solobj[idx].damage
            )} damage.`,
            "default",
            targets[idx].location
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
