const readFile = require("../../helpers/readFile");
const { generateCoords, orthogonalNeighbors } = require("../../helpers/gird");
const CoordinateSet = require("../../helpers/coordinateSet");

const input = readFile(__dirname, "./input.txt");
const topoMap = input.map((line) => line.split("").map(Number));
const trailheads = [];

for (const [x, y] of generateCoords(topoMap[0].length, topoMap.length)) {
  if (topoMap[y][x] === 0) {
    trailheads.push([x, y, 0]);
  }
}

const paths = trailheads.map(([x, y, h]) => [x, y, x, y, h]);
const foundPaths = [];

while (paths.length) {
  const [tx, ty, cx, cy, h] = paths.pop();

  for (const [nh, nx, ny] of orthogonalNeighbors(cx, cy, topoMap)) {
    if (nh !== h + 1) continue;

    if (nh === 9) foundPaths.push([tx, ty, nx, ny]);
    else paths.push([tx, ty, nx, ny, nh]);
  }
}

const pathSet = new CoordinateSet(foundPaths);
const partOne = pathSet.size;
console.log("part one", partOne, partOne === 796);

const partTwo = foundPaths.length;
console.log("part two", partTwo, partTwo === 1942);
