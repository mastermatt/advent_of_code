const Iter = require("es-iter");
const lodash = require("lodash");

const PriorityQueue = require("../../helpers/priorityQueue");
const CoordinateSet = require("../../helpers/coordinateSet");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

console.time();

const ENTRANCE = "@";
const WALL = "#";
// const OPEN = ".";
const isKey = /[a-z]/;
const isDoor = /[A-Z]/;

const dirDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const shortestPath = (map, { x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const stack = [[x1, y1, 0, []]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [x, y, dist, doors] = stack.shift();

    if (x === x2 && y === y2) {
      // lowercase here to make things easier later
      const doorList = doors.sort().join("").toLowerCase();
      return [dist, doorList];
    }

    seen.add(x, y);

    dirDeltas.forEach(([xd, yd]) => {
      const [nx, ny] = [x + xd, y + yd];

      const atPos = map[ny][nx];
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

  return [null, null];
};

const getCoordinates = (map) => {
  const keys = {};
  const entrances = [];

  map.forEach((line, yIdx) => {
    line.forEach((char, xIdx) => {
      if (isKey.test(char)) {
        keys[char] = { x: xIdx, y: yIdx };
      }
      if (char === ENTRANCE) {
        entrances.push({ x: xIdx, y: yIdx });
      }
    });
  });

  return [keys, entrances];
};

const buildGraph = (map, keyCoordinates, entranceCoords) => {
  const allKeys = Object.keys(keyCoordinates);
  const graph = new DefaultDict(Array);

  entranceCoords.forEach((coords, idx) => {
    allKeys.forEach((key) => {
      const [distance, doors] = shortestPath(map, coords, keyCoordinates[key]);
      if (distance) {
        graph[`entrance:${idx}`].push({ key, distance, doors });
      }
    });
  });

  for (const [a, b] of new Iter(allKeys).combinations(2)) {
    const [distance, doors] = shortestPath(
      map,
      keyCoordinates[a],
      keyCoordinates[b]
    );
    if (distance) {
      graph[a].push({ key: b, distance, doors });
      graph[b].push({ key: a, distance, doors });
    }
  }

  // console.log(graph);
  return graph;
};

/**
 *
 * @param {string[]} robots the keys that identifies where each robot currently is
 * @param {Set<string>} collectedKeys
 * @return {string}
 */
const hashState = (robots, collectedKeys) => {
  const keys = new Set(collectedKeys);
  robots.forEach((robot) => keys.add(robot));
  const uniqueSorted = [...keys].sort().join("");
  return `${robots.join("")}:${uniqueSorted}`;
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

const dijkstra = (graph, numEntrances, numKeys) => {
  const startingRobots = lodash.range(numEntrances).map((i) => `entrance:${i}`);
  const queue = new PriorityQueue((a, b) => a[1] < b[1]);
  const distances = new DefaultDict(Infinity);
  const seen = new Set();

  queue.push([startingRobots, 0, new Set()]);

  while (!queue.isEmpty()) {
    const [robots, currentDistance, collectedKeys] = queue.pop();
    // console.log(robots, currentDistance, collectedKeys, queue.size());

    if (collectedKeys.size === numKeys) {
      // console.log(robots, currentDistance, collectedKeys);
      return currentDistance;
    }

    seen.add(hashState(robots, collectedKeys));

    const adjacent = robots
      .map((robot, robotIdx) => {
        return graph[robot].map((xxx) => {
          const newRobots = [...robots];
          newRobots[robotIdx] = xxx.key;
          return [newRobots, xxx];
        });
      })
      .flat();

    for (const [newRobots, { key, distance, doors }] of adjacent) {
      if (!canOpenDoors(collectedKeys, doors)) {
        continue;
      }

      const state = hashState(newRobots, collectedKeys);
      const newDistance = currentDistance + distance;

      if (newDistance >= distances[state]) {
        continue;
      }

      distances[state] = newDistance;
      const newKeys = new Set(collectedKeys);
      newKeys.add(key);
      queue.push([newRobots, newDistance, newKeys]);
    }
  }
};

const run = (inputPath) => {
  const map = readFile(__dirname, inputPath).map((line) => line.split(""));
  const [keyCoords, entranceCoords] = getCoordinates(map);
  const numKeys = Object.keys(keyCoords).length;
  const graph = buildGraph(map, keyCoords, entranceCoords);
  console.time("dijkstra");
  const shortest = dijkstra(graph, entranceCoords.length, numKeys);
  console.timeEnd("dijkstra");
  return shortest;
};

// const partOne = run("./sample2.txt");
const partOne = run("./input.txt");
console.log("step one", partOne); // 5402

// const partTwo = run("./sample4.txt");
const partTwo = run("./input2.txt");
console.log("step two", partTwo); // 2138
console.timeEnd();
