const lodash = require("lodash");
const DefaultDict = require("../../helpers/defaultdict");
const { manhattanDistance } = require("../../helpers/gird");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const coords = input.map((line) => line.split(", ").map(Number));
const closestCounts = new DefaultDict(0);
const infinities = new Set();

// The mins and maxes of the input are 41 352 43 355.
// Buffering them a bit so the edges only include nodes that are infinite.
const min = 0;
const max = 400;
let safeRegionCount = 0; // part two

for (let x = min; x <= max; x++) {
  for (let y = min; y <= max; y++) {
    const distances = coords.map((c) => manhattanDistance([x, y], c));

    // using min and indexOfs was blazing fast compared to sorting
    const minDist = Math.min(...distances);
    const minIdx = distances.indexOf(minDist);
    const minIdx2 = distances.lastIndexOf(minDist);

    if (minIdx === minIdx2) {
      closestCounts[minIdx]++;
    }

    if (x === min || x === max || y === min || y === max) {
      infinities.add(minIdx);
    }

    if (lodash.sum(distances) < 10_000) {
      ++safeRegionCount;
    }
  }
}

const finiteCounts = Object.entries(closestCounts)
  .filter(([idx]) => !infinities.has(Number(idx)))
  .map(([_, count]) => count);

const partOne = Math.max(...finiteCounts);
console.log("part one", partOne); // 4342

const partTwo = safeRegionCount;
console.log("part two", partTwo); // 42966
