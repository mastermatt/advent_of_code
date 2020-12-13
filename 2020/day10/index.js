const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => parseInt(line));
// const input = readFile(__dirname, "./sample.txt").map(line => parseInt(line));
const sorted = lodash.sortBy(input);
// console.log(sorted);

let curr = 0;
const one = [0, 0, 0, 1];
sorted.forEach((val) => {
  ++one[val - curr];
  curr = val;
});

// What is the number of 1-jolt differences multiplied by the number of 3-jolt differences?
// console.log(one)
const partOne = one[1] * one[3];
console.log("part one", partOne); // 1980

const two = [[0, 1]];
for (const curr of sorted) {
  const prevSums = two
    .slice(-3)
    .filter(([prev]) => prev >= curr - 3)
    .map((x) => x[1]);

  two.push([curr, lodash.sum(prevSums)]);
}

// console.log(two)
const partTwo = two[two.length - 1][1];
console.log("part two", partTwo); // 4628074479616
