const lodash = require("lodash");
const CoordinateMap = require("../../helpers/coordinateMap");

const input = [14, 0, 15, 12, 11, 11, 3, 5, 1, 6, 8, 4, 9, 1, 8, 4];
// const input = [0, 2, 7, 0];

const seen = new CoordinateMap();
const banks = [...input];

while (!seen.has(...banks)) {
  seen.set(...banks, seen.size);

  let blocks = Math.max(...banks);
  let idx = banks.indexOf(blocks);
  banks[idx] = 0;

  while (blocks--) {
    idx = (idx + 1) % banks.length;
    ++banks[idx];
  }
}

const partOne = seen.size;
console.log("part one", partOne); // 11137

const partTwo = seen.size - seen.get(...banks);
console.log("part two", partTwo); // 1037
