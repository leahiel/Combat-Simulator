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
        jQuery.extend(true, this, /* DEFAULT_COMBAT_INSTANCE, */ obj);

        this.log = [];

        /* Default Values */

        this.epfrontlineTargetable = false;
        this.epbacklineTargetable = false;
        this.ppfrontlineTargetable = false;
        this.ppbacklineTargetable = false;

        /* Initialize Player Party */
        this.pp = [];
        if (State.variables.pc) {
            this.pp.push(State.variables.pc);
        }
        if (State.variables.pp) {
            this.pp.push(State.variables.pp);
        }
        if (State.variables.tp1) {
            this.pp.push(State.variables.tp1);
        }
        if (State.variables.tp2) {
            this.pp.push(State.variables.tp2);
        }

        for (let uninitPlayer in this.pp) {
            this.pp[uninitPlayer] = new setup.COM.Combatant(this.pp[uninitPlayer]);
        }

        /* Initialize Enemy Party */
        for (let uninitEnemy in this.ep) {
            this.ep[uninitEnemy] = new setup.COM.Combatant(monsters[this.ep[uninitEnemy]]);
        }

        /* Add the locations of each character to their obj. */
        let alphabet = ["A", "B", "C", "D", "E", "F"];
        let int = 0;
        // Enemy Party locations.
        for (let char of this.ep) {
            char.ally = false;
            char.enemy = true;
            char.location = `enemy${alphabet[int]}`;
            char.name += ` [${alphabet[int]}]`;
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
 * Given an attack, attacker, and a target, return a bool regarding
 * whether the attack is able to hit the target.
 */
function determineTargetViability(attack, attacker, target) {
    let at = attack.targets;

    if (target === undefined) {
        return false;
    }

    if (target.health <= 0) {
        return false;
    }

    // So long as at least one Combatant is alive, the attack will hit it.
    if (at.style === "all") {
        return true;
    }

    // Naturally, the Combatant that is attacking should be able to target itself without an issue.
    if (at.style === "self") {
        if (attacker === target) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * The Combat Instance gives us information on the state of the
     * combat. Relevant information for this function includes:
     *
     * CombatInstance.ep // Which gives us access to ep/pp.ally,
     * CombatInstance.pp // ep/pp.enemy, ep/pp.location.
     * CombatInstance.ppfrontlineTargetable
     * CombatInstance.ppbacklineTargetable
     * CombatInstance.epfrontlineTargetable
     * CombatInstance.epbacklineTargetable
     */
    let ci = State.variables.ci;
    let attackerStatus = attacker.location.includes("player") ? "player" : "enemy";

    // Determine which Combatants on the enemy side are targetable.
    if (
        ((at.side === "ally" || at.side === "both") && attackerStatus === "enemy") ||
        ((at.side === "enemy" || at.side === "both") && attackerStatus === "player")
    ) {
        // "side"
        if (at.style === "side") {
            if ([ci.ep[0], ci.ep[1], ci.ep[2], ci.ep[3], ci.ep[4]].includes(target)) return true;
        }

        // "row" || "single"
        if (at.style === "row" || at.style === "single") {
            if (at.row === "front" || at.row === "both" || ci.epfrontlineTargetable) {
                if ([ci.ep[0], ci.ep[1], ci.ep[2]].includes(target)) return true;
            }

            if (at.row === "back" || at.row === "both" || ci.epbacklineTargetable) {
                if ([ci.ep[3], ci.ep[4]].includes(target)) return true;
            }
        }
    }

    // Determine which Combatants on the player side are targetable.
    if (
        ((at.side === "ally" || at.side === "both") && attackerStatus === "player") ||
        ((at.side === "enemy" || at.side === "both") && attackerStatus === "enemy")
    ) {
        // "side"
        if (at.style === "side") {
            if ([ci.pp[0], ci.pp[1], ci.pp[2], ci.pp[3]].includes(target)) return true;
        }

        // "row" || "single"
        if (at.style === "row" || at.style === "single") {
            if (at.row === "front" || at.row === "both" || ci.ppfrontlineTargetable) {
                if ([ci.pp[0], ci.pp[1]].includes(target)) return true;
            }

            if (at.row === "back" || at.row === "both" || ci.ppbacklineTargetable) {
                if ([ci.pp[2], ci.pp[3]].includes(target)) return true;
            }
        }
    }

    // The target didn't match the condition for any other return.
    return false;
}

/**
 * Returns an array of the objects that are viable targets for an attack.
 */
function assignViableTargets(attack, attacker) {
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
function combatAIRandom(ci) {
    let attacksClone = cloneDeep(ci.activeCharacter.attacks);
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
        targets = assignViableTargets(chosenAttack, ci.activeCharacter);

        if (targets.length === 0) {
            /* If no targets, remove attack from attacksClone and get another attack. */
            attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
        } else {
            determiningAttack = false;
        }
    }

    // Pick one target at random if it in a single target attack.
    if (chosenAttack.targetType === "single") {
        chosenAttack.targets = ranItems(1, targets);
    }

    attackCalculations(chosenAttack, ci.activeCharacter, targets);
}

/**
 * The simple AI only takes into consideration the attacker itself.
 *
 * Essentially, Combatants with this AI won't buff themselves if they
 * are already buffed. Their attacks are still random with random
 * targets though.
 */
function combatAISimple(ci) {
    let attacksClone = cloneDeep(ci.activeCharacter.attacks);
    let chosenAttack;
    let targets;

    // Remove buffs from the pool of eligible attacks if
    // attacker already has the buff.
    let curBuffs = [];
    for (let buff of ci.activeCharacter.buffs) {
        curBuffs.push(buff.name);
    }

    for (let attack of attacksClone) {
        // If it's not a buff, we don't care.
        if (attack.type !== "buff") {
            continue;
        }

        // If it's not something that can buff the attacker, we don't care.
        if (attack.targets.style !== "self" || (attack.targets.style !== "row" && attack.targets.side !== "ally")) {
            continue;
        }

        if (curBuffs.includes(attack.buffs.name)) {
            // We're already buffed with this buff, so remove the buff.
            attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
        }
    }

    // NYI: If an attack would heal self, don't do it if we don't heal
    // for at least 60% of the heal amount.

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
        targets = assignViableTargets(chosenAttack, ci.activeCharacter);

        if (targets.length === 0) {
            /* If no targets, remove attack from attacksClone and get another attack. */
            attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
        } else {
            determiningAttack = false;
        }
    }

    // Pick one target at random if it in a single target attack.
    if (chosenAttack.targetType === "single") {
        chosenAttack.targets = ranItems(1, targets);
    }

    attackCalculations(chosenAttack, ci.activeCharacter, targets);
}

/**
 * The normal AI only takes into consideration the attacker and their
 * team.
 *
 * Essentially, Combatants won't buff team members with a buff if that
 * team member already has the buff.
 */
function combatAINormal(ci) {
    let attacksClone = cloneDeep(ci.activeCharacter.attacks);
    let chosenAttack;

    // For each attack, we need to determine the targets. If no
    // targets, then we remove it.
    for (let attack of attacksClone) {
        attack.targeting = assignViableTargets(attack, ci.activeCharacter);

        // Single Target Attacks
        if (attack.targets.style === "self") {
            for (let target of attack.targeting) {
                if (ci.ep.includes(target)) {
                    // Don't buff if target already has buff.
                    if (attack.type === "buff") {
                        let curBuffs = [];
                        for (let buff of target.buffs) {
                            curBuffs.push(buff.name);
                        }

                        if (curBuffs.includes(attack.buffs.name)) {
                            // Target already buffed with this buff, so remove the target.
                            attack.targeting = attack.targeting.filter((char) => char !== target);
                        }
                    }

                    // NYI: Don't heal if target won't heal for at least 60% of the heal amount.
                }
            }

            /* If no targets, remove attack from attacksClone. */
            if (attack.targeting.length === 0) {
                attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
            }
        } else {
            // AoE Target Attacks
            for (let target of attack.targeting) {
                // Don't consider enemy targets.
                if (ci.pp.includes(target)) {
                    attack.targeting = attack.targeting.filter((char) => char !== target);
                    continue;
                }

                // Don't buff if target already has buff.
                let curBuffs = [];
                for (let buff of target.buffs) {
                    curBuffs.push(buff.name);
                }

                if (curBuffs.includes(attack.buffs.name)) {
                    // Target already buffed with this buff, so remove the target.
                    attack.targeting = attack.targeting.filter((char) => char !== target);
                }

                // NYI: Don't heal if target won't heal for at least 60% of the heal amount.
            }

            // If no targets, remove attack from attacksClone.
            // Otherwise, regenerate the targets.
            if (attack.targeting.length === 0) {
                attacksClone = attacksClone.filter((attack) => attack !== chosenAttack);
            } else {
                // TODO: If "row" with "both", choose a side here before regenerating the targets.
                attack.targeting = assignViableTargets(attack, ci.activeCharacter);
            }
        }
    }

    /**
     * Determine which attack to use, but if the attack has no viable
     * targets, then chose a different attack.
     */
    chosenAttack = ranItems(1, attacksClone)[0];

    // Pick one target at random if it in a single target attack.
    if (chosenAttack.targetType === "single") {
        chosenAttack.targeting = ranItems(1, chosenAttack.targeting);
    }

    attackCalculations(chosenAttack, ci.activeCharacter, chosenAttack.targeting);
}

/**
 * Performs all the Attack Calculations.
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

        if (attack.type === "attack" || damageResult !== 0) {
            damageResult *= attack.wdm;
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
     * ANSWER: This has to be globally available so that we can use
     * this in Attack.itemPlate().
     *
     * If so, then applyStats wouldn't be able to applyOpponentStats,
     * so the idea of the function would need to be split in two as
     * well.
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
        solAttack.directChanceIncreased += char.directChanceIncreased;
        solAttack.directChanceMore *= char.directChanceMore;
        solAttack.directChanceCalculated =
            solAttack.directChanceBase * solAttack.directChanceIncreased * solAttack.directChanceMore;

        // Update Attack Properties with Character Properties
        function updateProperties(attack, attacker, propobjname) {
            Object.keys(attack[propobjname]).forEach(function (prop) {
                if (prop === "more") {
                    attack[propobjname][prop] *= attacker[propobjname][prop];
                } else {
                    attack[propobjname][prop] += attacker[propobjname][prop];
                }
            });
        }

        updateProperties(solAttack.damage, char.damage, "blunt");
        updateProperties(solAttack.damage, char.damage, "pierce");
        updateProperties(solAttack.damage, char.damage, "acid");
        updateProperties(solAttack.damage, char.damage, "fire");
        updateProperties(solAttack.damage, char.damage, "frost");
        updateProperties(solAttack.damage, char.damage, "lightning");
        updateProperties(solAttack.damage, char.damage, "sacred");
        updateProperties(solAttack.damage, char.damage, "shadow");
        updateProperties(solAttack.damage, char.damage, "aether");

        // NYI: A function to update the damage AGAIN, this time with MORE and INCREASED calculated.
        function calcRealDamage(sub) {
            let increased = solAttack.damage[sub].increased;
            let more = solAttack.damage[sub].more;
            solAttack.damage[sub].min = Math.floor(solAttack.damage[sub].min * (1 + increased) * more);
            solAttack.damage[sub].max = Math.floor(solAttack.damage[sub].max * (1 + increased) * more);
        }

        calcRealDamage("blunt");
        calcRealDamage("pierce");
        calcRealDamage("acid");
        calcRealDamage("fire");
        calcRealDamage("frost");
        calcRealDamage("lightning");
        calcRealDamage("sacred");
        calcRealDamage("shadow");
        calcRealDamage("aether");

        return solAttack;
    }

    /**
     * Null generally means no viable attack was generated with
     * attackRandomWithRandom().
     */
    if (attack === null) {
        combatMessage(null, attacker);
        attacker.init += attacker.initStart;
        return;
    }

    /*
     * Actual Attack Calculations
     */
    // TODO: solobj should be solarr, and an Array.
    let solobj = {};
    targets.forEach((target, idx) => {
        for (let i = 0; i < attack.hitnumber; i++) {
            if (!solobj[i]) {
                solobj[i] = {};
            }
            solobj[i][idx] = {};
            solobj[i][idx].name = target.name;

            // Apply the attacker's stats to a copy of the attack.
            let thisAttack = applyStats(attack, attacker);

            if (thisAttack.effect === "buff" || thisAttack.effect === "debuff") {
                return;
            }

            // Order of Operations
            // Determine Modifiers (Direct, Critical, Glancing, Blocking)
            // Use Modifiers to get initial Damage Value.
            // Resistance
            // Remove Percentage Absorb
            // Flat Reduct
            // Remove Flat Absorb
            // Add Healing from Absorb

            // Calculate if Blocked.
            if (thisAttack.isBlockable && thisAttack.targets.style !== "self") {
                // NYI: target's blockCalculated should apply the attacks block manipulation stats properly.
                solobj[i][idx].blocked = Math.random() < target.blockCalculated - attack.blockCalculated ? true : false;
            } else {
                solobj[i][idx].blocked = false;
            }

            // Calculate if Deflected.
            if (thisAttack.isDeflectable && thisAttack.targets.style !== "self") {
                // NYI: target's deflectCalculated should apply the attacks deflect manipulation stats properly.
                solobj[i][idx].deflected =
                    Math.random() < target.deflectCalculated - attack.deflectCalculated ? true : false;
            } else {
                solobj[i][idx].deflected = false;
            }

            // Determine if Direct Hit.
            // NOTE: Direct Hits do not occur if the attack was deflected.
            if (thisAttack.isDirectable && thisAttack.targets.style !== "self") {
                solobj[i][idx].direct =
                    Math.random() < thisAttack.directChanceCalculated && !solobj[i][idx].deflected ? true : false;
            } else {
                solobj[i][idx].direct = false;
            }

            // Determine if Critical Strike.
            // NOTE: Critical Strikes do not occur if the attack was blocked or deflected.
            if (thisAttack.isCritable && thisAttack.targets.style !== "self") {
                solobj[i][idx].critical =
                    Math.random() < thisAttack.criticalChanceCalculated &&
                    (!solobj[i][idx].blocked || !solobj[i][idx].deflected)
                        ? true
                        : false;
            } else {
                solobj[i][idx].critical = false;
            }

            let damageobj = {
                blunt: calculateDamage(solobj[i][idx], thisAttack, target, "blunt"),
                pierce: calculateDamage(solobj[i][idx], thisAttack, target, "pierce"),
                acid: calculateDamage(solobj[i][idx], thisAttack, target, "acid"),
                fire: calculateDamage(solobj[i][idx], thisAttack, target, "fire"),
                frost: calculateDamage(solobj[i][idx], thisAttack, target, "frost"),
                lightning: calculateDamage(solobj[i][idx], thisAttack, target, "lightning"),
                sacred: calculateDamage(solobj[i][idx], thisAttack, target, "sacred"),
                shadow: calculateDamage(solobj[i][idx], thisAttack, target, "shadow"),
                aether: calculateDamage(solobj[i][idx], thisAttack, target, "aether"),
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

            solobj[i][idx].damage = damageobj.total;
        }
    });

    /** Apply solobj to party */
    for (let i in solobj) {
        for (let idx in solobj[i]) {
            if (solobj[i][idx].damage >= 1) {
                // Apply Damage
                targets[idx].health -= solobj[i][idx].damage;
                if (targets[idx].health < 0) {
                    targets[idx].health = 0;
                }
            }

            // Apply Block Recovery
            if (solobj[i][idx].blocked) {
                targets[idx].init += targets[idx].blockRecovery;
            }

            // Apply Stun
            // REVIEW: Should stunning always be applied, or have a percentage chance to apply?
            // Probably have a percentage chance.
            // Regardless, don't apply if deflected.
            if (!solobj[i][idx].deflected) {
                targets[idx].init += attack.stun;
            }

            // Apply Buffs and Debuffs
            if (attack.buffs.length > 0) {
                solobj[i][idx].buffsapplied = [];
                solobj[i][idx].buffsreapplied = [];

                for (let buff of attack.buffs) {
                    // Get an array of buff names from targets[idx].
                    let buffNames = assignFieldOfObjectsToArray(targets[idx].buffs, "name");

                    // Do not apply buff if target already has the buff.
                    if (!buffNames.includes(buff.name)) {
                        targets[idx].buffs.push(cloneDeep(buff));
                        buff.onApply(targets[idx]);

                        solobj[i][idx].buffsapplied.push(buff);

                        // Reapply buff if target already has the buff.
                    } else if (buffNames.includes(buff.name)) {
                        // The index of the buff in buffNames should be the same as the index of the buff in targets[idx].buffs.
                        let buffidx = buffNames.indexOf(buff.name);
                        // Reset the duration of the buff.
                        targets[idx].buffs[buffidx].duration = buff.duration;

                        // Reapply the buff.
                        buff.onReapply(targets[idx]);

                        solobj[i][idx].buffsreapplied.push(buff);
                    }
                }
            }

            // Prepare Combat Notification Message
            let blockMsg = solobj[i][idx].blocked ? "✓" : "";
            let critMsg = solobj[i][idx].critical ? "✓" : "";
            let directMsg = solobj[i][idx].direct ? "✓" : "";
            let deflectMsg = solobj[i][idx].deflected ? "✓" : "";

            // TODO: Have a delay between messages if there are 2+ strikes at a time.
            combatMessage(attack, targets[idx], solobj[i][idx]);
        }
    }

    attacker.init += attack.initRecovery * attacker.initRecoveryModifier;

    // Battle Log
    // TODO: We should call ci as an argument instead of this.
    let cilog = State.variables.ci.log;
    cilog.push(`${attacker.name} used ${attack.name}!`);
    for (let i = 0; i < Object.keys(solobj).length; i++) {
        for (let j = 0; j < Object.keys(solobj[i]).length; j++) {
            if (solobj[i][j].blocked) {
                // Blocked
                cilog.push(`${solobj[i][j].name} blocked it, taking ${solobj[i][j].damage} damage.`);
            } else if (solobj[i][j].deflected) {
                // Deflected
                cilog.push(`${solobj[i][j].name} deflected it, taking ${solobj[i][j].damage} damage.`);
            } else if (solobj[i][j].damage > 0) {
                // Else
                cilog.push(`Dealt ${solobj[i][j].damage} damage to ${solobj[i][j].name}.`);
            }

            // Applied Buffs
            if (solobj[i][j].buffsapplied) {
                for (let buff of solobj[i][j].buffsapplied) {
                    if (buff.type === "buff") {
                        cilog.push(`${solobj[i][j].name} was buffed with ${buff.name}.`)
                    } else if (buff.type === "buff") {
                        cilog.push(`${solobj[i][j].name} was inflicted with ${buff.name}.`)
                    }
                }
            }

            // Re-Applied Buffs
            if (solobj[i][j].buffsreapplied) {
                for (let buff of solobj[i][j].buffsreapplied) {
                    if (buff.type === "buff") {
                        cilog.push(`${solobj[i][j].name} was re-buffed with ${buff.name}.`)
                    } else if (buff.type === "buff") {
                        cilog.push(`${solobj[i][j].name} was re-inflicted with ${buff.name}.`)
                    }
                }
            }
        }
    }
    cilog.push(`<br>`);
}

function determineRowViabilities() {
    let ci = State.variables.ci;

    /* If all of the frontline of a side are dead, allow frontline
    attacks to hit backline. */
    if (
        (!ci.ep[0] || ci.ep[0].health <= 0) &&
        (!ci.ep[1] || ci.ep[1].health <= 0) &&
        (!ci.ep[2] || ci.ep[2].health <= 0)
    ) {
        ci.epbacklineTargetable = true;
    }
    if ((!ci.pp[0] || ci.pp[0].health <= 0) && (!ci.pp[1] || ci.pp[1].health <= 0)) {
        ci.ppbacklineTargetable = true;
    }

    /* If all of the backline of a side are dead, allow backline
    attacks to hit frontline. */
    if ((!ci.ep[3] || ci.ep[3].health <= 0) && (!ci.ep[4] || ci.ep[4].health <= 0)) {
        ci.epfrontlineTargetable = true;
    }
    if ((!ci.pp[2] || ci.pp[2].health <= 0) && (!ci.pp[3] || ci.pp[3].health <= 0)) {
        ci.ppfrontlineTargetable = true;
    }
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

    S.COM.combatAIRandom = function (ci) {
        return combatAIRandom(ci);
    };

    S.COM.combatAISimple = function (ci) {
        return combatAISimple(ci);
    };

    S.COM.combatAINormal = function (ci) {
        return combatAINormal(ci);
    };

    S.COM.attackCalculations = function (attack, attacker, targets) {
        return attackCalculations(attack, attacker, targets);
    };

    S.COM.determineRowViabilities = function () {
        return determineRowViabilities();
    };

    S.COM.CombatInstance = CombatInstance;
})(setup);
