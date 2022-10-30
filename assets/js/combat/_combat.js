// LINK: assets/js/_setup.js#COMBAT

/**
 * So this is the file for the combat in this game. In addition to doing what needs to be done, it also needs to be able to do the following two things:
 *      Be Sped Up
 *          - i.e. Have an AI perform the fights for both sides of the combat.
 *
 * The things we need for this are:
 *          - The Combantant objects should also have built-in AI which has two settings:
 *              - Intended
 *              - Realistic
 *                - Actually, this means that I will need an Intended and Realistic mode for every single combat related object: Items, magic, enemies, attacks, etc etc.
 *          - Desired but not really feasible: The player should also have a built-in AI which has an Intended and Realistic setting.
 *
 *
 *        For this project, the combat passage must:
 *          - Show the statisitical details of all combatants.
 *
 *        In the future, the combat passage will be expanded to instead take combatInstances data, which detail the setting (music, background etc), enemies, status, victory/lose conditions, and more.
 */

// Use <<flash>> for notifications. Change location with custom css layout. https://github.com/SjoerdHekking/custom-macros-sugarcube2/tree/main/Notification

// ##     ## ######## #### ##       #### ######## #### ########  ######
// ##     ##    ##     ##  ##        ##     ##     ##  ##       ##    ##
// ##     ##    ##     ##  ##        ##     ##     ##  ##       ##
// ##     ##    ##     ##  ##        ##     ##     ##  ######    ######
// ##     ##    ##     ##  ##        ##     ##     ##  ##             ##
// ##     ##    ##     ##  ##        ##     ##     ##  ##       ##    ##
//  #######     ##    #### ######## ####    ##    #### ########  ######

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
   * @param {Object} statusobj Lets us know if stuff was crit or grazed or whatnot.
   * @param {Attack} attack
   * @param {Combatant} attacker
   * @param {[...Combatant]} targets
   * @param {String} sub The specific damage type being calculated for.
   */
  function calculateDamage(statusobj, attack, target, sub) {
    let main = "";
    switch (sub) {
      case "blunt":
      case "pierce":
      case "acid":
        main = "material";
        break;
      case "fire":
      case "frost":
      case "lightning":
        main = "elemental";
        break;
      case "sacred":
      case "shadow":
      case "aether":
        main = "occult";
        break;
    }

    let absorbPercent = Math.max(target.absorbPercent[main], target.absorbPercent[sub]);
    absorbPercent = Math.min(absorbPercent, target.absorbPercentMax[sub]);
    let absorb = 0;
    let absorbFlat = 0;
    let damageResult;
    let blockedDamageModifier = 0;

    // Determine Initial Damage Value
    if (statusobj.direct && !statusobj.grazed) {
      // Direct Hit
      damageResult = attack.damage[sub].max;

      // Direct Hits "pierce" this percentage of Block.
      blockedDamageModifier = .2;
    } else {
      // TODO: I need a randomValue function.
      damageResult = Math.max(
        Math.random() * (attack.damage[sub].min - attack.damage[sub].max) + attack.damage[sub].max,
        0
      );
    }

    // Apply Blocked Damage
    if (statusobj.blocked) {
      switch (main) {
        case "material":
          damageResult *= (0 + blockedDamageModifier); // 0 damage.
          break;
        case "elemental":
          damageResult *= (0.2 + blockedDamageModifier); // 80% Less Elemental Damage.
          break;
        case "occult":
          damageResult *= (0.35 + blockedDamageModifier); // 65% Less Occult Damage.
          break;
      }
    }

    // If we do no damage, don't bother with the rest of the damage calculations.
    if (damageResult === 0) {
      return 0;
    }

    // Apply Expertise Modifier
    // NOTE: NYI
    // Shouldn't this be done in applyStats()?

    // Apply Critical Strike Damage if Applicable
    if (statusobj.critical && !statusobj.grazed) {
      damageResult *= attack.criticalDamageCalculated;
    }

    // Apply Grazed Damage
    // We don't apply Grazed if the attack was a Critical or Direct Hit. Instead, Grazed turned those attacks into normal attacks.
    if (statusobj.grazed && !(statusobj.critical || statusobj.direct)) {
      switch (main) {
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
    
    // Resistance %
    damageResult =
      damageResult *
      (1 -
        Math.max(
          Math.min(target.resistance[main], target.resistanceMax[main]),
          Math.min(target.resistance[sub], target.resistanceMax[sub])
        ));

    // Absorb Percentage Here
    absorb = damageResult * absorbPercent;
    damageResult = damageResult - absorb;

    // Flat Reduct
    if (damageResult > 0) {
      damageResult = Math.max(damageResult - target.reduct[main] - target.reduct[sub], 0);
    }

    // Flat Absorb
    if (damageResult > 0) {
      absorbFlat = Math.max(target.absorbFlat[sub] + target.absorbFlat[main], damageResult * -1);
      damageResult = damageResult - absorbFlat;
    }

    return Math.floor(damageResult * 10000) / 10000;
  }
  /**
   * Applies the char's stats to the Attack.
   * Does not modify original Attack.
   */
  function applyStats(attack, char) {
    let solAttack = cloneDeep(attack);
    solAttack.criticalChanceBase += char.criticalChanceBase;
    solAttack.criticalChanceIncreased += char.criticalChanceIncreased;
    solAttack.criticalChanceMore *= char.criticalChanceMore;
    solAttack.criticalChanceCalculated = solAttack.criticalChanceBase * solAttack.criticalChanceIncreased * solAttack.criticalChanceMore;

    solAttack.criticalDamageBase += char.criticalDamageBase;
    solAttack.criticalDamageIncreased += char.criticalDamageIncreased;
    solAttack.criticalDamageMore *= char.criticalDamageMore;
    solAttack.criticalDamageCalculated = solAttack.criticalDamageBase * solAttack.criticalDamageIncreased * solAttack.criticalDamageMore;

    solAttack.directChanceBase += char.directChanceBase;
    solAttack.directChanceIncreased += char.directahanceIncreased;
    solAttack.directChanceMore *= char.directChanceMore;
    solAttack.directChanceCalculated = solAttack.directChanceBase * solAttack.directChanceIncreased * solAttack.directChanceMore;

    return solAttack;
  }

  // TODO: A proper assignAttack function needs to be made.
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
    // Resistance
    // Remove Percentage Absorb
    // Flat Reduct
    // Remove Flat Absorb
    // Add Healing

    // Determine if Direct Hit.
    if (Math.random() < thisAttack.directChanceCalculated) {
      solobj[idx].direct = true;
    } else {
      solobj[idx].direct = false;
    }

    // Determine if Critical Strike.
    if (Math.random() < thisAttack.criticalChanceCalculated) {
      solobj[idx].critical = true;
    } else {
      solobj[idx].critical = false;
    }

    // Calculate if Grazed.
    if (Math.random() < target.grazedCalculated) {
      solobj[idx].grazed = true;
    } else {
      solobj[idx].grazed = false;
    }

    // Calculate if Blocked.
    if (Math.random() < target.blockCalculated) {
      solobj[idx].blocked = true;
    } else {
      solobj[idx].blocked = false;
    }

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
    //   console.table(damageobj);
    // }

    // NOTE: If the attack was blocked, this should return the string "Blocked" instead.
    solobj[idx].damage = damageobj.total;
  });

  // Apply solobj to party
  // NOTE: In time this will do more than just damage, and so this code will need to be changed.
  for (let key in solobj) {
    targetsHit[key].health -= solobj[key].damage;
    if (targetsHit[key].health < 0) {
      targetsHit[key].health = 0;
    }
    combatMessage(`Took ${Math.floor(solobj[key].damage)} damage.`, "default", targetsHit[key].location);
  }

  // Character has been stunned/blocked/attacked recently and needs to recover. The stun/block/attack needs to add init to the correct targets.
  // NOTE: There is no stunning or blocking in this game.
  attacker.init += attack.initRecovery;
}

// Add all the attacks to setup.
(function (S) {
  if (!S.COM) {
    S.COM = {};
  }

  S.COM.attackCalculations = function (attack, attacker, targets) {
    return attackCalculations(attack, attacker, targets);
  };

})(setup);
