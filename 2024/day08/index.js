const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords } = require("../../helpers/gird");
const DefaultDict = require("../../helpers/defaultdict");
const CoordinateSet = require("../../helpers/coordinateSet");
const permutations = require("../../helpers/permutations");

const input = readFile(__dirname, "./input.txt");

const width = input[0].length;
const height = input.length;
const antennas = new DefaultDict(Array);

for (const [x, y] of generateCoords(width, height)) {
  const char = input[y][x];
  if (char === ".") continue;

  antennas[char].push([x, y]);
}

const antinodesSingle = new CoordinateSet();
const antinodesMulti = new CoordinateSet();

for (const coords of Object.values(antennas)) {
  for (const [[ax, ay], [bx, by]] of permutations(coords, 2)) {
    const dx = bx - ax;
    const dy = by - ay;

    let x = bx + dx;
    let y = by + dy;

    if (x >= 0 && y >= 0 && x < width && y < height) {
      antinodesSingle.add(x, y);
    }

    x = bx;
    y = by;

    while (x >= 0 && y >= 0 && x < width && y < height) {
      antinodesMulti.add(x, y);
      x += dx;
      y += dy;
    }
  }
}

const partOne = antinodesSingle.size;
console.log("part one", partOne, partOne === 301);

const partTwo = antinodesMulti.size;
console.log("part two", partTwo, partTwo === 1019);
