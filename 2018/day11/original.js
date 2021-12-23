const CoordinateMap = require("../../helpers/coordinateMap");
const { generateCoords, neighborDeltas } = require("../../helpers/gird");

const serialNumber = 9221;

function powerLevel(x, y) {
  const rackID = x + 10;
  return (((((rackID * y + serialNumber) * rackID) / 100) | 0) % 10) - 5;
}

const grid = new CoordinateMap();

for (const [x, y] of generateCoords(300, 300)) {
  grid.set(x + 1, y + 1, powerLevel(x + 1, y + 1));
}

let highestPower = -Infinity;
let highestCoords = [];

for (let curr of generateCoords(298, 298)) {
  const x = curr[0] + 2;
  const y = curr[1] + 2;
  let power = grid.get(x, y);

  for (const [dx, dy] of neighborDeltas) {
    power += grid.get(x + dx, y + dy);
  }

  if (power > highestPower) {
    highestPower = power;
    highestCoords = [x - 1, y - 1];
  }
}

const partOne = highestCoords.join(",");
console.log("part one", partOne, partOne === "20,77");

console.time("part two");
const sums = new CoordinateMap();

for (const [x, y] of generateCoords(300, 300)) {
  const sum =
    grid.get(x + 1, y + 1) +
    (sums.get(x, y + 1) || 0) +
    (sums.get(x + 1, y) || 0) -
    (sums.get(x, y) || 0);
  sums.set(x + 1, y + 1, sum);
}

for (let size = 3; size < 298; size++) {
  // console.log("new size", size);
  for (let x = 1; x < 300 - size; x++) {
    for (let y = 1; y < 300 - size; y++) {
      const power =
        sums.get(x + size, y + size) -
        sums.get(x, y + size) -
        sums.get(x + size, y) +
        sums.get(x, y);

      if (power > highestPower) {
        highestPower = power;
        highestCoords = [x + 1, y + 1, size];
        // console.log("more power", x, y, size, power);
      }
    }
  }
}

const partTwo = highestCoords.join(",");
console.timeEnd("part two"); // 9.126s
console.log("part two", partTwo, partTwo === "143,57,10");
