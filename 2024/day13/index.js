const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

const extractNumbers = (str) =>
  str.split(", ").map((chars) => Number(chars.replace(/\D+/, "")));

const machines = input.map((lines) => lines.map(extractNumbers));

// What I originally wrote for Part One.
const minTokens = (machine) => {
  const [[ax, ay], [bx, by], [px, py]] = machine;
  let a = 0;
  let b = (Math.min(100, px / bx, py / by) | 0) + 1;

  while (true) {
    const cx = a * ax + b * bx;
    const cy = a * ay + b * by;
    if (cx === px && cy === py) return a * 3 + b;
    if (a > 100) return null;
    if (cx > px || cy > py) --b;
    else ++a;
  }
};

const minTokensWithMath = (machine) => {
  const [[ax, ay], [bx, by], [px, py]] = machine;

  // Some linear algebra that I ended up looking up online. It solves:
  // ax * a + bx * b = prizeX
  // ay * a + by * b = prizeY

  const a = (px * by - py * bx) / (ax * by - ay * bx);
  const b = (py - ay * a) / by;

  if (Number.isInteger(a) && Number.isInteger(b)) return a * 3 + b;
  return 0;
};

const partOne = lodash.sum(machines.map(minTokensWithMath));
console.log("part one", partOne, partOne === 25629);

const PART_2_INCREASE = 10_000_000_000_000;
for (const machine of machines) {
  machine[2][0] += PART_2_INCREASE;
  machine[2][1] += PART_2_INCREASE;
}

const partTwo = lodash.sum(machines.map(minTokensWithMath));
console.log("part two", partTwo, partTwo === 107_487_112_929_999);
