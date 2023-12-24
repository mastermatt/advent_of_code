const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const CoordinateMap = require("../../helpers/coordinateMap");
const PriorityQueue = require("../../helpers/priorityQueue");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const grid = input.map((line) => line.split("").map(Number));
const numRows = grid.length;
const numCols = grid[0].length;
const maxX = numCols - 1;
const maxY = numRows - 1;

function run(minDist, maxDist) {
  function* steps(x, y) {
    for (let i = 0; i < orthogonalDeltas.length; ++i) {
      const [vx, vy] = orthogonalDeltas[i];
      let loss = 0;
      for (let j = 1; j <= maxDist; ++j) {
        const xn = x + vx * j;
        const yn = y + vy * j;
        if (xn >= 0 && xn <= maxX && yn >= 0 && yn <= maxY) {
          loss += Number(grid[yn][xn]);
          if (j >= minDist) yield [loss, xn, yn, i];
        }
      }
    }
  }

  const stack = new PriorityQueue((a, b) => a[2] < b[2]);
  stack.push([0, 0, 0, null]);
  const seen = new CoordinateSet();
  const costs = new CoordinateMap();

  while (!stack.isEmpty()) {
    const [x, y, h, v] = stack.pop();

    if (seen.has(x, y, v)) continue;
    seen.add(x, y, v);

    for (const [heat, xn, yn, vn] of steps(x, y)) {
      if ((vn + 2) % 4 === v) continue; // can't go back the way we came
      if (vn === v) continue; // can't go this dir anymore

      const hn = heat + h;
      if (xn === maxX && yn === maxY) return hn;

      const prev = costs.get(xn, yn, vn);
      if (prev && prev <= hn) continue;
      costs.set(xn, yn, vn, hn);

      stack.push([xn, yn, hn, vn]);
    }
  }
}

const partOne = run(1, 3);
console.log("part one", partOne, partOne === 665); // ~200ms

const partTwo = run(4, 10);
console.log("part two", partTwo, partTwo === 809); // ~310ms
