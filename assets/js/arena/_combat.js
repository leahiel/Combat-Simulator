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
 * Returns an array containing just the values of the specified of multiple objects.
 *
 * @example
 * let arr = [{health: 14}, {health: 12}]
 * assignFieldOfObjectsToArray(arr, "health")
 * // => [14, 12]
 */
function assignFieldOfObjectsToArray(objarr, field) {
  let solarr = [];

  objarr.forEach((v) => {
    solarr.push(v[field]);
  });

  return solarr;
}

/**
 * Check each item in array for a condition. Return true if just one item returns true. Else, return false.
 *
 * @example
 * let arr = [1, 3, 4]
 * someValuesTrue(arr, function(v) {
 *  return v <= 3
 * }
 * // => true
 */
function someValuesTrue(arr, cond) {
  let isViable = false;

  arr.forEach((v) => {
    if (cond(v)) {
      // If one condition is true, return true.
      isViable = true;
      return;
    }
  });

  return isViable;
}

/**
 * Check each item in array for a condition. Return true if all items returns true. Else, return false.
 *
 * @example
 * let arr = [1, 3, 4]
 * allValuesTrue(arr, function(v) {
 *  return v <= 5
 * }
 * // => true
 */
function allValuesTrue(arr, cond) {
  let isViable = true;

  arr.forEach((v) => {
    if (!cond(v)) {
      // If one condition is false, return false.
      isViable = false;
      return;
    }
  });

  return isViable;
}

/**
 *
 * @param {*} attack
 * @param {*} attacker
 * @param {*} targets Either ep or pp
 */
function attackCalculations(attack, attacker, targets) {
  /**
   * Return boolean.
   * Was the attack blocked?
   */
  function wasBlocked(attack, attacker, target) {
    // NOTE: Blocking is not implemented for this game.
    return false;

    // if (Math.random() < target.block.calculated) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  /**
   * Calculate the damage dealt to each of the targets from one element.
   *
   * @param {Attack} attack
   * @param {Combatant} attacker
   * @param {[...Combatant]} targets
   * @param {String} sub The specific damage type being calculated for.
   */
  function calculateDamage(attack, attacker, target, sub) {
    /**
     * Determine if this attack is a direct hit.
     */
    function wasDirectHit(attack, attacker, target) {
      // TODO: I don't want to have attacks cache calculated things. Rather, derive them where they are needed.
      // NOTE: With the todo in mind, we're just gonna disable direct hits for now.
      return false;

      // if (Math.random() <= attack.directhit.calculated) {
      //   return true;
      // } else {
      //   return false;
      // }
    }

    // TODO: Reference attacker's stats where needed.
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

    // TODO: I need a wasDirectHit function.
    if (wasDirectHit(attack, attacker, target)) {
      damageResult = attack.damage[sub].max;
    } else {
      // TODO: I need a randomValue function.
      damageResult = Math.max(
        Math.random() * (attack.damage[sub].min - attack.damage[sub].max) + attack.damage[sub].max,
        0
      );
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

    // Glancing Blow Calculations
    // Disabled for simplicity.
    // TODO: make wasGlancingBlow function.
    // if (isGlancingBlow) {
    //   switch (main) {
    //     case "material":
    //       damageResult = damageResult.times(0.5); // 50% Less Material Damage.
    //       break;
    //     case "elemental":
    //       damageResult = damageResult.times(0.65); // 35% Less Material Damage.
    //       break;
    //     case "occult":
    //       damageResult = damageResult.times(0.85); // 15% Less Material Damage.
    //       break;
    //   }
    // }

    return Math.floor(damageResult * 10000) / 10000;
  }

  // TODO: An assignAttack function needs to be made for parties with more than one character.
  // NOTE: Since there will only be 1v1 battles in this game, this is not a concern.
  let targetsHit = [0];

  /*
   * Actual Attack Calculations
   */
  let solobj = {};
  targets.forEach((target, idx) => {
    if (!targetsHit.includes(idx)) {
      // This target was not aimed for.
      return;
    }

    // Order of Operations
    // Resistance
    // Remove Percentage Absorb
    // Flat Reduct
    // Remove Flat Absorb
    // Add Healing

    let damageobj = {
      blunt: calculateDamage(attack, attacker, target, "blunt"),
      pierce: calculateDamage(attack, attacker, target, "pierce"),
      acid: calculateDamage(attack, attacker, target, "acid"),
      fire: calculateDamage(attack, attacker, target, "fire"),
      frost: calculateDamage(attack, attacker, target, "frost"),
      lightning: calculateDamage(attack, attacker, target, "lightning"),
      sacred: calculateDamage(attack, attacker, target, "sacred"),
      shadow: calculateDamage(attack, attacker, target, "shadow"),
      aether: calculateDamage(attack, attacker, target, "aether"),
    };

    damageobj.total = 0;
    for (let amount in damageobj) {
      if (damageobj[amount] === damageobj.total) continue;
      damageobj.total += damageobj[amount];
    }

    if (Config.debug) {
      console.table(damageobj);
    }

    // Calculate Expertise Modifier
    // NOTE: Not implemented in this game.

    // Calculate Critical Strike, iff Crit hits.
    // NOTE: Not implementd in this game.

    // NOTE: If the attack was blocked, this should return the string "Blocked" instead.
    solobj[idx] = damageobj.total;
  });

  // Apply solobj to party
  // NOTE: In time this will do more than just damage, and so this code will need to be changed.
  for (let key in solobj) {
    targets[key].health -= solobj[key];
    if (targets[key].health < 0) {
      targets[key].health = 0;
    }
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

  if (!S.fns) {
    S.fns = {};
  }

  S.fns.assignFieldOfObjectsToArray = function (objarr, field) {
    return assignFieldOfObjectsToArray(objarr, field);
  };

  S.fns.someValuesTrue = function (arr, cond) {
    return someValuesTrue(arr, cond);
  };

  S.fns.allValuesTrue = function (arr, cond) {
    return allValuesTrue(arr, cond);
  };
})(setup);
