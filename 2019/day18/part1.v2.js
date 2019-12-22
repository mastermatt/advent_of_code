const Iter = require("es-iter");
const lodash = require("lodash");

const PriorityQueue = require("../../helpers/priorityQueue");
const CoordinateSet = require("../../helpers/coordinateSet");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

console.time();
const input = readFile(__dirname, "./input.txt").map(line => line.split(""));
// const input = readFile(__dirname, "./sample2.txt").map(line => line.split(""));

const ENTRANCE = "@";
const WALL = "#";
// const OPEN = ".";
const isKey = /[a-z]/;
const isDoor = /[A-Z]/;

const dirDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

const shortestPath = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const stack = [[x1, y1, 0, []]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [x, y, dist, doors] = stack.shift();

    if (x === x2 && y === y2) {
      // lowercase here to make things easier later
      const doorList = doors
        .sort()
        .join("")
        .toLowerCase();
      return [dist, doorList];
    }

    seen.add(x, y);

    dirDeltas.forEach(([xd, yd]) => {
      const [nx, ny] = [x + xd, y + yd];

      const atPos = input[ny][nx];
      if (seen.has(nx, ny) || atPos === WALL) {
        return;
      }

      const doorClone = [...doors];
      if (isDoor.test(atPos)) {
        doorClone.push(atPos);
      }

      stack.push([nx, ny, dist + 1, doorClone]);
    });
  }

  throw "can't find shortest";
};

const keyCoordinates = {};
const entranceCoordinates = {};

input.forEach((line, yIdx) => {
  line.forEach((char, xIdx) => {
    if (isKey.test(char)) {
      keyCoordinates[char] = { x: xIdx, y: yIdx };
    }
    if (char === ENTRANCE) {
      entranceCoordinates.x = xIdx;
      entranceCoordinates.y = yIdx;
    }
  });
});

const allKeys = Object.keys(keyCoordinates);
const keyGraph = new DefaultDict(Array);

allKeys.forEach(key => {
  const [distance, doors] = shortestPath(
    entranceCoordinates,
    keyCoordinates[key]
  );
  keyGraph[ENTRANCE].push({ key, distance, doors });
});
for (const [a, b] of new Iter(allKeys).combinations(2)) {
  const [distance, doors] = shortestPath(keyCoordinates[a], keyCoordinates[b]);
  keyGraph[a].push({ key: b, distance, doors });
  keyGraph[b].push({ key: a, distance, doors });
}
// console.log(keyGraph);

const hashState = (currentKey, collectedKeys) => {
  const keys = new Set(collectedKeys);
  keys.add(currentKey);
  const uniqueSorted = [...keys].sort().join("");
  return `${currentKey}:${uniqueSorted}`;
};

/**
 * @param {Set<string>} keys
 * @param {string} doors
 * @return {boolean}
 */
const canOpenDoors = (keys, doors) => {
  for (const door of doors) {
    if (!keys.has(door)) {
      return false;
    }
  }

  return true;
};

const dijkstra = () => {
  const queue = new PriorityQueue((a, b) => a[1] < b[1]);
  queue.push([ENTRANCE, 0, new Set()]);

  const seen = new Set();
  const distances = new DefaultDict(Infinity);
  distances[hashState(ENTRANCE, [])] = 0;

  while (!queue.isEmpty()) {
    const [currentKey, currentDistance, collectedKeys] = queue.pop();
    // console.log(currentKey, currentDistance, collectedKeys);

    if (collectedKeys.size === allKeys.length) {
      // console.log(currentKey, currentDistance, collectedKeys);
      return currentDistance;
    }

    seen.add(hashState(currentKey, collectedKeys));

    for (const { key, distance, doors } of keyGraph[currentKey]) {
      if (!canOpenDoors(collectedKeys, doors)) {
        continue;
      }

      const state = hashState(key, collectedKeys);
      const newDistance = currentDistance + distance;

      if (newDistance >= distances[state]) {
        continue;
      }

      distances[state] = newDistance;
      const newKeys = new Set(collectedKeys);
      newKeys.add(key);
      queue.push([key, newDistance, newKeys]);
    }
  }
};

// sample2
// #################
// #i.G..c...e..H.p#
// ########.########
// #j.A..b...f..D.o#
// ########@########
// #k.E..a...g..B.n#
// ########.########
// #l.F..d...h..C.m#
// #################
// dijkstra: 16885.179ms
// 2357.034ms
// answer: 136

console.time("dijkstra");
// 59530.379ms
// 9472.877ms
// 6187.941ms
const partOne = dijkstra();
console.timeEnd("dijkstra");
console.log("step one", partOne); // 5402

const partTwo = 2;
console.log("step two", partTwo); //
console.timeEnd();
