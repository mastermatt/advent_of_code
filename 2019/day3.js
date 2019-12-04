const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const computer = require('./computer');

const [aWireDirs, bWireDirs] = fs
  .readFileSync(path.resolve(__dirname, "./input/day3.txt"))
  .toString()
  .split("\n")
  .map(Number);

const x = "";
console.log("part one:", x); // ..

const y = "";
console.log("part two:", y); // ..
