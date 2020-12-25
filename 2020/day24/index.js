const Iter = require("es-iter");
const CoordinateMap = require("../../helpers/coordinateMap");
const CoordinateSet = require("../../helpers/coordinateSet");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// const deltaMap = {
//   e: [-1, 1, 0],
//   se: [-1, 0, 1],
//   sw: [0, -1, 1],
//   w: [1, -1, 0],
//   nw: [1, 0, -1],
//   ne: [0, 1, -1],
// };
const deltaMap = {
  e: [-1, 0],
  se: [-1, 1],
  sw: [0, 1],
  w: [1, 0],
  nw: [1, -1],
  ne: [0, -1],
};
const deltas = Object.values(deltaMap);

const sumCoords = ([aq, ar], [bq, br]) => [aq + bq, ar + br];

const tiles = input
  .map((line) => line.match(/(e|se|sw|w|nw|ne)/g))
  .map((dirs) => dirs.map((dir) => deltaMap[dir]).reduce(sumCoords));
// console.log(tiles);

let blackTiles = new CoordinateSet();
for (const coords of tiles) {
  if (blackTiles.has(...coords)) {
    blackTiles.delete(...coords);
  } else {
    blackTiles.add(...coords);
  }
}

const partOne = blackTiles.size;
console.log("part one", partOne, partOne === 293); // 293

// Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
// Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
function day(startingSet) {
  const adjacencyCounter = new CoordinateMap();
  const result = new CoordinateSet();

  const adjacencyIter = new Iter(startingSet)
    .product(deltas)
    .map(([a, b]) => sumCoords(a, b));

  for (const coords of adjacencyIter) {
    const c = adjacencyCounter.get(...coords) || 0;
    adjacencyCounter.set(...coords, c + 1);
  }

  for (const [coords, c] of adjacencyCounter.entries()) {
    if (c === 2 || (c === 1 && startingSet.has(...coords))) {
      result.add(...coords);
    }
  }

  return result;
}

for (let i = 0; i < 100; i++) {
  blackTiles = day(blackTiles);
}

const partTwo = blackTiles.size;
console.log("part two", partTwo, partTwo === 3967); // 3967
