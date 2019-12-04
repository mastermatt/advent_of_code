const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input/day1.txt"))
  .toString()
  .trim()
  .split("");

const dirs = { "(": 1, ")": -1 };
const partOne = input.reduce((acc, char) => (acc += dirs[char]), 0);

console.log("part one", partOne); // 74

let floor = 0;
for (let i = 0; i < input.length; i++) {
  floor += dirs[input[i]];
  if (floor < 0) {
    console.log("part two", i + 1); // 1795
    break;
  }
}
