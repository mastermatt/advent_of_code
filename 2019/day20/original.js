const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => line.split(""));
// const input = readFile(__dirname, "./sample3.txt").map(line => line.split(""));

// const WALL = "#";
const OPEN = ".";
const isAlpha = /[A-Z]/;

const dirDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

class CoordinateSet extends Set {
  // delete(value: T): boolean;
  // forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
  add(...coordinates) {
    return super.add(this.key(coordinates));
  }

  has(...coordinates) {
    return super.has(this.key(coordinates));
  }

  key(coordinates) {
    return coordinates.join(",");
  }
}

const portals = new DefaultDict(Array);

// not the actual height/width of th overall input, but the last index of OPEN spaces in the map.
// To help determine if portals are "outside".
const height = input.length - 3;
const width = input[2].length - 1;

input.forEach((line, yi) => {
  line.forEach((char, xi) => {
    if (!isAlpha.test(char)) {
      return;
    }

    dirDeltas.forEach(([xd, yd]) => {
      const secChar = (input[yi + yd] || [])[xi + xd];
      const xp = xi + xd * 2;
      const yp = yi + yd * 2;
      const thirdChar = (input[yp] || [])[xp];
      // console.log(char, secChar, thirdChar, xi, yi, xd, yd)
      if (!isAlpha.test(secChar) || thirdChar !== OPEN) {
        return;
      }

      const isOutside = xp === 2 || yp === 2 || xp === width || yp === height;
      const key = xd < 0 || yd < 0 ? secChar + char : char + secChar;
      portals[key].push([xp, yp, isOutside]);
      portals[xp][yp] = key;
    });
  });
});

// console.log(portals);

const shortestSingleDimension = () => {
  const stack = [[portals.AA[0], 0]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [[x, y], dist] = stack.shift();
    // console.log(x, y, dist, stack.length)
    seen.add(x, y);

    dirDeltas.forEach(([xd, yd]) => {
      const xn = x + xd;
      const yn = y + yd;
      // console.log(xn,yn, input[yn][xn], seen.has(xn,yn));
      if (input[yn][xn] !== OPEN || seen.has(xn, yn)) {
        return;
      }

      stack.push([[xn, yn], dist + 1]);
    });

    const portalKey = portals[x][y];
    // console.log(portalKey)
    if (portalKey === "ZZ") {
      return dist;
    }
    if (portalKey) {
      portals[portalKey].forEach(([xp, yp]) => {
        if (!seen.has(xp, yp)) {
          stack.push([[xp, yp], dist + 1]);
        }
      });
    }
  }
};

const partOne = shortestSingleDimension();
console.log("part one", partOne); // 638

const shortestMultiDimension = () => {
  const stack = [[portals.AA[0][0], portals.AA[0][1], 0, 0, []]];
  const seen = new CoordinateSet();
  let limit = 10000000;

  while (stack.length && --limit) {
    const [x, y, z, dist] = stack.shift();
    // console.log(x, y, z, dist, stack.length);
    seen.add(x, y, z);

    dirDeltas.forEach(([xd, yd]) => {
      const xn = x + xd;
      const yn = y + yd;
      // console.log(xn,yn, input[yn][xn], seen.has(xn,yn));
      if (input[yn][xn] !== OPEN || seen.has(xn, yn, z)) {
        return;
      }

      stack.push([xn, yn, z, dist + 1]);
    });

    const portalKey = portals[x][y];
    // console.log(portalKey, z)
    if (!portalKey) {
      continue;
    }

    if (portalKey === "ZZ" && z === 0) {
      return dist;
    }

    if (["AA", "ZZ"].includes(portalKey)) {
      continue;
    }

    const currP = portals[portalKey].find(([xp, yp]) => xp === x && yp === y);
    const destP = portals[portalKey].find(([xp, yp]) => xp !== x && yp !== y);

    const isOutside = currP[2];
    if (isOutside && z === 0) {
      // currently next to an outside portal on the top level
      continue;
    }

    const [xn, yn] = destP;
    const zn = isOutside ? z - 1 : z + 1;
    if (!seen.has(xn, yn, zn)) {
      stack.push([xn, yn, zn, dist + 1]);
    }
  }
};

console.time();
const partTwo = shortestMultiDimension();
console.timeEnd(); // ~7sec
console.log("part two", partTwo); // 7844
