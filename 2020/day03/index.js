const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const slopes = [
  [1, 1, 0], // Right 1, down 1.
  [3, 1, 0], // Right 3, down 1. (part one)
  [5, 1, 0], // Right 5, down 1.
  [7, 1, 0], // Right 7, down 1.
  [0.5, 2, 0], // Right 1, down 2.
];

input.forEach((line, lineIdx) => {
  slopes
    .filter((slope) => lineIdx % slope[1] === 0) // filter lines, to cover that down 2 case
    .filter((slope) => line[(lineIdx * slope[0]) % line.length] === "#")
    .forEach((slope) => ++slope[2]);
});

const partOne = slopes[1][2];
console.log("part one", partOne); // 232

const partTwo = slopes.reduce((acc, curr) => acc * curr[2], 1);
console.log("part two", partTwo); // 3952291680
