const Iter = require("es-iter");
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map(line => parseInt(line));
const target = 150;
// const input = [20, 15, 10, 5, 5];
// const target = 25;

let possibleCnt = 0;
let minContainers = Infinity;
let possibleMinCnt = 0;

for (let i = 2; i <= input.length; i++) {
  const iter = new Iter(input)
    .combinations(i)
    .filter(arr => lodash.sum(arr) === target);

  for (const arr of iter) {
    ++possibleCnt;

    if (arr.length < minContainers) {
      possibleMinCnt = 1;
      minContainers = arr.length;
    } else if (arr.length === minContainers) {
      ++possibleMinCnt;
    }
  }
}

const partOne = possibleCnt;
console.log("part one", partOne); // 654

const partTwo = possibleMinCnt;
console.log("part two", partTwo); // 57
