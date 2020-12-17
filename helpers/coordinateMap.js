module.exports = class CoordinateMap extends Map {
  constructor(entries = []) {
    super();
    entries.forEach((entry) => this.set(...entry));
  }
  set(...args) {
    const value = args.pop();
    return super.set(this.key(args), value);
  }
  has(...coordinates) {
    return super.has(this.key(coordinates));
  }
  get(...coordinates) {
    return super.get(this.key(coordinates));
  }
  delete(...coordinates) {
    return super.delete(this.key(coordinates));
  }

  *entries() {
    for (const [coords, val] of super.entries()) {
      yield [this.dekey(coords), val];
    }
  }

  *keys() {
    for (const coords of super.keys()) {
      yield this.dekey(coords);
    }
  }

  key(coordinates) {
    return coordinates.join(",");
  }
  dekey(coordinates) {
    return coordinates.split(",").map(Number);
  }
};
