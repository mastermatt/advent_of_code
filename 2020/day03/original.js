const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

let numTrees = 0;
input.forEach((line, idx) => {
  if (line[(idx * 3) % line.length] === "#") ++numTrees;
});

const partOne = numTrees;
console.log("part one", partOne); // 232

let a = 0;
let b = 0;
let c = 0;
let d = 0;
input.forEach((line, idx) => {
  if (line[idx % line.length] === "#") ++a;
  if (line[(idx * 5) % line.length] === "#") ++b;
  if (line[(idx * 7) % line.length] === "#") ++c;
  if (idx % 2 === 0 && line[(idx / 2) % line.length] === "#") ++d;
});

const partTwo = numTrees * a * b * c * d;
console.log("part two", partTwo); // 3952291680
