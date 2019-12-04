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
const total = fuels.reduce((a, b) => a + b, 0);

console.log("part one:", total); // 3161483
// console.log(lodash.sum(fuels))

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

const mt = mf2.reduce((a, b) => a + b);
console.log("part one:", mt); // 4739256
