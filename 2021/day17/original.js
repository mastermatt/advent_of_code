const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];
const parsed = input
  .replace("target area: x=", "")
  .replace(" y=", "")
  .split(",")
  .map((chunk) =>
    chunk
      .split("..")
      .map(Number)
      .sort((a, b) => a - b)
  );

const [[minX, maxX], [minY, maxY]] = parsed;

const maxUpwards = -minY - 1;
const partOne = (maxUpwards * (maxUpwards + 1)) / 2;
console.log("part one", partOne, partOne === 6903);

const minXv = ((-1 + Math.sqrt(minX * 8 + 1)) / 2) | 0;
let total = 0;
for (let vx0 = minXv; vx0 <= maxX; ++vx0) {
  for (let vy0 = minY; vy0 <= -minY; ++vy0) {
    let [x, y, vx, vy] = [vx0, vy0, vx0, vy0];

    while (x <= maxX && y >= minY) {
      if (x >= minX && y <= maxY) {
        ++total;
        break;
      }

      --vy;
      if (vx) --vx;

      x += vx;
      y += vy;
    }
  }
}

const partTwo = total;
console.log("part two", partTwo, partTwo === 2351);
