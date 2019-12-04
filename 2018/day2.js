const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input/day2.txt"))
  .toString()
  .split("\n");

let hasTwo  = 0;
let hasThree = 0;

input.forEach(line => {
    const map = [...line].reduce((a, e) => { a[e] = a[e] ? a[e] + 1 : 1; return a }, {})
    const inv = lodash.invert(map)
    if(inv['2']) {
        hasTwo++
    }
    if(inv['3']) {
        hasThree++
    }
    // console.log(line, map, inv, hasTwo, hasThree)
});

console.log(hasTwo * hasThree); // 8398




