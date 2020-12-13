const Iter = require("es-iter");
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { generateCoords, neighborDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map((char) => char === "#")
);

// A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
// A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
function step(grid, sticky) {
  const result = [];
  for (const [x, y] of generateCoords(grid.length, grid[0].length)) {
    const curr = grid[x][y];
    const onNeighbors = neighborDeltas.filter(
      ([dx, dy]) => (grid[x + dx] || [])[y + dy]
    ).length;

    const isOn =
      onNeighbors === 3 ||
      (curr && onNeighbors === 2) ||
      (sticky && sticky.has(x, y));

    if (!result[x]) result[x] = [];
    result[x][y] = isOn;
  }
  return result;
}

function countOn(grid) {
  return grid.flat().filter(Boolean).length;
}

let grid = input;
for (let i = 0; i < 100; i++) {
  grid = step(grid);
}

const partOne = countOn(grid);
console.log("part one", partOne); // 814

const corners = new CoordinateSet([
  [0, 0],
  [0, input.length - 1],
  [input[0].length - 1, 0],
  [input[0].length - 1, input.length - 1],
]);

grid = lodash.cloneDeep(input);
for (const [x, y] of corners) {
  grid[x][y] = true;
}
for (let i = 0; i < 100; i++) {
  grid = step(grid, corners);
}

const partTwo = countOn(grid);
console.log("part two", partTwo); // 924
