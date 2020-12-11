const readFile = require("../../helpers/readFile");
const { generateCoords, neighborDeltas } = require("../../helpers/gird");

const EMPTY = "L";
const FLOOR = ".";
const OCCUPIED = "#";

const input = readFile(__dirname, "./input.txt");
// const input = readFile(__dirname, "./sample.txt");

const countOcc = grid => grid.flat().filter(char => char === OCCUPIED).length;
const printGrid = grid => grid.forEach(row => console.log(row.join("")));

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
function step(grid) {
  const result = [];
  for (const [x, y] of generateCoords(grid.length, grid[0].length)) {
    const curr = grid[x][y];
    if (!result[x]) result[x] = [];
    result[x][y] = curr;

    if (curr === FLOOR) continue;

    const neighbors = neighborDeltas.filter(
      ([dx, dy]) => (grid[x + dx] || [])[y + dy] === OCCUPIED
    ).length;

    if (curr === EMPTY && neighbors === 0) result[x][y] = OCCUPIED;
    else if (curr === OCCUPIED && neighbors >= 4) result[x][y] = EMPTY;
  }
  return result;
}

let grid = input;
for (let i = 0; i < 100; ++i) {
  grid = step(grid);
  // console.log(i, countOcc(grid))
  // printGrid(grid)
}

const partOne = countOcc(grid);
console.log("part one", partOne); // 2152

function seesOccupied(grid, x, y, dx, dy) {
  while (true) {
    x += dx;
    y += dy;

    const spot = (grid[x] || [])[y];
    if (spot === FLOOR) continue;
    return spot === OCCUPIED;
  }
}

function step2(grid) {
  const result = [];
  for (const [x, y] of generateCoords(grid.length, grid[0].length)) {
    const curr = grid[x][y];
    if (!result[x]) result[x] = [];
    result[x][y] = curr;

    if (curr === FLOOR) continue;

    const neighbors = neighborDeltas.filter(([dx, dy]) =>
      seesOccupied(grid, x, y, dx, dy)
    ).length;

    if (curr === EMPTY && neighbors === 0) result[x][y] = OCCUPIED;
    else if (curr === OCCUPIED && neighbors >= 5) result[x][y] = EMPTY;
  }
  return result;
}

grid = input;
for (let i = 0; i < 100; ++i) {
  grid = step2(grid);
  // console.log(i, countOcc(grid))
  // printGrid(grid)
}

const partTwo = countOcc(grid);
console.log("part two", partTwo); // 1937
