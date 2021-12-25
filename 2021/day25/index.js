const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const width = input[0].length;
const map = input.join("").split("");

// v...>>.vv>
const east = ">";
const south = "v";
const empty = ".";
let steps = 0;

function step() {
  ++steps;

  // east moves first
  const eastMoves = [];
  for (let i = 0; i < map.length; ++i) {
    if (map[i] !== east) continue;
    const right = (i + 1) % width ? i + 1 : i + 1 - width;
    if (map[right] === empty) eastMoves.push(i, right);
  }

  for (let i = 0; i < eastMoves.length; i += 2) {
    map[eastMoves[i]] = empty;
    map[eastMoves[i + 1]] = east;
  }

  // then south
  const southMoves = [];
  for (let i = 0; i < map.length; ++i) {
    if (map[i] !== south) continue;
    const down = (i + width) % map.length;
    if (map[down] === empty) southMoves.push(i, down);
  }

  for (let i = 0; i < southMoves.length; i += 2) {
    map[southMoves[i]] = empty;
    map[southMoves[i + 1]] = south;
  }

  return eastMoves.length + southMoves.length;
}

console.time("part one");
while (step()) {}
console.timeEnd("part one");

// refactor timings
// original 2.041s
// removing the LoDash deep clones, using move queues, and modifying the map in place 742.018ms
// replacing the two generateCoords calls with nested for-i loops 221.77ms
// use flat array for map 163.278ms

const partOne = steps;
console.log("part one", partOne, partOne === 579);
