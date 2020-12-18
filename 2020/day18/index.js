const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// 9 * 7 + ((6 + 9 * 2 + 6 + 7 + 5) * (5 + 9 + 7) * 6) * (4 + 8) + 5 * 8
const input = readFile(__dirname, "./input.txt");
let sumsHavePrecedence = false;

function reduceSegment(arr) {
  const sums = [parseInt(arr[0])];
  for (let i = 1; i < arr.length; i += 2) {
    const sign = arr[i];
    const val = parseInt(arr[i + 1]);

    if (sign === "+") {
      sums[0] += val;
    } else if (sumsHavePrecedence) {
      sums.unshift(val);
    } else {
      sums[0] *= val;
    }
  }

  return sums.reduce((a, b) => a * b);
}

function reduceLine(line) {
  const arr = line.replace(/\s+/g, "").split("");
  while (arr.includes("(")) {
    const cIdx = arr.indexOf(")");
    const oIdx = arr.lastIndexOf("(", cIdx);
    const segment = arr.slice(oIdx + 1, cIdx);
    arr.splice(oIdx, segment.length + 2, reduceSegment(segment));
  }

  return reduceSegment(arr);
}

function run() {
  return lodash.sum(input.map(reduceLine));
}

const partOne = run();
console.log("part one", partOne); // 510009915468

sumsHavePrecedence = true;
const partTwo = run();
console.log("part two", partTwo); // 321176691637769
