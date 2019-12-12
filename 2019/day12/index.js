const lodash = require("lodash");
const Iter = require("es-iter");
const inspect = Symbol.for("nodejs.util.inspect.custom");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const dimensions = ["x", "y", "z"];

class Moon {
  constructor(input) {
    // <x=-1, y=0, z=2>
    const match = input.match(/-?\d+/g).map(Number);
    this.initalPos = { x: match[0], y: match[1], z: match[2] };
    this.reset();
  }

  reset() {
    this.pos = { ...this.initalPos };
    this.vel = { x: 0, y: 0, z: 0 };
  }

  step() {
    dimensions.forEach(d => (this.pos[d] += this.vel[d]));
  }

  isDimensionInitial(d) {
    return this.vel[d] === 0 && this.pos[d] === this.initalPos[d];
  }

  get potentialEnergy() {
    return lodash.sum(dimensions.map(d => Math.abs(this.pos[d])));
  }

  get kineticEnergy() {
    return lodash.sum(dimensions.map(d => Math.abs(this.vel[d])));
  }

  get totalEnergy() {
    return this.potentialEnergy * this.kineticEnergy;
  }

  [inspect]() {
    return `pos=<x=${this.pos.x}, y=${this.pos.y}, z=${this.pos.z}>, vel=<x=${this.vel.x}, y=${this.vel.y}, z=${this.vel.z}>`;
  }
}

const moons = input.map(line => new Moon(line));
const combinations = new Iter(moons).combinations(2).toArray();

const stepTime = () => {
  combinations.forEach(([a, b]) => {
    dimensions
      .filter(d => a.pos[d] !== b.pos[d])
      .forEach(d => {
        const [ad, bd] = a.pos[d] > b.pos[d] ? [-1, 1] : [1, -1];
        a.vel[d] += ad;
        b.vel[d] += bd;
      });
  });

  moons.forEach(moon => moon.step());
};

lodash.range(1000).forEach(stepTime);
console.log(moons);

const partOne = lodash.sumBy(moons, "totalEnergy");
console.log("part one", partOne); // 13399

moons.forEach(moon => moon.reset());
const loopIndexes = [];

for (let i = 1; i < 1000000; i++) {
  stepTime();

  dimensions.forEach((d, idx) => {
    if (!loopIndexes[idx] && moons.every(moon => moon.isDimensionInitial(d))) {
      loopIndexes[idx] = i;
    }
  });

  if (Object.keys(loopIndexes).length === 3) {
    break;
  }
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (a, b) => a * (b / gcd(a, b));

// console.log(loopIndexes);
const partTwo = loopIndexes.reduce(lcm);
console.log("step two", partTwo); // 312992287193064
