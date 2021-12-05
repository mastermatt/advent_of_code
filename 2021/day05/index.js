const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split(" -> ").map((pair) => pair.split(",").map(Number))
);

// using two Sets instead of a Map because it's noticeably faster
const touched = new CoordinateSet();
const overlaps = new CoordinateSet();

function isDiag(line) {
  const [[x1, y1], [x2, y2]] = line;
  return x1 !== x2 && y1 !== y2;
}

function axisDir(a, b) {
  if (a === b) return 0;
  return a > b ? -1 : 1;
}

function walkLine(line) {
  const [[x1, y1], [x2, y2]] = line;
  const xd = axisDir(x1, x2);
  const yd = axisDir(y1, y2);

  for (let x = x1, y = y1; ; x += xd, y += yd) {
    touched.has(x, y) ? overlaps.add(x, y) : touched.add(x, y);
    if (x === x2 && y === y2) return;
  }
}

const [diagonals, orthogonals] = lodash.partition(input, isDiag);

orthogonals.forEach(walkLine);
const partOne = overlaps.size;
console.log("part one", partOne, partOne === 4826);

diagonals.forEach(walkLine);
const partTwo = overlaps.size;
console.log("part two", partTwo, partTwo === 16793);
