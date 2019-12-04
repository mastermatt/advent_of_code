const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const computer = require('./computer');

let input = fs
  .readFileSync(path.resolve(__dirname, "./input/day2.txt"))
  .toString()
  .split(",")
  .map(Number);


// replace position 1 with the value 12 and replace position 2 with the value 2.
const dup = [...input];
dup[1] = 12;
dup[2] = 2;
computer.execute(dup);
const x = dup[0];
console.log("part one:", x); // 4714701


const bruteForceInput = (memory, desiredOutput) => {
  for (let a = 0; a < 100; a++) {
    for (let b = 0; b < 100; b++) {
      const dup = [...memory];
      dup[1] = a;
      dup[2] = b;
      computer.execute(dup);
      // console.log(a, b, dup[0])
      if (dup[0] === desiredOutput) {
        return [a, b]
      }
    }
  }
};

const [noun, verb] = bruteForceInput(input, 19690720);
const y = 100 * noun + verb;
console.log("part two:", y); // 5121
