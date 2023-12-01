const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const CoordinateMap = require("../../helpers/coordinateMap");
const { orthogonalNeighbors } = require("../../helpers/gird");
const PriorityQueue = require("../../helpers/priorityQueue");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map(Number),
);

function lowestRisk(grid) {
  const xe = grid[0].length - 1;
  const ye = grid.length - 1;

  const riskMap = new CoordinateMap();
  const queue = new PriorityQueue((a, b) => a[2] < b[2]);
  queue.push([0, 0, 0]);

  while (queue.size()) {
    const [x, y, currRisk] = queue.pop();

    for (const [risk, xn, yn] of orthogonalNeighbors(x, y, grid)) {
      const r = currRisk + risk;
      const prev = riskMap.get(xn, yn);
      if (prev === undefined || r < prev) {
        riskMap.set(xn, yn, r);
        queue.push([xn, yn, r]);
      }
    }
  }

  return riskMap.get(xe, ye);
}

const partOne = lowestRisk(input);
console.log("part one", partOne, partOne === 441);

const input2 = lodash.cloneDeep(input);

for (const row of input2) {
  const l = row.length;
  for (let i = l; i < l * 5; i++) {
    row[i] = row[i - l] === 9 ? 1 : row[i - l] + 1;
  }
}

const ogH = input2.length;
for (let y = ogH; y < ogH * 5; y++) {
  const row = [...input2[y - ogH]];
  for (let i = 0; i < row.length; i++) {
    row[i] = row[i] === 9 ? 1 : row[i] + 1;
  }
  input2.push(row);
}

const partTwo = lowestRisk(input2);
console.log("part two", partTwo, partTwo === 2849);
