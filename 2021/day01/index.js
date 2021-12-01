const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map(Number);

let last = Infinity;
let incCnt = 0;

for (const curr of input) {
  if (curr > last) {
    incCnt++;
  }
  last = curr;
}

const partOne = incCnt;
console.log("part one", partOne); // 1722

const windowSums = [];
for (let i = 0; i < input.length - 2; i++) {
  windowSums[i] = input[i] + input[i + 1] + input[i + 2];
}

last = Infinity;
incCnt = 0;

for (const curr of windowSums) {
  if (curr > last) {
    incCnt++;
  }
  last = curr;
}

const partTwo = incCnt;
console.log("part two", partTwo); // 1748
