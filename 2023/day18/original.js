const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const plans = input.map((line) => {
  const [dir, distStr, color] = line.split(" ");
  const dirMap = { D: 0, R: 1, U: 2, L: 3 };
  return [dirMap[dir], Number(distStr)];

  // the direction to dig: 0 means R, 1 means D, 2 means L, and 3 means U.
  // const dirMap = { 0: 1, 1: 0, 2: 3, 3: 2, }
  // return  [dirMap[color.substring(7,8)],  parseInt(color.substring(2, 7), 16)]
});

const grid = [["#"]];

let curX = 0;
let curY = 0;

function checkGrid() {
  if (curX === -1) {
    grid.forEach((row) => row.unshift("."));
    ++curX;
  }

  if (curX === grid[0].length) {
    grid.forEach((row) => row.push("."));
  }

  if (curY === -1) {
    const newRow = new Array(grid[0].length).fill(".");
    grid.unshift(newRow);
    ++curY;
  }

  if (curY === grid.length) {
    const newRow = new Array(grid[0].length).fill(".");
    grid.push(newRow);
  }
}

function printGrid(g) {
  console.log(g.map((row) => row.join("")).join("\n"));
}

for (const [v, dist] of plans) {
  for (let i = 0; i < dist; ++i) {
    curX += orthogonalDeltas[v][0];
    curY += orthogonalDeltas[v][1];
    checkGrid();
    grid[curY][curX] = v;
  }
}

printGrid(grid);

let insideCnt = 0;
const filledInGrid = [];

for (let y = 0; y < grid.length; ++y) {
  let inside = false;
  let onLine = false;
  let cameFromUp = false;
  const row = [];
  filledInGrid.push(row);

  for (let x = 0; x < grid[0].length; ++x) {
    row.push(".");
    const char = grid[y][x];

    if (char === ".") {
      if (onLine) {
        const wentDown =
          grid[y + 1]?.[x - 1] !== "." && grid[y + 1]?.[x - 1] !== undefined;
        if (cameFromUp === wentDown) inside = !inside;
        onLine = false;
      }

      if (inside) {
        ++insideCnt;
        row[row.length - 1] = "#";
      }
    } else {
      ++insideCnt; // count the edges
      row[row.length - 1] = "#";
      if (onLine) continue;
      onLine = true;
      cameFromUp = grid[y - 1]?.[x] !== "." && grid[y - 1]?.[x] !== undefined;
    }
  }
}

const partOne = insideCnt;
console.log("part one", partOne, partOne === 72821);
// printGrid(filledInGrid)

const partTwo = null;
console.log("part two", partTwo, partTwo === undefined);
