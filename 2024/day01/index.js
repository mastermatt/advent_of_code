const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const left = [];
const right = [];

for (const line of input) {
  const [a, b] = line.split(/\s+/);
  left.push(parseInt(a));
  right.push(parseInt(b));
}

left.sort();
right.sort();

let partOne = 0;

for (let i = 0; i < left.length; i++) {
  partOne += Math.abs(left[i] - right[i]);
}

console.log("part one", partOne, partOne === 1341714);

let partTwo = 0;

for (const a of left) {
  const found = right.filter((b) => a === b);
  partTwo += a * found.length;
}

console.log("part two", partTwo, partTwo === 27384707);
