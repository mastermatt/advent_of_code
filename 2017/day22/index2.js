const lodash = require("lodash");
const CoordinateMap = require("../../helpers/coordinateMap");
const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");
const map = new CoordinateMap();

input.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    map.set(x, y, char);
  });
});

const middle = (input.length / 2) | 0;
const carrier = { x: middle, y: middle, dir: 2 }; // dir 2 is up
let infectedCnt = 0;

const turnMap = { ".": 5, W: 0, "#": 3, F: 2 };
const stateMap = { ".": "W", W: "#", "#": "F", F: "." };

/**
 * Decide which way to turn based on the current node:
 *  If it is clean, it turns left.
 *  If it is weakened, it does not turn, and will continue moving in the same direction.
 *  If it is infected, it turns right.
 *  If it is flagged, it reverses direction, and will go back the way it came.
 *
 * Modify the state of the current node
 *  Clean nodes become weakened
 *  Weakened nodes become infected
 *  Infected nodes become flagged
 *  Flagged nodes become clean
 *
 * The virus carrier moves forward one node in the direction it is facing.
 */
function burst() {
  const { x, y, dir } = carrier;
  const currState = map.get(x, y) || ".";
  const newState = stateMap[currState];
  const newDir = (turnMap[currState] + dir) % 4;

  if (newState === "#") {
    ++infectedCnt;
  }

  map.set(x, y, newState);

  carrier.dir = newDir;
  carrier.x += orthogonalDeltas[newDir][0];
  carrier.y += orthogonalDeltas[newDir][1];
}

for (let i = 0; i < 10_000_000; ++i) {
  burst();
}

console.log("part two", infectedCnt); // 2511927
