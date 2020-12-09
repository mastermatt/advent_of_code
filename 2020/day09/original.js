const lodash = require("lodash");
const Iter = require("es-iter");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map(line => parseInt(line));
const preambleSize = 25;
// const input = readFile(__dirname, "./sample.txt").map(line => parseInt(line));
// const preambleSize = 5;

let i = preambleSize;
let partOne = null;
while (true) {
  const num = input[i];
  let found = false;
  const iter = new Iter(input.slice(i - preambleSize, i));
  for (const [a, b] of iter.combinations(2)) {
    if (a + b === num) {
      found = true;
      break;
    }
  }

  if (!found) {
    partOne = num;
    break;
  }

  ++i;
}

console.log("part one", partOne); // 248131121

function pTwo() {
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const sum = lodash.sum(input.slice(i, j));
      if (sum === partOne) {
        const sorted = lodash.sortBy(input.slice(i, j));
        return sorted[0] + sorted[sorted.length - 1];
      }

      if (sum > partOne) {
        break;
      }
    }
  }
}

const partTwo = pTwo();
console.log("part two", partTwo); // 31580383
