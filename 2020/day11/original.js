const readFile = require("../../helpers/readFile");
const { generateCoords, neighborDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");
// const input = readFile(__dirname, "./sample.txt");

function _printGrid(grid) {
  grid.forEach((row) => console.log(row.join("")));
}

// If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
// If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
// Otherwise, the seat's state does not change.
function step(grid) {
  const result = [];
  for (const [x, y] of generateCoords(grid.length, grid[0].length)) {
    const curr = grid[x][y];

    if (curr === ".") continue;

    const neighbors = neighborDeltas.filter(
      ([dx, dy]) => (grid[x + dx] || [])[y + dy] === "#",
    ).length;

    let occ = curr;

    if (curr === "L" && neighbors === 0) occ = "#";
    else if (curr === "#" && neighbors >= 4) occ = "L";

    if (!result[x]) result[x] = [];
    result[x][y] = occ;
  }
  return result;
}

function countOcc(grid) {
  return grid.flat().filter((char) => char === "#").length;
}

let grid = input;
let i = 0;
while (++i < 100) {
  grid = step(grid);
  // console.log(i, countOcc(grid))
  // printGrid(grid)
}
const partOne = countOcc(grid);
console.log("part one", partOne); // 2152

function look(grid, x, y, dx, dy) {
  while (true) {
    x += dx;
    y += dy;

    const curr = (grid[x] || [])[y];
    if (curr === ".") continue;

    return curr === "#";
  }
}

function step2(grid) {
  const result = [];
  for (const [x, y] of generateCoords(grid.length, grid[0].length)) {
    const curr = grid[x][y];
    if (!result[x]) result[x] = [];

    if (curr === ".") {
      result[x][y] = curr;
      continue;
    }

    const neighbors = neighborDeltas.filter(([dx, dy]) =>
      look(grid, x, y, dx, dy),
    ).length;

    let occ = curr;

    if (curr === "L" && neighbors === 0) occ = "#";
    else if (curr === "#" && neighbors >= 5) occ = "L";

    if (!result[x]) result[x] = [];
    result[x][y] = occ;
  }
  return result;
}

grid = input;
i = 0;
while (++i < 100) {
  grid = step2(grid);
  // console.log(i, countOcc(grid))
  // printGrid(grid)
}

const partTwo = countOcc(grid);
console.log("part two", partTwo); // 1937
