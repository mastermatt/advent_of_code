const CoordinateMap = require("../../helpers/coordinateMap");
const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");
const map = new CoordinateMap();

input.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    map.set(x, y, char === "#");
  });
});

const middle = (input.length / 2) | 0;
const carrier = { x: middle, y: middle, dir: 2 }; // dir 2 is up
let infectedCnt = 0;

/**
 * If the current node is infected, it turns to its right.
 * Otherwise, it turns to its left. (Turning is done in-place; the current node does not change.)
 *
 * If the current node is clean, it becomes infected. Otherwise, it becomes cleaned.
 * (This is done after the node is considered for the purposes of changing direction.)
 *
 * The virus carrier moves forward one node in the direction it is facing.
 */
function burst() {
  const { x, y, dir } = carrier;
  const currInfected = map.get(x, y) || false;
  const newDir = ((currInfected ? 3 : 5) + dir) % 4;

  if (!currInfected) {
    ++infectedCnt;
  }

  map.set(x, y, !currInfected);

  carrier.dir = newDir;
  carrier.x += orthogonalDeltas[newDir][0];
  carrier.y += orthogonalDeltas[newDir][1];
}

for (let i = 0; i < 10_000; ++i) {
  burst();
}

console.log("part one", infectedCnt); // 5261
