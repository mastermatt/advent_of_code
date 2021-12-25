const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords } = require("../../helpers/gird");

// const input = readFile(__dirname, "./example.txt").map(line => line.split(''));
const input = readFile(__dirname, "./input.txt").map((line) => line.split(""));
// v...>>.vv>
const east = ">";
const south = "v";
const empty = ".";

function step(map) {
  const width = map[0].length;
  const height = map.length;
  const result = lodash.cloneDeep(map);
  let moves = 0;

  // east moves first
  for (const [x, y] of generateCoords(width, height)) {
    if (map[y][x] !== east) continue;

    if (map[y][(x + 1) % width] === empty) {
      ++moves;
      result[y][x] = empty;
      result[y][(x + 1) % width] = east;
    }
  }
  map = lodash.cloneDeep(result);
  // then south
  for (const [x, y] of generateCoords(width, height)) {
    if (map[y][x] !== south) continue;

    if (map[(y + 1) % height][x] === empty) {
      ++moves;
      result[y][x] = empty;
      result[(y + 1) % height][x] = south;
    }
  }

  return { moves, result };
}

console.time("part one");
let steps = 0;
let map = input;
while (true) {
  ++steps;
  const { moves, result } = step(map);
  map = result;
  // console.log(steps, moves);
  if (moves === 0) break;
}
console.timeEnd("part one"); // 2.041s

const partOne = steps;
console.log("part one", partOne, partOne === 579);
