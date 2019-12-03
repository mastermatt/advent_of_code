const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const computer = require('./computer');

let input = fs
  .readFileSync(path.resolve(__dirname, "./day3_input.txt"))
  .toString()
  .split("\n")
  .map(Number);

const x = "";
console.log("part one:", x); // ..

const y = "";
console.log("part two:", y); // ..
