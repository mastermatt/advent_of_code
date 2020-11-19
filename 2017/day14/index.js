const lodash = require("lodash");
const CoordinateMap = require("../../helpers/coordinateMap");
const { generateCoords, orthogonalDeltas } = require("../../helpers/gird");

const input = "ljoxqyyw";

// this was copied from day 10
function hash(hashInput) {
  const lengths = hashInput
    .split("")
    .map(c => c.charCodeAt(0))
    .concat(17, 31, 73, 47, 23);
  const list = lodash.range(256);
  let currPos = 0;
  let skipSize = 0;

  // for each length:
  //   Reverse the order of that length of elements in the list, starting with the element at the current position.
  //   Move the current position forward by that length plus the skip size.
  //   Increase the skip size by one.
  function round() {
    for (const length of lengths) {
      // reverse subset
      const rev = [...list, ...list].slice(currPos, currPos + length).reverse();
      const revFront = rev.slice(0, list.length - currPos);
      const revBack = rev.slice(revFront.length);
      list.splice(currPos, revFront.length, ...revFront);
      list.splice(0, revBack.length, ...revBack);

      currPos = (currPos + length + skipSize) % list.length;
      ++skipSize;
    }
  }

  lodash.times(64, round);
  const denseHash = new Array(16).fill(0);
  list.forEach((num, idx) => (denseHash[(idx / 16) | 0] ^= num));
  return denseHash;
}

const grid = lodash.range(128).map(idx => {
  const hashed = hash(`${input}-${idx}`);
  return hashed.map(i => i.toString(2).padStart(8, "0")).join("");
});

const usedPerRow = grid.map(row => lodash.countBy(row)["1"] || 0);

const partOne = lodash.sum(usedPerRow);
console.log("part one", partOne); // 8316

const map = new CoordinateMap();

function recordGroup(startX, startY, id) {
  const stack = [[startX, startY]];

  while (stack.length) {
    const [x, y] = stack.shift();
    map.set(x, y, id);

    const usedNeighbors = orthogonalDeltas
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([x1, y1]) => (grid[y1] || "")[x1] === "1" && !map.has(x1, y1));
    stack.push(...usedNeighbors);
  }
}

let cnt = 0;
for (const [x, y] of generateCoords(128, 128)) {
  if (grid[y][x] === "0" || map.has(x, y)) {
    continue;
  }

  ++cnt;
  recordGroup(x, y, cnt);
}

const partTwo = cnt;
console.log("part two", partTwo); // 1074
