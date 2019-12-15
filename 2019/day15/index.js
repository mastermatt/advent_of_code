const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

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

// north (1), south (2), west (3), and east (4)
const dirs = [1, 2, 3, 4];
const visited = new Set();

let stack = [[1], [2], [3], [4]];
let shortestPath = [];

while (stack.length) {
  const path = stack.shift();
  let comp = new Computer([...input]);

  comp.writeAndExec(...path);
  const status = lodash.last(comp.outBuf);

  if (status === 0) {
    // wall
    continue;
  }

  if (status === 2) {
    // console.log("found it!", path.length);
    shortestPath = path;
    break;
  }

  let x = 0;
  let y = 0;
  path.forEach(d => {
    [x, y] = moveLoc(d, x, y);
  });

  visited.add(`${x}:${y}`);

  dirs.forEach(d => {
    const key = moveLoc(d, x, y).join(":");
    if (!visited.has(key)) {
      stack.push([...path, d]);
    }
  });
}

const partOne = shortestPath.length;
console.log("part one", partOne); // 242

stack = [shortestPath];
visited.clear();
let longestPath = [];

while (stack.length) {
  const path = stack.shift();
  let comp = new Computer([...input]);

  comp.writeAndExec(...path);
  const status = lodash.last(comp.outBuf);

  if (status === 0) {
    // wall
    continue;
  }

  if (path.length > longestPath.length) {
    longestPath = path;
    // console.log("new longest", longestPath.length)
  }

  let x = 0;
  let y = 0;
  path.forEach(d => {
    [x, y] = moveLoc(d, x, y);
  });

  visited.add(`${x}:${y}`);

  dirs.forEach(d => {
    const key = moveLoc(d, x, y).join(":");
    if (!visited.has(key)) {
      stack.push([...path, d]);
    }
  });
}

const partTwo = longestPath.length - shortestPath.length;
console.log("part two", partTwo); // 276
