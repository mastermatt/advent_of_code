const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// 1-3 a: abcde
const regexp =
  /^(?<first>\d+)-(?<second>\d+) (?<char>[a-z]): (?<password>[a-z]+)$/;
const parsed = input.map((line) => line.match(regexp).groups);

const validPartOnes = parsed.filter(({ first, second, char, password }) => {
  const count = lodash.countBy(password)[char];
  return count >= first && count <= second;
});

const partOne = validPartOnes.length;
console.log("part one", partOne); // 414

const validPartTwos = parsed.filter(({ first, second, char, password }) => {
  const a = password[first - 1] === char;
  const b = password[second - 1] === char;

  return a !== b;
});

const partTwo = validPartTwos.length;
console.log("part two", partTwo); // 413
