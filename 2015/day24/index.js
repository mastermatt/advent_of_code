const Iter = require("es-iter");
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => parseInt(line));

function run(numGroups) {
  const targetWeight = lodash.sum(input) / numGroups;
  let minQE = Infinity;
  let smallSize = 4;

  while (minQE === Infinity) {
    const iter = new Iter(input)
      .combinations(smallSize)
      .filter((vals) => lodash.sum(vals) === targetWeight);

    for (const vals of iter) {
      minQE = Math.min(minQE, vals.reduce((a, b) => a * b));
    }

    ++smallSize;
  }
  return minQE;
}

const partOne = run(3);
console.log("part one", partOne); // 10723906903

const partTwo = run(4);
console.log("part two", partTwo); // 74850409
