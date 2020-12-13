const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const cnt = input.map((line) => {
  const words = line.split(" ");
  return words.length === lodash.uniq(words).length ? 1 : 0;
});

const partOne = lodash.sum(cnt);
console.log("part one", partOne); // 455

const cnt2 = input.map((line) => {
  const words = line.split(" ").map((word) => [...word].sort().join());
  return words.length === lodash.uniq(words).length ? 1 : 0;
});

const partTwo = lodash.sum(cnt2);
console.log("part two", partTwo); // 186
