const lodash = require("lodash");

// For example:
//
//   Data from square 1 is carried 0 steps, since it's at the access port.
//   Data from square 12 is carried 3 steps, such as: down, left, left.
//   Data from square 23 is carried only 2 steps: up twice.
//   Data from square 1024 must be carried 31 steps.
//
const input = 347991;
// const input = 1024;

const len = Math.ceil(Math.sqrt(input));
const mid = Math.ceil((len - 1) / 2);
const partOne = mid - 1 + Math.abs(mid - (input % len));

console.log("part one", partOne); // 480

// 17  16  15  14  13  30
// 18   5   4   3  12  29
// 19   6   1   2  11  28
// 20   7   8   9  10  27
// 21  22  23  24  25  26

// x+1
// y+1
// x-2
// y-2
// x+3
// y+3
// ...

const CoordinateMap = require("../../helpers/coordinateMap");

const seen = new CoordinateMap([[0, 0, 1]]);
const neighbors = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

function* walkSpiral() {
  let x = 0;
  let y = 0;
  let step = 0;

  while (true) {
    const dir = step % 4 < 2 ? 1 : -1;
    let dist = (step / 2 + 1) | 0;
    const dx = ((step + 1) % 2) * dir;
    const dy = (step % 2) * dir;
    // console.log(step, dir, dist, dx, dy)

    while (dist--) {
      x += dx;
      y += dy;
      yield [x, y];
    }

    step++;
  }
}

let partTwo = 0;
for (const [x, y] of walkSpiral()) {
  const vals = neighbors.map(([ndx, ndy]) => seen.get(x + ndx, y + ndy) || 0);
  partTwo = lodash.sum(vals);
  // console.log(vals, partTwo)
  seen.set(x, y, partTwo);
  if (partTwo >= input) {
    break;
  }
}

console.log("part two", partTwo); // 349975
