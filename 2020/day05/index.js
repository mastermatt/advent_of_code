const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const reduce = (str, max) => {
  let min = 0;
  for (const char of str) {
    const mid = (min + (max - min) / 2) | 0;
    [min, max] = "FL".includes(char) ? [min, mid] : [mid + 1, max];
  }
  return min;
};

const seatIds = input.map(line => {
  const row = reduce(line.slice(0, 7), 127);
  const col = reduce(line.slice(7), 7);
  return row * 8 + col;
});

const partOne = lodash.max(seatIds);
console.log("part one", partOne); // 813

const sorted = lodash.sortBy(seatIds);
const firstId = sorted[0];

const partTwo = sorted.find(id => id !== sorted[id - firstId]) - 1;
console.log("part two", partTwo); // 612
