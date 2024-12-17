const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { generateCoords } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const dirs = [
  [0, -1], // up
  [1, 0], // right
  [0, 1], // down
  [-1, 0], // left
];

const findStartingPos = () => {
  for (let y = 0; y < input.length; y++) {
    const x = input[y].indexOf("^");
    if (x !== -1) return { x, y };
  }
};

const visited = new CoordinateSet();
const startingPos = findStartingPos();
let currPos = startingPos;
let currDir = 0;

const turn = () => (currDir = (currDir + 1) % 4);
const step = () =>
  (currPos = {
    x: currPos.x + dirs[currDir][0],
    y: currPos.y + dirs[currDir][1],
  });
const peek = () =>
  input[currPos.y + dirs[currDir][1]] &&
  input[currPos.y + dirs[currDir][1]][currPos.x + dirs[currDir][0]];

while (input[currPos.y] && input[currPos.y][currPos.x]) {
  visited.add(currPos.x, currPos.y);
  const next = peek();
  if (next === "#") turn();
  else step();
}

const partOne = visited.size;
console.log("part one", partOne, partOne === 4433);

const doesLoop = (grid) => {
  const visited = new CoordinateSet();
  let currPos = startingPos;
  let currDir = 0;

  const turn = () => (currDir = (currDir + 1) % 4);
  const step = () =>
    (currPos = {
      x: currPos.x + dirs[currDir][0],
      y: currPos.y + dirs[currDir][1],
    });
  const peek = () =>
    grid[currPos.y + dirs[currDir][1]] &&
    grid[currPos.y + dirs[currDir][1]][currPos.x + dirs[currDir][0]];

  while (grid[currPos.y] && grid[currPos.y][currPos.x]) {
    visited.add(currPos.x, currPos.y, currDir);
    const next = peek();
    if (next === "#") turn();
    else step();

    if (visited.has(currPos.x, currPos.y, currDir)) return true;
  }

  return false;
};

let partTwo = 0;

const placeObstacle = (x, y) => {
  const grid = [...input];
  const row = grid[y];
  grid[y] = row.substring(0, x) + "#" + row.substring(x + 1);
  return grid;
};

for (const [x, y] of generateCoords(input[0].length, input.length)) {
  if (input[y][x] !== ".") continue;
  const grid = placeObstacle(x, y);
  if (doesLoop(grid)) partTwo++;
}

console.log("part two", partTwo, partTwo === 1516);
