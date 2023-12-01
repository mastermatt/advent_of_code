const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
let partOne = 0;

for (const line of input) {
  const numChars = line.replaceAll(/\D/g, "").split("");
  const calibrationValue = Number(numChars[0] + numChars[numChars.length - 1]);
  partOne += calibrationValue;
}

console.log("part one", partOne, partOne === 53194);

const numMap = [
  ["one", "1"],
  ["two", "2"],
  ["three", "3"],
  ["four", "4"],
  ["five", "5"],
  ["six", "6"],
  ["seven", "7"],
  ["eight", "8"],
  ["nine", "9"],
];

let partTwo = 0;

for (let line of input) {
  const nums = [];

  for (let i = 0; i < line.length; ++i) {
    for (const [word, num] of numMap) {
      if (line.startsWith(num, i) || line.startsWith(word, i)) {
        nums.push(num);
      }
    }
  }

  const calibrationValue = Number(nums[0] + nums[nums.length - 1]);
  partTwo += calibrationValue;
}

console.log("part two", partTwo, partTwo === 54249);
