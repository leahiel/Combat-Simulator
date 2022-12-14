/* Set a tooltip for a singular word. This also makes it a template. */
/* BUG: After a linkreplace, this function doesn't work properly.
 * Likely an issue with tt-macro. */
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

/**
 * Handle the SugarCube Templates for pronouns.
 */
function settingsHandler() {
    // Because these are all set as a unit, if one exists, then the
    // others must exist.
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
            /* Assume "misc". */
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
 * Returns an array containing just the values of the specified of
 * multiple objects.
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
 * Check each item in array for a condition. Return true if just one
 * item returns true. Else, return false.
 *
 * @example
 * let arr = [1, 3, 4]
 * someValuesTrue(arr, function(v) {
 *  return v <= 3;
 * });
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
 * Check each item in array for a condition. Return true if all items
 * return true. Else, return false.
 *
 * @example
 * let arr = [1, 3, 4]
 * allValuesTrue(arr, function(v) {
 *  return v <= 5;
 * });
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
 * Returns an array either with no duplicate items (default), or with
 * duplicate items.
 *
 * @example
 * let arr = ["A", "B", "C"]
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
 * Take an array of duples, and return one value of the array.
 *
 * @param {Array} weightedArray An array of Duples, with the first index being the value,
 * and the second index being the relative weight of the value.
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

/**
 * Non-destructively deep clones an object.
 *
 * https://api.jquery.com/jquery.extend/
 */
function cloneDeep(obj, ...args) {
    if (Array.isArray(obj)) {
        return jQuery.extend(true, [], obj, args);
    }
    return jQuery.extend(true, {}, obj, args);
}

/**
 * Non-destructively merges arrays.
 *
 * https://www.geeksforgeeks.org/javascript-array-concat-method/
 */
function mergeArray() {
    let solarr = [];
    for (let i = 0; i < arguments.length; i++) {
        solarr = solarr.concat(arguments[i]);
    }

    return solarr;
}

/**
 * Waits for an element to exist before doing thing.
 *
 * ```
 * const elm = await waitForElm('.some-class');
 * // or
 * waitForElm('.some-class').then((elm) => {
 *  console.log('Element is ready');
 *  console.log(elm.textContent);
 * });
 * ```
 * See https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 */
function waitForElm(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

/**
 * Waits for an element to exist before doing thing.
 *
 * Modified from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
 */
function waitForNumberOfElm(selector, number) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            if ($(selector).length >= number) {
                return resolve(document.querySelector(selector));
            }
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                if ($(selector).length >= number) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

/**
 * Sets nested object property by defining the path with a string.
 *
 * https://www.webtips.dev/webtips/javascript/update-nested-property-by-string
 */
function setProperty(obj, path, value) {
    const [head, ...rest] = path.split(".");

    return {
        ...obj,
        [head]: rest.length ? setProperty(obj[head], rest.join("."), value) : value,
    };
}

/**
 * Updates nested object property by defining the path with a string.
 *
 * Modified from:
 * https://www.webtips.dev/webtips/javascript/update-nested-property-by-string
 */
function updateProperty(obj, path, value, updateWith) {
    const [head, ...rest] = path.split(".");

    let result;
    if (rest.length) {
        result = updateProperty(obj[head], rest.join("."), value, updateWith);
    } else {
        if (updateWith === "+") {
            result = obj[head] + value;
        } else if (updateWith === "*") {
            result = obj[head] * (1 + value);
        } else {
            result = value;
        }
    }

    return { ...obj, [head]: result };
}

/** Wait for arbitrary amount of time in miliseconds. */
function waitFor(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, ms);
    });
}

/** 
 * Returns the first 12 digits of the Decimal value of a UUID.
 * 
 * ```
 * uuidToNum("3b8cf62d-ec2a-4b86-87b7-625aa87fb2c9") // => 791563664226
 * ```
 */
function uuidToNum(uuid) {
    // So that we don't alter the original string using <String>.replace().
    let tempUUID = uuid;

    return Number(String(BigInt("0x" + tempUUID.replace(/-/g, ""))).slice(0, 12));
}

/** 
 * Shifts the first digit of the number to the last, then subtracts it by 1.
 *
 * ```
 * shiftNumber(17541) // => 75410
 * ```
 */
function shiftNumber(number) {
    return parseInt(`${String(number).substring(1)}${number.toString()[0]}`) -1;
}

// Add the required utility functions to setup.
(function (S) {
    if (!S.fns) {
        S.fns = {};
    }

    S.fns.addTooltip = function (macroname, passage, metaname = false) {
        addTooltip(macroname, passage, metaname);
    };

    S.fns.ranItems = function (amount, arr, isDuplicatable = false) {
        return ranItems(amount, arr, isDuplicatable);
    };

    S.fns.settingsHandler = function () {
        settingsHandler();
    };

    // S.fns.weightedRandom = function (weightedArray) {
    //     return weightedRandom(weightedArray);
    // };

    S.fns.assignFieldOfObjectsToArray = function (objarr, field) {
        return assignFieldOfObjectsToArray(objarr, field);
    };

    // S.fns.someValuesTrue = function (arr, cond) {
    //     return someValuesTrue(arr, cond);
    // };

    S.fns.allValuesTrue = function (arr, cond) {
        return allValuesTrue(arr, cond);
    };

    S.fns.cloneDeep = function (obj, ...args) {
        return cloneDeep(obj, ...args);
    };

    S.fns.waitForElm = function (selector) {
        return waitForElm(selector);
    };

    S.fns.waitForNumberOfElm = function (selector, number) {
        return waitForNumberOfElm(selector, number);
    };

    // S.fns.setProperty = function(obj, path, value) {
    //     return setProperty(obj, path, value);
    // };

    // S.fns.updateProperty = function(obj, path, value, updateWith) {
    //     return updateProperty(obj, path, value, updateWith);
    // };

    S.fns.waitFor = function (ms) {
        return waitFor(ms);
    };

    // S.fns.uuidToNum = function (uuid) {
    //     return uuidToNum(uuid);
    // };

    // S.fns.shiftNumber = function (number) {
    //     return shiftNumber(number);
    // };
})(setup);
