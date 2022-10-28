/** The Combatant is the actionable, fully derived, object on the combat field. */
setup.COM.Combatant = class Combatant {
  constructor(obj) {
    Object.assign(this, obj);
    this.health = this.healthMax;
    // this.init = this.initStart;

    let max = (this.initStart * (1 + this.initVariance));
    let min = (this.initStart * (1 - this.initVariance));
    this.init = Math.floor(Math.random() * (max - min + 1)) + Math.floor(min);
    // derive the rest of `this` here, things like `this.health` and so forth
  }

  // TODO: These methods should be prototype'd.

  die() {
    // unset/delete this instance.
  }

  // Required for full SC2 compatibility.
  clone() {
    return new this.constructor(this);
  }

  // Required for full SC2 compatibility.
  toJSON() {
    const ownData = {};
    Object.keys(this).forEach(function (pn) {
      ownData[pn] = clone(this[pn]);
    }, this);
    return JSON.reviveWrapper(`new ${this.constructor.name}($ReviveData$)`, ownData);
  }
};
