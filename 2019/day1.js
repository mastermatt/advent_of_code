const fs = require("fs");
const lodash = require("lodash");

let input = fs
  .readFileSync("day1_input.txt")
  .toString()
  .split("\n")
  .map(i => parseInt(i));

const calc = i => ((i / 3) | 0) - 2;
const fuels = input.map(calc);
const total = fuels.reduce((a, b) => a + b, 0);
console.log(total); // 3161483

const mf = input.map(i => {
  let t = 0;
  let c = i;
  while (true) {
    const a = calc(c);
    if (a <= 0) {
      return t;
    }
    t += a;
    c = a;
  }
});

const mt = mf.reduce((a, b) => a + b, 0);
console.log(mt); // 4739256
