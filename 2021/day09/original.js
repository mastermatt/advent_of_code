const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");
const CoordinateSet = require("../../helpers/coordinateSet");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map(Number)
);
// const input = readFile(__dirname, "./example.txt").map(line => line.split('').map(Number));

let a = 0;
const lowPoints = [];

for (let x = 0; x < input[0].length; x++) {
  for (let y = 0; y < input.length; y++) {
    const curr = input[y][x];

    const isLowest = orthogonalDeltas
      .filter(([dx, dy]) => {
        return input[y + dy] && input[y + dy][x + dx] !== undefined;
      })
      .every(([dx, dy]) => {
        return input[y + dy][x + dx] > curr;
      });

    if (isLowest) {
      lowPoints.push([x, y]);
      a += curr + 1;
    }
  }
}

const partOne = a;
console.log("part one", partOne, partOne === 458);

const basinSizes = [];
for (const lowPoint of lowPoints) {
  const stack = [lowPoint];
  const seen = new CoordinateSet();
  while (stack.length) {
    const [x, y] = stack.pop();
    seen.add(x, y);
    const pointHeight = input[y][x];

    const newNeighbors = orthogonalDeltas
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([xn, yn]) => {
        return (
          input[yn] &&
          input[yn][xn] !== undefined &&
          input[yn][xn] > pointHeight &&
          input[yn][xn] < 9 &&
          !seen.has(xn, yn)
        );
      });

    stack.push(...newNeighbors);
  }

  basinSizes.push(seen.size);
}

// Find the three largest basins and multiply their sizes together.
basinSizes.sort((a, b) => b - a);
const partTwo = basinSizes[0] * basinSizes[1] * basinSizes[2];
console.log("part two", partTwo, partTwo === 1391940);
