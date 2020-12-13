const lodash = require("lodash");
const { generateCoords } = require("../../helpers/gird");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const startPattern = ".#./..#/###";

const split = (str) => str.split("/").map((i) => i.split(""));
const unsplit = (matrix) => matrix.map((i) => i.join("")).join("/");

// given a 2D matrix (nested arrays) yield the eight symmetries (initial, rotation and reflection)
// initial > trans > rot 90, flipped Y > reverse > rot 180 > trans > flipped Y > reverse > rot 180 > trans > rot 90, flipped X > reverse > rot 90 > trans > flipped X
function* genSymmetries(grid) {
  // reversing basically flips on the X axis
  // unzip basically transposes the nested arrays
  const transpose = () => (grid = lodash.unzip(grid));

  yield grid;
  yield transpose();
  yield grid.reverse();
  yield transpose();
  yield grid.reverse();
  yield transpose();
  yield grid.reverse();
  yield transpose();
}

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
    .flat()
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
          subSize * subIdxX + subSize
        )
      );
    const newSub = rules[unsplit(ogSub)];
    newSub.forEach((row, idx) =>
      result[newSubSize * subIdxY + idx].push(...row)
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
