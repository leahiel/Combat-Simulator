// LINK: assets/js/_setup.js#utilities

/* Set a tooltip for a singular word. This also makes it a template. */
/* BUG: After a linkreplace, this function doesn't work properly. Likely an issue with tt-macro. */
function addTooltip(macroname, passage, metaname = false) {
  let psg = Story.get(passage);

  Template.add(macroname, function () {
    let name = metaname ? metaname : this.name;

    // Only show tooltips if they're enabled in settings.
    // AND
    // TODO: Only show tooltips if there is text in the passage.
    if (settings.tooltips) {
      return "<<tt " + psg.title + ">>" + name + "<</tt>>";
    } else {
      return name;
    }
  });
}

/* Reset if these already exist. If one exists, then the others must exist. */
function settingsHandler() {
  if (Template.has("he")) {
    Template.delete("he");
    Template.delete("He");
    Template.delete("him");
    Template.delete("himself");
    Template.delete("his");
    Template.delete("Mr");
    Template.delete("Mister");
    Template.delete("men");
    Template.delete("wizard");
    Template.delete("wizards");
    Template.delete("boy");
    Template.delete("man");
    Template.delete("sir");
  }

  switch (settings.pronouns) {
    case "male":
      Template.add("he", "he");
      Template.add("He", "He");
      Template.add("him", "him");
      Template.add("himself", "himself");
      Template.add("his", "his");
      Template.add("Mr", "Mr.");
      Template.add("Mister", "Mister");
      Template.add("men", "men");
      Template.add("wizard", "wizard");
      Template.add("wizards", "wizards");
      Template.add("boy", "boy");
      Template.add("man", "man");
      Template.add("sir", "sir");
      break;
    case "female":
      Template.add("he", "she");
      Template.add("He", "She");
      Template.add("him", "her");
      Template.add("himself", "herself");
      Template.add("his", "her");
      Template.add("Mr", "Miss");
      Template.add("Mister", "Miss");
      Template.add("men", "women");
      Template.add("wizard", "witch");
      Template.add("wizards", "witches");
      Template.add("boy", "girl");
      Template.add("man", "woman");
      Template.add("sir", "ma'am");
      break;
    default:
      /* Assume "misc": */
      Template.add("he", "they");
      Template.add("He", "They");
      Template.add("him", "them");
      Template.add("himself", "theirself");
      Template.add("his", "their");
      Template.add("Mr", "M.");
      Template.add("Mister", "Gentleperson");
      Template.add("men", "people");
      Template.add("wizard", "wizard");
      Template.add("wizards", "wizards");
      Template.add("man", "guy");
      Template.add("sir", "sir");
  }
}

/**
 * Returns an array either with no duplicate items (default), or with duplicate items.
 *
 * @example
 * arr = ["A", "B", "C"]
 * ranItems(1, arr)  // => ["B"]
 * ranItems(2, arr)  // => ["A", "C"]
 * ranItems(5, arr, true)  // => ["A", "C", "A", "A", "B"]
 * ranItems(5, arr)  // => ["A", "C", "B"] with console warning.
 */
function ranItems(amount, arr, isDuplicatable = false) {
  let solarr = [];

  if (amount === 1) {
    return [arr[Math.floor(Math.random() * arr.length)]];
  }

  if (isDuplicatable) {
    for (amount; amount > 0; amount--) {
      solarr.push(arr[Math.floor(Math.random() * arr.length)]);
    }
    return solarr;
  }

  if (amount > arr.length) {
    console.warn(
      `ranItems: You tried to randomized without creating duplicates ${amount} items, but there are only ${arr.length} items in the array. We set the amount to the length of the array so the program can continue running.`
    );
    amount = arr.length;
  }

  // DESIRED: Optimize this.
  // To start with, if amount === arr.length, we can just return a shufflized array.
  for (amount; amount > 0; amount--) {
    let randItem = arr[Math.floor(Math.random() * arr.length)];
    while (solarr.includes(randItem)) {
      randItem = arr[Math.floor(Math.random() * arr.length)];
    }
    solarr.push(randItem);
  }

  return solarr;
}

/**
 * Takes an array of duples, and returns one value of the array.
 *
 * @param {Array} weightedArray An array of Duples, with the first index being the value,
 * and the second index being the relative weight of the value.
 *
 *
 * @example
 * let arr = [["A", 1], ["B", 2],["C", 3]];
 * let res = weightRandom(arr);
 * res // => "A"
 *
 * @copyright
 * Function provided by AlyxMS under GNU Affero General Public License v3.0:
 *
 * https://github.com/AlyxMS/Twine-SugarCube-repository/blob/main/LICENSE
 */
function weightedRandom(weightedArray) {
  let randomNumber = weightedArray.reduce((a, b) => a + b[1], 0) * Math.random();
  for (let element of weightedArray) {
    if ((randomNumber -= element[1]) < 0) return element[0];
  }
}

/** https://stackoverflow.com/a/37164538 */
function mergeDeep(target, source) {
  function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}
