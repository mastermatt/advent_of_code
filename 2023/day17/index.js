const readFile = require("../../helpers/readFile");
const PriorityQueue = require("../../helpers/priorityQueue");

const input = readFile(__dirname, "./input.txt");

const grid = input.map((line) => line.split("").map(Number));
const numRows = grid.length;
const numCols = grid[0].length;
const maxX = numCols - 1;
const maxY = numRows - 1;

const vectors = [
  [
    [0, 1],
    [0, -1],
  ],
  [
    [1, 0],
    [-1, 0],
  ],
];

function run(minDist, maxDist) {
  function* steps(x, y, v) {
    for (const [dx, dy] of vectors[v]) {
      let loss = 0;
      for (let j = 1; j <= maxDist; ++j) {
        const nx = x + dx * j;
        const ny = y + dy * j;
        if (nx < 0 || ny < 0 || nx > maxX || ny > maxY) break;
        loss += grid[ny][nx];
        if (j >= minDist) yield [loss, nx, ny];
      }
    }
  }

  const stack = new PriorityQueue((a, b) => a[2] < b[2]);
  stack.push([0, 0, 0, -1]); // x, y, heat loss, vertical vs horizontal bit
  const seen = new Array(numRows * numCols * 2);
  const costs = new Array(numRows * numCols * 2);

  while (!stack.isEmpty()) {
    const [x, y, h, v] = stack.pop();

    const idx = (x + y * numCols) * 2 + v;
    if (seen[idx]) continue;
    seen[idx] = true;

    const nv = (v + 1) % 2;
    for (const [heatLoss, nx, ny] of steps(x, y, nv)) {
      const nh = heatLoss + h;
      if (nx === maxX && ny === maxY) return nh; // reached the target

      const idx = (nx + ny * numCols) * 2 + nv;
      if (costs[idx] < nh) continue; // still false if prev is undefined
      costs[idx] = nh;

      stack.push([nx, ny, nh, nv]);
    }
  }
}

const partOne = run(1, 3);
console.log("part one", partOne, partOne === 665); // ~48ms

const partTwo = run(4, 10);
console.log("part two", partTwo, partTwo === 809); // ~62ms
