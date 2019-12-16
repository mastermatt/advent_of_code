/**
 * The refactored version of this takes a different approach than the original and
 * is heavily influenced by orez-. During the initial attempt I couldn't figure out how to map
 * the area correctly, given the limitations on the movement of the bot. orez-'s approach
 * of using a separate BFS to look for an unmapped area was the key to making this semi-efficient.
 */

const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

const WALL = 0;
const OPEN = 1;
const OXYGEN = 2;

// north (1), south (2), west (3), and east (4)
const dirs = [1, 2, 3, 4];
const moveLoc = (dir, x, y) => {
  switch (dir) {
    case 1:
      return [x, y + 1];
    case 2:
      return [x, y - 1];
    case 3:
      return [x - 1, y];
    case 4:
      return [x + 1, y];
    default:
      throw "unknown dir " + dir;
  }
};

class CoordinateMap extends Map {
  // delete(key: K): boolean;
  // forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  set(...args) {
    const value = args.pop();
    return super.set(this.key(args), value);
  }
  has(...coordinates) {
    return super.has(this.key(coordinates));
  }
  get(...coordinates) {
    return super.get(this.key(coordinates));
  }
  key(coordinates) {
    return coordinates.join(",");
  }
}

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

const pathToUnknown = () => {
  const stack = [[x, y, []]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [nodeX, nodeY, path] = stack.shift();
    seen.add(nodeX, nodeY);

    for (const direction of dirs) {
      const extendedPath = [...path, direction];
      const [newX, newY] = moveLoc(direction, nodeX, nodeY);

      if (seen.has(newX, newY)) {
        continue;
      }

      const atLocation = map.get(newX, newY);

      if (atLocation === undefined) {
        return extendedPath; // found an unknown spot
      }

      if (atLocation === WALL) {
        continue;
      }

      stack.push([newX, newY, extendedPath]);
    }
  }

  return null; // no more spaces found
};

// use the bot to fill in the map and find the location of the oxygen.
const comp = new Computer([...input]);
const map = new CoordinateMap();
const oxygenCoordinates = [];

// the current position of the bot
let x = 0;
let y = 0;
map.set(x, y, OPEN);

while (true) {
  const path = pathToUnknown();
  if (!path) {
    break;
  }

  path.forEach(stepDir => {
    comp.writeAndExec(stepDir);
    const status = lodash.last(comp.outBuf);
    const [exploredX, exploredY] = moveLoc(stepDir, x, y);
    map.set(exploredX, exploredY, status);

    if (status === OXYGEN) {
      oxygenCoordinates.push(exploredX, exploredY);
    }

    if (status !== WALL) {
      // if the bot encounters a wall, it doesn't move
      x = exploredX;
      y = exploredY;
    }
  });
}

// shortest path from origin to the oxygen
const distanceToOxygen = () => {
  const stack = [[0, 0, 0]];
  const seen = new CoordinateSet();

  while (stack.length) {
    const [nodeX, nodeY, distance] = stack.shift();
    if (nodeX === oxygenCoordinates[0] && nodeY === oxygenCoordinates[1]) {
      return distance;
    }

    seen.add(nodeX, nodeY);
    dirs.forEach(direction => {
      const [newX, newY] = moveLoc(direction, nodeX, nodeY);

      if (seen.has(newX, newY) || map.get(newX, newY) === WALL) {
        return;
      }

      stack.push([newX, newY, distance + 1]);
    });
  }

  throw "never found destination";
};

// console.log("map populated", map.size, oxygenCoordinates);
const partOne = distanceToOxygen();
console.log("part one", partOne); // 242

// the longest shortest path from the oxygen
const timeToFill = () => {
  const stack = [[...oxygenCoordinates, 0]];
  const seen = new CoordinateSet();
  let longestDistance = 0;

  while (stack.length) {
    const [nodeX, nodeY, distance] = stack.shift();
    longestDistance = Math.max(longestDistance, distance);

    seen.add(nodeX, nodeY);
    dirs.forEach(direction => {
      const [newX, newY] = moveLoc(direction, nodeX, nodeY);

      if (seen.has(newX, newY) || map.get(newX, newY) === WALL) {
        return;
      }

      stack.push([newX, newY, distance + 1]);
    });
  }

  return longestDistance;
};

const partTwo = timeToFill();
console.log("part two", partTwo); // 276
