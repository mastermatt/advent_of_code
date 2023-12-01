const lodash = require("lodash");
const { generateCoords, genSymmetries } = require("../../helpers/gird");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const startPattern = ".#./..#/###";

const split = (str) => str.split("/").map((i) => i.split(""));
const unsplit = (matrix) => matrix.map((i) => i.join("")).join("/");

function* genSymRules(from, to) {
  const splitTo = split(to);
  for (const a of genSymmetries(split(from))) {
    yield [unsplit(a), splitTo];
  }
}

const rules = Object.fromEntries(
  input
    .map((line) => line.split(" => "))
    .map(([from, to]) => [...genSymRules(from, to)])
    .flat(),
);
// console.log(rules);

function enhance(grid) {
  const subSize = grid[0].length % 2 === 0 ? 2 : 3;
  const newSubCnt = grid[0].length / subSize;
  const newSubSize = subSize + 1;
  const result = lodash.range(newSubCnt * newSubSize).map(() => []);

  for (const [subIdxX, subIdxY] of generateCoords(newSubCnt, newSubCnt)) {
    const ogSub = lodash
      .range(subSize)
      .map((idx) =>
        grid[subSize * subIdxY + idx].slice(
          subSize * subIdxX,
          subSize * subIdxX + subSize,
        ),
      );
    const newSub = rules[unsplit(ogSub)];
    newSub.forEach((row, idx) =>
      result[newSubSize * subIdxY + idx].push(...row),
    );
  }

  return result;
}

function countOnsAfterInters(num) {
  const result = lodash
    .range(num)
    .reduce((grid) => enhance(grid), split(startPattern));
  return lodash.countBy(unsplit(result))["#"];
}

const partOne = countOnsAfterInters(5);
console.log("part one", partOne); // 125

const partTwo = countOnsAfterInters(18);
console.log("part two", partTwo); // 1782917
