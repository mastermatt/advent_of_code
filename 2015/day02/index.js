const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((dimensions) =>
  dimensions
    .split("x")
    .map(Number)
    .sort((a, b) => a - b)
);

const partOne = input.reduce((acc, d) => {
  const areas = [d[0] * d[1], d[0] * d[2], d[1] * d[2]];
  const slack = Math.min(...areas);
  acc += lodash.sum(areas) * 2 + slack;
  return acc;
}, 0);

console.log("part one", partOne); // 1586300

const partTwo = input.reduce((acc, d) => {
  const perimeter = (d[0] + d[1]) * 2;
  const volume = d[0] * d[1] * d[2];
  acc += perimeter + volume;
  return acc;
}, 0);

console.log("part two", partTwo); // 3737498
