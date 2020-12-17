const Iter = require("es-iter");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => parseInt(line));
const preambleSize = 25;
// const input = readFile(__dirname, "./sample.txt").map(line => parseInt(line));
// const preambleSize = 5;

function one() {
  let i = preambleSize;
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
      return num;
    }
    ++i;
  }
}

const partOne = one();
console.log("part one", partOne); // 248131121

function two(invalidNum) {
  for (let i = 0; ; i++) {
    for (let j = i + 1, sum = input[i]; sum < invalidNum; j++) {
      sum += input[j];
      if (sum === invalidNum) {
        const slice = input.slice(i, j);
        return Math.min(...slice) + Math.max(...slice);
      }
    }
  }
}

const partTwo = two(partOne);
console.log("part two", partTwo); // 31580383
