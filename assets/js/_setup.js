// The setup object can store objects, which includes functions, of course. This has got to be a terrible idea, but I'm doing it anyways because code maintainablity is more important than anything else to me. This also has a few advantages: It means that console commands can't be used for these functions, which will discourage, though not eliminate, cheating.
// The underscore in filenames (_imports.js, _misc.js, etc.) means that the file is NOT imported using importedScripts().
// ANCHOR[id=setup]
(function (S) {
  if (!S.fns) {
    S.fns = {};
  }

  // ANCHOR[id=UPDATE]
  // LINK: assets/js/save/_update.js
  S.fns.update_save = function () {
    update_save();
  };

  // ANCHOR[id=utilities]
  // LINK: assets/js/_utilities.js
  S.fns.addTooltip = function (macroname, passage, metaname = false) {
    addTooltip(macroname, passage, metaname);
  };

  S.fns.ranItems = function (amount, arr, isDuplicatable = false) {
    return ranItems(amount, arr, isDuplicatable);
  };

  S.fns.settingsHandler = function () {
    settingsHandler();
  };

  S.fns.weightedRandom = function (weightedArray) {
    return weightedRandom(weightedArray);
  };

  S.fns.assignFieldOfObjectsToArray = function (objarr, field) {
    return assignFieldOfObjectsToArray(objarr, field);
  };

  S.fns.someValuesTrue = function (arr, cond) {
    return someValuesTrue(arr, cond);
  };

  S.fns.allValuesTrue = function (arr, cond) {
    return allValuesTrue(arr, cond);
  };

  // S.fns.cloneDeep = function (obj) {
  //   return cloneDeep(obj);
  // };

  // ANCHOR[id=IMPORTS]
  // LINK: assets/js/_imports.js
  S.fns.importGameSSR = function () {
    importGameSSR();
  };

  S.fns.importDiscordWidget = function () {
    importDiscordWidget();
  };

  if (!S.COM) {
    S.COM = {};
  }

  // ANCHOR[id=COMBAT]
  // LINK: assets/js/arena/_combat.js
  S.COM.monsters = monsters;

  if (!S.STR) {
    S.STR = {};
  }

  // ANCHOR[id=TITLES]
  // LINK: src/__TITLES.js
  S.STR.TITLES = TITLES;
  S.STR.version = version;
  S.STR.bottomUIStr = bottomUIStr;

  // ANCHOR[id=CONST]
  if (!S.CONST) {
    S.CONST = {};
  }
})(setup);
