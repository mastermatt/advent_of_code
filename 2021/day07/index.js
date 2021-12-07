const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);
input.sort((a, b) => a - b);

function fuelCostTo(dest, expensive) {
  let res = 0;

  for (const crab of input) {
    const dist = Math.abs(crab - dest);
    const cost = expensive ? (dist * (dist + 1)) / 2 : dist;
    res += cost;
  }

  return res;
}

const mode = input[input.length / 2];
const partOne = fuelCostTo(mode);
console.log("part one", partOne, partOne === 352997);

const avg = lodash.sum(input) / input.length;
const partTwo = Math.min(
  fuelCostTo(Math.floor(avg), true),
  fuelCostTo(Math.ceil(avg), true)
);
console.log("part two", partTwo, partTwo === 101571302);
