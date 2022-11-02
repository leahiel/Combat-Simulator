/**
 * There are currently no Buff methods, it is just used as a constructor to easily make new attacks.
 */
class Buff {
    constructor(obj) {
        // Merge our obj onto default, then merge those onto this.
        jQuery.extend(true, this, DEFAULTBUFF, obj);

        if (this.custom === undefined) {
            console.error(`Buff: ${this.name} lacks custom functionality.`);
        }

        if (this.description === undefined) {
            console.error(`Buff: ${this.name} lacks a description.`);
            this.description = "Description missing.";
        }
    }
}

const buffs = {
    buffTESTING: new Buff({
        type: "debuff", // "buff", "debuff"
        duration: 1000,
        name: "Buff Name",
        description: "Buff Description",
        onApply: function (target) {
            console.log(`${this.name} applied!`);
            return;
        },
        onReapply: function (target) {
            console.log(`${this.name} reapplied!`);
            return;
        },
        perInit: function (target) {
            // console.log(`${this.name} perInit'd!`);
            return;
        },
    }),
};

// Add buffs to setup.
(function (S) {
    if (!S.COM) {
        S.COM = {};
    }

    S.COM.buffs = buffs;
})(setup);
