const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// 4-5 h: hhhhhh
const input = readFile(__dirname, "./input.txt");

let z = 0;
input.forEach((line) => {
  const [a, str] = line.split(": ");
  const [range, char] = a.split(" ");
  const [from, to] = range.split("-").map((x) => parseInt(x));

  const count = lodash.countBy(str)[char];
  if (count >= from && count <= to) ++z;
});
const partOne = z;
console.log("part one", partOne); // 414

let zz = 0;
input.forEach((line) => {
  const [a, str] = line.split(": ");
  const [range, char] = a.split(" ");
  const [from, to] = range.split("-").map((x) => parseInt(x));

  const m = str[from - 1] === char;
  const n = str[to - 1] === char;

  if (m !== n) ++zz;
});

const partTwo = zz;
console.log("part two", partTwo); // 413
