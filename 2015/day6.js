const fs = require("fs");
const path = require("path");
const lodash = require("lodash");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input/day6.txt"))
  .toString()
  .trim()
  .split("\n");

// turn on 212,957 through 490,987
// toggle 171,31 through 688,88
// turn off 991,989 through 994,998
const instrReg = /(?<cmd>turn on|turn off|toggle) (?<x1>\d+),(?<y1>\d+) through (?<x2>\d+),(?<y2>\d+)/;
const parseInstruction = instruction => {
  const groups = instruction.match(instrReg).groups;
  // cast the coords to ints
  groups.x1 |= 0;
  groups.x2 |= 0;
  groups.y1 |= 0;
  groups.y2 |= 0;
  return groups;
};

const buf = new Uint8Array(1000 * 1000);

input.forEach(instruction => {
  const { cmd, x1, x2, y1, y2 } = parseInstruction(instruction);

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      const i = x * 1000 + y;
      switch (cmd) {
        case "turn on":
          buf[i] = 1;
          break;
        case "turn off":
          buf[i] = 0;
          break;
        case "toggle":
          buf[i] ^= 1;
          break;
      }
    }
  }
});

const partOne = buf.filter(i => i === 1).length;
console.log("part one", partOne); // 569999

const buf2 = new Uint8ClampedArray(1000 * 1000);

input.forEach(instruction => {
  const { cmd, x1, x2, y1, y2 } = parseInstruction(instruction);

  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      const i = x * 1000 + y;
      switch (cmd) {
        case "turn on":
          buf2[i]++;
          break;
        case "turn off":
          buf2[i]--;
          break;
        case "toggle":
          buf2[i] += 2;
          break;
      }
    }
  }
});

const partTwo = lodash.sum(buf2);
console.log("part two", partTwo); // 17836115
