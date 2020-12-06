const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").join("\n");

const groups = input.split("\n\n");

const x = groups.map(group => {
  const a = lodash.countBy([...group]);
  delete a["\n"];
  // console.log(a)
  return Object.keys(a).length;
});

const partOne = lodash.sum(x);
console.log("part one", partOne); // 6596

const y = groups.map(group => {
  const a = lodash.countBy([...group]);
  const num = (a["\n"] || 0) + 1;
  delete a["\n"];

  const b = Object.values(a).filter(c => c === num).length;
  // console.log(a, num, b)
  return b;
});

const partTwo = lodash.sum(y);
console.log("part two", partTwo); // 3219
