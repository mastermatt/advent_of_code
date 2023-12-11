const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");

const grid = readFile(__dirname, "./input.txt");
const startingLineIdx = grid.findIndex((line) => line.includes("S"));
const startingCharIdx = grid[startingLineIdx].indexOf("S");

const directions = {
  "|": [0, 1, 0, -1],
  "-": [1, 0, -1, 0],
  L: [0, -1, 1, 0],
  J: [0, -1, -1, 0],
  7: [-1, 0, 0, 1],
  F: [1, 0, 0, 1],
};

const currPos = [startingCharIdx + 1, startingLineIdx]; // just go right :shrug:
const coords = new CoordinateSet([[startingCharIdx, startingLineIdx]]);
let step = 1;

while (grid[currPos[1]][currPos[0]] !== "S") {
  ++step;
  coords.add(...currPos);
  const char = grid[currPos[1]][currPos[0]];
  const [dx1, dy1, dx2, dy2] = directions[char];
  const seen = coords.has(currPos[0] + dx1, currPos[1] + dy1);
  currPos[0] += seen ? dx2 : dx1;
  currPos[1] += seen ? dy2 : dy1;
}

const partOne = step / 2;
console.log("part one", partOne, partOne === 6931); // ~11ms

let insideCnt = 0;

for (let y = 0; y < grid.length; ++y) {
  let inside = false;
  let cameFromUp = false;

  for (let x = 0; x < grid[0].length; ++x) {
    const isPipe = coords.has(x, y);

    if (isPipe) {
      const char = grid[y][x];

      if (char === "L" || char === "F" || char === "S") {
        cameFromUp = char === "L";
      }

      if (
        char === "|" ||
        (char === "7" && cameFromUp) ||
        (char === "J" && !cameFromUp)
      ) {
        inside = !inside;
      }
    } else if (inside) {
      ++insideCnt;
    }
  }
}

const partTwo = insideCnt;
console.log("part two", partTwo, partTwo === 357); // ~4.2ms
