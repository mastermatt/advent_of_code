const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords, neighbors } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map(Number)
);

let stepCounter = 0;

function genCoords() {
  return generateCoords(input[0].length, input.length);
}

function step() {
  stepCounter++;
  let flashed = 0;

  for (const [x, y] of genCoords()) input[y][x]++;

  let prevFlashed = -1;
  while (flashed !== prevFlashed) {
    prevFlashed = flashed;
    for (const [x, y] of genCoords()) {
      if (input[y][x] <= 9) continue;

      input[y][x] = 0;
      flashed++;

      for (const [energy, xn, yn] of neighbors(x, y, input)) {
        if (energy !== 0) input[yn][xn]++;
      }
    }
  }

  return flashed;
}

const flashesPerStep = lodash.times(100, step);
const partOne = lodash.sum(flashesPerStep);
console.log("part one", partOne, partOne === 1661);

while (step() !== 100) {}
const partTwo = stepCounter;
console.log("part two", partTwo, partTwo === 334);
