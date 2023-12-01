const Iter = require("es-iter");

const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

console.time();
const input = readFile(__dirname, "./sample2.txt").map((line) =>
  line.split(""),
);

const ENTRANCE = "@";
const WALL = "#";
// const OPEN = ".";

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

const isKey = /[a-z]/;
const isDoor = /[A-Z]/;
const dirDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const shortestPath = ({ x: x1, y: y1 }, { x: x2, y: y2 }) => {
  const stack = [[x1, y1, 0, []]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [x, y, dist, doors] = stack.shift();

    if (x === x2 && y === y2) {
      // lowercase here to make things easier later
      const lower = doors.map((d) => d.toLowerCase());
      return [dist, lower];
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
const keyDistances = new DefaultDict(Object);
const intermediateDoors = new DefaultDict(Object);

input.forEach((line, yIdx) => {
  line.forEach((char, xIdx) => {
    if (isKey.test(char) || char === ENTRANCE) {
      keyCoordinates[char] = { x: xIdx, y: yIdx };
    }
  });
});

const allKeys = Object.keys(keyCoordinates);

for (const [a, b] of new Iter(allKeys).combinations(2)) {
  const [dist, doors] = shortestPath(keyCoordinates[a], keyCoordinates[b]);
  keyDistances[a][b] = keyDistances[b][a] = dist;
  intermediateDoors[a][b] = intermediateDoors[b][a] = doors;
}

const distances = new DefaultDict(Infinity);
distances[ENTRANCE] = 0;

let minDist = Infinity;
const queue = [[ENTRANCE, 0, ENTRANCE]];

const neighborKeys = (currentKey, seenKeys) => {
  return allKeys.filter((prospect) => {
    if (prospect === currentKey) {
      return false;
    }

    // only include neighbor nodes/keys that we can get to given our seen keys and doors along the way
    const doors = intermediateDoors[currentKey][prospect];
    return doors.every((door) => seenKeys.includes(door));
  });
};

console.time("dijkstra");
while (queue.length) {
  // queue.sort((a, b) => a[1] - b[1]);
  const [currentKey, currentDist, seenKeys] = queue.shift();

  // console.log(queue.length, minDist, seenKeys, seenKeys.length, allKeys.length);
  if (seenKeys.length === allKeys.length) {
    minDist = Math.min(minDist, currentDist);
    continue;
  }

  const neighbors = neighborKeys(currentKey, seenKeys);

  neighbors.forEach((prospect) => {
    const newDistance = currentDist + keyDistances[currentKey][prospect];
    const newSeenKeys = [...new Set(seenKeys + prospect)].sort().join("");
    const hash = `${prospect}:${newSeenKeys}`;
    if (newDistance < distances[hash]) {
      // console.log(hash, newDistance)
      distances[hash] = newDistance;
      queue.push([prospect, newDistance, newSeenKeys]);
    }
  });
}
console.timeEnd("dijkstra");
// 59530.379ms

// #################
// #i.G..c...e..H.p#
// ########.########
// #j.A..b...f..D.o#
// ########@########
// #k.E..a...g..B.n#
// ########.########
// #l.F..d...h..C.m#
// #################

const partOne = minDist;
console.log("step one", partOne); // 5402

const partTwo = 2;
console.log("step two", partTwo); //
console.timeEnd();
