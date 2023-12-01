const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords, orthogonalNeighbors } = require("../../helpers/gird");
const CoordinateSet = require("../../helpers/coordinateSet");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map(Number),
);

const lowPoints = [];

for (const [x, y] of generateCoords(input[0].length, input.length)) {
  const pointHeight = input[y][x];
  const isLowest = [...orthogonalNeighbors(x, y, input)].every(
    ([neighborHeight]) => neighborHeight > pointHeight,
  );

  if (isLowest) {
    lowPoints.push([x, y]);
  }
}

const riskLevels = lowPoints.map(([x, y]) => input[y][x] + 1);
const partOne = lodash.sum(riskLevels);
console.log("part one", partOne, partOne === 458);

const basinSizes = [];
for (const lowPoint of lowPoints) {
  const stack = [lowPoint];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [x, y] = stack.pop();
    const pointHeight = input[y][x];
    seen.add(x, y);

    for (const [neighborHeight, xn, yn] of orthogonalNeighbors(x, y, input)) {
      if (
        neighborHeight > pointHeight &&
        neighborHeight < 9 &&
        !seen.has(xn, yn)
      ) {
        stack.push([xn, yn]);
      }
    }
  }

  basinSizes.push(seen.size);
}

// Find the three largest basins and multiply their sizes together.
basinSizes.sort((a, b) => b - a);
const partTwo = basinSizes[0] * basinSizes[1] * basinSizes[2];
console.log("part two", partTwo, partTwo === 1391940);
