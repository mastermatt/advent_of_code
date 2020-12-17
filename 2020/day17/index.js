const CoordinateMap = require("../../helpers/coordinateMap");
const CoordinateSet = require("../../helpers/coordinateSet");
const { generateNeighborDeltas } = require("../../helpers/gird");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const initial3DCoords = new CoordinateSet();
const initial4DCoords = new CoordinateSet();

input.forEach((line, x) => {
  line.split("").forEach((char, y) => {
    if (char === "#") {
      initial3DCoords.add(x, y, 0);
      initial4DCoords.add(x, y, 0, 0);
    }
  });
});

// If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
// If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
function cycle(providedCoords, numDimensions) {
  const result = new CoordinateSet();
  const counter = new CoordinateMap();

  for (const coords of providedCoords) {
    for (const deltas of generateNeighborDeltas(numDimensions)) {
      const newCoords = coords.map((coord, idx) => coord + deltas[idx]);
      const curr = counter.get(...newCoords) || 0;
      counter.set(...newCoords, curr + 1);
    }
  }

  for (const [coords, count] of counter.entries()) {
    if (count === 3 || (count === 2 && providedCoords.has(...coords))) {
      result.add(...coords);
    }
  }

  return result;
}

let onCoords = initial3DCoords;
for (let i = 0; i < 6; i++) {
  onCoords = cycle(onCoords, 3);
}

const partOne = onCoords.size;
console.log("part one", partOne); // 375

onCoords = initial4DCoords;
for (let i = 0; i < 6; i++) {
  onCoords = cycle(onCoords, 4);
}

const partTwo = onCoords.size;
console.log("part two", partTwo); // 2192
