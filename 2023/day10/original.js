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

const prevPos = [startingCharIdx, startingLineIdx];
const currPos = [startingCharIdx + 1, startingLineIdx]; // just go right :shrug:
let step = 1;
const coords = new CoordinateSet([prevPos, currPos]);

while (grid[currPos[1]][currPos[0]] !== "S") {
  ++step;
  const char = grid[currPos[1]][currPos[0]];
  const [dx1, dy1, dx2, dy2] = directions[char];
  let dx, dy;

  if (currPos[0] + dx1 === prevPos[0] && currPos[1] + dy1 === prevPos[1]) {
    dx = dx2;
    dy = dy2;
  } else {
    dx = dx1;
    dy = dy1;
  }

  prevPos[0] = currPos[0];
  prevPos[1] = currPos[1];
  currPos[0] += dx;
  currPos[1] += dy;
  coords.add(...currPos);
}

const partOne = step / 2;
console.log("part one", partOne, partOne === 6931); // ~11ms

let insideCnt = 0;

for (let y = 0; y < grid.length; y++) {
  let inside = false;
  let cameFromDir = null;

  for (let x = 0; x < grid[0].length; x++) {
    const isPipe = coords.has(x, y);

    if (isPipe) {
      const char = grid[y][x];

      if (char === "|") {
        inside = !inside;
      }
      if (char === "-") {
        continue;
      }
      if (char === "L") {
        cameFromDir = "up";
      }
      if (char === "F" || char === "S") {
        cameFromDir = "down";
      }

      if (
        (char === "J" && cameFromDir === "down") ||
        (char === "7" && cameFromDir === "up")
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
