const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

let input = fs
  .readFileSync(path.resolve(__dirname, "./input/day1.txt"))
  .toString()
  .split("\n")
  .map(Number);

const calc = i => ((i / 3) | 0) - 2;
const fuels = input.map(calc);
const total = lodash.sum(fuels);

console.log("part one:", total); // 3161483

const mf = input.map(i => {
  let t = 0;
  while (true) {
    i = calc(i);
    if (i <= 0) {
      return t;
    }
    t += i;
  }
});

console.log("part two:", lodash.sum(mf)); // 4739374
