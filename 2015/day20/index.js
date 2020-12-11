const lodash = require("lodash");
const { factors } = require("../../helpers/math");

const input = 36_000_000;

let i = 500000; // arbitrarily large to save time
while (++i) {
  const f = factors(i);
  const s = lodash.sum(f) * 10;
  if (s >= input) {
    break;
  }
}

const partOne = i;
console.log("part one", partOne); // 831600

i = 500000;
while (++i) {
  const f = factors(i).filter(n => i / n <= 50);
  const s = lodash.sum(f) * 11;
  if (s >= input) {
    break;
  }
}

const partTwo = i;
console.log("part two", partTwo); // 884520
