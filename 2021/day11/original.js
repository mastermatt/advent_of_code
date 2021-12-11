const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { generateCoords, neighbors } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map(Number)
);

function step() {
  const flashed = new CoordinateSet();

  for (const [x, y] of generateCoords(input[0].length, input.length)) {
    input[y][x]++;
  }

  let keepGoing = true;
  while (keepGoing) {
    keepGoing = false;
    for (const [x, y] of generateCoords(input[0].length, input.length)) {
      if (input[y][x] <= 9) {
        continue;
      }

      keepGoing = true;
      input[y][x] = 0;
      flashed.add(x, y);

      for (const [_, xn, yn] of neighbors(x, y, input)) {
        if (!flashed.has(xn, yn)) {
          input[yn][xn]++;
        }
      }
    }
  }

  return flashed.size;
}

let a = 0;
for (let i = 0; i < 100; i++) {
  a += step();
}

const partOne = a;
console.log("part one", partOne, partOne === 1661);

// I was prepared to do some weird stuff to get this.
// I assumed the answer would be some huge number that would take years to brute force
// and there must be some clever maths to figure it out.
// But I figured I'd run it once for a million iters and see how long it took.
// The bloody answer was just 334!
let c = 100;
while (c < 1000000) {
  c++;
  const b = step();
  if (b === 100) break;
}

const partTwo = c;
console.log("part two", partTwo, partTwo === 334);
