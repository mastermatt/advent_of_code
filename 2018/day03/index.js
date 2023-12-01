const lodash = require("lodash");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

// #123 @ 3,2: 5x4
const input = readFile(__dirname, "./input.txt").map((line) =>
  line
    .match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/)
    .slice(1, 6)
    .map((digits) => parseInt(digits)),
);

const map = new DefaultDict(Array);

input.forEach(([id, left, top, width, height]) => {
  for (let x = left; x < left + width; ++x) {
    for (let y = top; y < top + height; ++y) {
      map[[x, y]].push(id);
    }
  }
});

const dups = Object.values(map).filter((arr) => arr.length > 1);
const partOne = dups.length;
console.log("part one", partOne); // 113966

const noOverlaps = lodash.difference(
  input.map(([id]) => id),
  ...dups,
);

const partTwo = noOverlaps[0];
console.log("part two", partTwo); // 235
