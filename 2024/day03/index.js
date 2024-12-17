const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").join(":");

const mulReg = /mul\((\d{1,3}),(\d{1,3})\)/g;

let partOne = 0;

for (const match of input.matchAll(mulReg)) {
  partOne += parseInt(match[1]) * parseInt(match[2]);
}

console.log("part one", partOne, partOne === 173731097);

let partTwo = 0;

const modified = input
  .split("do()")
  .map((chunk) => chunk.split("don't()")[0])
  .join(":");

for (const match of modified.matchAll(mulReg)) {
  partTwo += parseInt(match[1]) * parseInt(match[2]);
}

console.log("part two", partTwo, partTwo === 9372925);
