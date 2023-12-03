const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { neighbors } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const nums = "0123456789";
let foundAdjacent = false;
let currNums = [];
const adjacents = [];

for (let y = 0; y < input.length; y++) {
  function reset() {
    if (currNums.length) {
      const num = Number(currNums.join(""));
      if (foundAdjacent) adjacents.push(num);
    }

    currNums = [];
    foundAdjacent = false;
  }

  for (let x = 0; x < input[0].length; x++) {
    const isNum = nums.includes(input[y][x]);

    if (isNum) {
      currNums.push(input[y][x]);

      for (const [val] of neighbors(x, y, input)) {
        if (val !== "." && !nums.includes(val)) {
          foundAdjacent = true;
          break;
        }
      }
    } else {
      reset();
    }
  }

  reset();
}

const partOne = lodash.sum(adjacents);
console.log("part one", partOne, partOne === 532445);

function extractNum(x, y) {
  if (!nums.includes(input[y][x])) return null;

  let dx = x;
  let numStr = "";
  while (nums.includes(input[y][--dx])) {}

  while (nums.includes(input[y][++dx])) {
    numStr += input[y][dx];
  }

  return Number(numStr);
}

const gearRatios = [];

for (let y = 0; y < input.length; y++) {
  for (let x = 0; x < input[0].length; x++) {
    if (input[y][x] !== "*") continue;

    let adjNums = [];

    let a = extractNum(x - 1, y);
    if (a) adjNums.push(a);

    a = extractNum(x + 1, y);
    if (a) adjNums.push(a);

    a = extractNum(x, y - 1);
    if (a) adjNums.push(a);
    else {
      a = extractNum(x - 1, y - 1);
      if (a) adjNums.push(a);
      a = extractNum(x + 1, y - 1);
      if (a) adjNums.push(a);
    }

    a = extractNum(x, y + 1);
    if (a) adjNums.push(a);
    else {
      a = extractNum(x - 1, y + 1);
      if (a) adjNums.push(a);
      a = extractNum(x + 1, y + 1);
      if (a) adjNums.push(a);
    }

    if (adjNums.length === 2) {
      gearRatios.push(adjNums[0] * adjNums[1]);
    }
  }
}

const partTwo = lodash.sum(gearRatios);
console.log("part two", partTwo, partTwo === 79842967);
