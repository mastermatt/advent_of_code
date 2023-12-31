const readFile = require("../../helpers/readFile");
const { orthogonalNeighbors } = require("../../helpers/gird");
const CoordinateMap = require("../../helpers/coordinateMap");

const input = readFile(__dirname, "./input.txt");

const sx = (input[0].length / 2) | 0;
const sy = (input.length / 2) | 0;
const stack = [[sx, sy, 0]];
const seen = new CoordinateMap();

while (stack.length) {
  const [x, y, s] = stack.shift();

  if (seen.get(x, y) <= s) continue;
  seen.set(x, y, s);

  for (const [char, xn, yn] of orthogonalNeighbors(x, y, input)) {
    if (char === "#") continue;
    stack.push([xn, yn, s + 1]);
  }
}

const partOne = [...seen.values()].filter((d) => d < 65 && d % 2 === 0).length;
console.log("part one", partOne, partOne === 3782);

// https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
// 26501365 isn't a random number. Our input is 131x131 tiles in size, and 26501365 = 65 + (202300 * 131)
const n = 202300;

let allEvens = 0;
let allOdds = 0;
let cornerEvens = 0;
let cornerOdds = 0;

for (const dist of seen.values()) {
  const isCorner = dist > 65;
  const isOdd = dist % 2 === 1;

  if (isOdd) {
    ++allOdds;
    if (isCorner) ++cornerOdds;
  } else {
    ++allEvens;
    if (isCorner) ++cornerEvens;
  }
}

const partTwo =
  (n + 1) ** 2 * allOdds +
  n ** 2 * allEvens -
  (n + 1) * cornerOdds +
  n * cornerEvens;
console.log("part two", partTwo, partTwo === 630661863455116);
