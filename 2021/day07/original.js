const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);
// const input = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14];
input.sort((a, b) => a - b);

function fuelCostTo(dest, expensive) {
  return input.reduce((acc, curr) => {
    const dist = Math.abs(curr - dest);
    const cost = expensive ? (dist * (dist + 1)) / 2 : dist;
    return acc + cost;
  }, 0);
}

const mode = input[input.length / 2];
const partOne = fuelCostTo(mode);
console.log("part one", partOne, partOne === 352997);

const avg = lodash.sum(input) / input.length;
const partTwo = Math.min(
  fuelCostTo(Math.floor(avg), true),
  fuelCostTo(Math.ceil(avg), true),
);
console.log("part two", partTwo, partTwo === 101571302);
