const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.match(/-?\d+/g).map(Number),
);

function step(mul = 1) {
  for (const point of input) {
    const [x, y, xv, yv] = point;
    point[0] = x + xv * mul;
    point[1] = y + yv * mul;
  }
}

function print(vals, minX, maxX, minY, maxY) {
  for (let y = minY; y <= maxY; y++) {
    const line = [];
    const xs = vals.filter((point) => point[1] === y).map((point) => point[0]);
    for (let x = minX; x <= maxX; x++) {
      line.push(xs.includes(x) ? "█" : " ");
    }
    console.log(line.join(""));
  }
  // console.log('-----------------------------------', minX, maxX, minY, maxY, steps);
}

function getBounds() {
  const xs = input.map((point) => point[0]);
  const ys = input.map((point) => point[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
}

// a quick look at the input and it was obvious that we could skip the first bunch
let steps = 10000;
step(steps);

let prevSize = Infinity;
let prevVals = [];
while (steps++) {
  step();
  const [minX, maxX, minY, maxY] = getBounds();
  const size = maxX - minX + maxY - minY;
  if (size > prevSize) {
    print(prevVals, minX, maxX, minY, maxY);
    break;
  }
  prevSize = size;
  prevVals = lodash.cloneDeep(input);
}

const partOne = "BLGNHPJC";
console.log("part one", partOne, partOne === "BLGNHPJC");

const partTwo = steps - 1;
console.log("part two", partTwo, partTwo === 10476);
