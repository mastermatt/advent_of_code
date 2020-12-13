const Iter = require("es-iter");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => parseInt(line));

let partOne;
for (const [a, b] of new Iter(input).combinations(2)) {
  if (a + b === 2020) {
    partOne = a * b;
    break;
  }
}

console.log("part one", partOne); // 731731

let partTwo;
for (const [a, b, c] of new Iter(input).combinations(3)) {
  if (a + b + c === 2020) {
    partTwo = a * b * c;
    break;
  }
}

console.log("part two", partTwo); // 116115990
