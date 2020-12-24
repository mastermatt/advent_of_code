const readFile = require("../../helpers/readFile");
const CoordinateMap = require("../../helpers/coordinateMap");
const CoordinateSet = require("../../helpers/coordinateSet");

// e, se, sw, w, nw, and ne.
// swswnwnesewswsesesewwwwnwwswnewww
const input = readFile(__dirname, "./input.txt");

const dirsMap = {
  e: [-1, 1, 0],
  se: [-1, 0, 1],
  sw: [0, -1, 1],
  w: [1, -1, 0],
  nw: [1, 0, -1],
  ne: [0, 1, -1],
};

const x = input
  .map((line) => line.match(/(sw|nw|ne|se|w|e)/g))
  .map((dirs) => dirs.map((dir) => dirsMap[dir]))
  .map((deltas) =>
    deltas.reduce(([x1, y1, z1], [x2, y2, z2]) => [x1 + x2, y1 + y2, z1 + z2])
  );

// console.log(x)

const s = new CoordinateSet();
for (const coords of x) {
  if (s.has(...coords)) {
    s.delete(...coords);
  } else {
    s.add(...coords);
  }
}

const partOne = s.size;
console.log("part one", partOne); // 293

// Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
// Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
function day(startingSet) {
  const m = new CoordinateMap();

  for (const [x, y, z] of startingSet) {
    for (const [dx, dy, dz] of Object.values(dirsMap)) {
      const coords = [x + dx, y + dy, z + dz];
      const c = m.get(...coords) || 0;
      m.set(...coords, c + 1);
    }
  }

  const r = new CoordinateSet();
  for (const coords of startingSet) {
    const c = m.get(...coords) || 0;
    if (c === 1 || c === 2) r.add(...coords);
  }

  for (const [coords, c] of m.entries()) {
    if (c === 2 && !startingSet.has(...coords)) r.add(...coords);
  }

  return r;
}

let t = s;
for (let i = 0; i < 100; i++) {
  t = day(t);
}

const partTwo = t.size;
console.log("part two", partTwo); // 3967
