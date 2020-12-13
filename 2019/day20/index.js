const CoordinateSet = require("../../helpers/coordinateSet");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => line.split(""));

// const WALL = "#";
const OPEN = ".";
const START = "AA";
const END = "ZZ";
const isAlpha = /[A-Z]/;

const dirDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

// not the actual height/width of th overall input, but the last index of OPEN spaces in the map.
// To help determine if portals are "outside".
const height = input.length - 3;
const width = input[2].length - 1;

// walk around the input looking for portal identifiers
const portals = [];
const portalsByCoords = new DefaultDict(Array);
input.forEach((line, yi) => {
  line.forEach((char, xi) => {
    if (!isAlpha.test(char)) {
      return;
    }

    dirDeltas.forEach(([xd, yd]) => {
      const secChar = (input[yi + yd] || [])[xi + xd];
      const x = xi + xd * 2;
      const y = yi + yd * 2;
      const thirdChar = (input[y] || [])[x];
      // console.log(char, secChar, thirdChar, xi, yi, xd, yd)
      if (!isAlpha.test(secChar) || thirdChar !== OPEN) {
        return;
      }

      const isOutside = x === 2 || y === 2 || x === width || y === height;
      const key = xd < 0 || yd < 0 ? secChar + char : char + secChar;
      // JS Maps key off identity instead of value, so we have to do this dance of creating a string
      // representation of the portals to differentiate the two ends of portals
      const hash = [key, x, y].join(":");
      const stuff = { key, x, y, hash, isOutside };
      portals.push(stuff);
      portalsByCoords[x][y] = stuff;
    });
  });
});

// console.log(portals);

const findNeighbors = ({ x: startX, y: startY }) => {
  const stack = [[startX, startY, 0]];
  const seen = new CoordinateSet();
  const results = [];

  while (stack.length) {
    const [x, y, dist] = stack.shift();
    seen.add(x, y);

    if (dist && portalsByCoords[x][y]) {
      results.push([portalsByCoords[x][y], dist]);
    }

    const newNodes = dirDeltas
      .map(([xd, yd]) => [x + xd, y + yd, dist + 1])
      .filter(([x, y]) => input[y][x] === OPEN && !seen.has(x, y));
    stack.push(...newNodes);
  }

  return results;
};

// compile the adjacency lists
portals.forEach((portal) => {
  portal.adjacent = findNeighbors(portal);
  portal.otherEnd = portals.find(
    (other) => other.key === portal.key && other.hash !== portal.hash
  );
});
const start = portals.find((p) => p.key === START);
// console.log(portals);

const shortestSingleDimension = () => {
  const stack = [[start, 0]];
  const seen = new Set();

  while (stack.length) {
    const [portal, dist] = stack.shift();
    // console.log(x, y, dist, stack.length)
    if (portal.key === END) {
      return dist;
    }

    seen.add(portal.hash);

    const newNodes = [...portal.adjacent, [portal.otherEnd, 1]]
      .filter(([other]) => other && !seen.has(other.hash))
      .map(([other, newDist]) => [other, dist + newDist]);
    stack.push(...newNodes);
  }
};

const partOne = shortestSingleDimension();
console.log("part one", partOne); // 638

const shortestMultiDimension = () => {
  const stack = [[start, 0, 0]];
  const seen = new Set();

  while (stack.length) {
    const [portal, level, dist] = stack.shift();
    // console.log(x, y, level, dist, stack.length);
    if (portal.key === END && level === 0) {
      return dist;
    }

    seen.add(portal.hash + level);

    const newNodes = portal.adjacent
      .filter(([other]) => {
        if (seen.has(other.hash + level)) {
          return false;
        }
        if (other.isOutside) {
          // when at the outermost level, only the outer labels AA and ZZ function (as the start and end, respectively);
          // all other outer labeled tiles are effectively walls. At any other level, AA and ZZ count as walls...
          return [START, END].includes(other.key) === (level === 0);
        }
        return true;
      })
      .map(([other, newDist]) => [other, level, dist + newDist]);
    stack.push(...newNodes);

    if (portal.otherEnd) {
      const newLevel = portal.isOutside ? level - 1 : level + 1;
      if (!seen.has(portal.otherEnd.hash + newLevel)) {
        stack.push([portal.otherEnd, newLevel, dist + 1]);
      }
    }
  }
};

console.time();
const partTwo = shortestMultiDimension();
console.timeEnd(); // 129.395ms
console.log("part two", partTwo); // 7844
