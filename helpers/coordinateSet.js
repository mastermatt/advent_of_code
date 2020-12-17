module.exports = class CoordinateSet extends Set {
  constructor(entries) {
    super();
    (entries || []).forEach((entry) => this.add(...entry));
  }

  add(...coordinates) {
    return super.add(this.key(coordinates));
  }

  has(...coordinates) {
    return super.has(this.key(coordinates));
  }

  delete(...coordinates) {
    return super.delete(this.key(coordinates));
  }

  forEach(callback, thisArg) {
    super.forEach((value) => {
      const coordinates = this.dekey(value);
      callback.call(thisArg, coordinates, coordinates, this);
    });
  }

  *entries() {
    for (const value of super.values()) {
      const coordinates = this.dekey(value);
      yield [coordinates, coordinates];
    }
  }

  *values() {
    for (const value of super.values()) {
      yield this.dekey(value);
    }
  }

  keys() {
    return this.values();
  }

  [Symbol.iterator]() {
    return this.values();
  }

  key(coordinates) {
    return coordinates.join(",");
  }

  dekey(value) {
    return value.split(",").map(Number);
  }
};
