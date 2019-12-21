module.exports = class CoordinateSet extends Set {
  add(...coordinates) {
    return super.add(this.key(coordinates));
  }

  has(...coordinates) {
    return super.has(this.key(coordinates));
  }

  delete(...coordinates) {
    return super.delete(this.key(coordinates));
  }

  forEach(callbackfn, thisArg) {
    super.forEach(value => {
      const coordinates = this.dekey(value);
      callbackfn.call(thisArg, coordinates, coordinates, this);
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
      yield this.dekey(value).map(Number);
    }
  }
  keys = this.values;
  [Symbol.iterator] = this.values;

  key(coordinates) {
    return coordinates.join(",");
  }

  dekey(value) {
    return value.split(",");
  }
};
