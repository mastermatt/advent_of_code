const assert = require("assert");
const fs = require("fs");
const path = require("path");

const computer = require("../computer");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"))
  .toString()
  .trim()
  .split(",")
  .map(Number);

// all of this testing was formalized after the original submissions so that the computer could be refactored.

// - Using position mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
assert.deepStrictEqual(
  computer.execute([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [2]),
  [0],
);
assert.deepStrictEqual(
  computer.execute([3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8], [8]),
  [1],
);

// - Using position mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
assert.deepStrictEqual(
  computer.execute([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [7]),
  [1],
);
assert.deepStrictEqual(
  computer.execute([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [8]),
  [0],
);
assert.deepStrictEqual(
  computer.execute([3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8], [9]),
  [0],
);

// - Using immediate mode, consider whether the input is equal to 8; output 1 (if it is) or 0 (if it is not).
assert.deepStrictEqual(
  computer.execute([3, 3, 1108, -1, 8, 3, 4, 3, 99], [2]),
  [0],
);
assert.deepStrictEqual(
  computer.execute([3, 3, 1108, -1, 8, 3, 4, 3, 99], [8]),
  [1],
);

// - Using immediate mode, consider whether the input is less than 8; output 1 (if it is) or 0 (if it is not).
assert.deepStrictEqual(
  computer.execute([3, 3, 1107, -1, 8, 3, 4, 3, 99], [7]),
  [1],
);
assert.deepStrictEqual(
  computer.execute([3, 3, 1107, -1, 8, 3, 4, 3, 99], [8]),
  [0],
);
assert.deepStrictEqual(
  computer.execute([3, 3, 1107, -1, 8, 3, 4, 3, 99], [9]),
  [0],
);

// Here are some jump tests that take an input, then output 0 if the input was zero or 1 if the input was non-zero:
// 3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9 (using position mode)
// 3,3,1105,-1,9,1101,0,0,12,4,12,99,1 (using immediate mode)
assert.deepStrictEqual(
  computer.execute(
    [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
    [0],
  ),
  [0],
);
assert.deepStrictEqual(
  computer.execute(
    [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9],
    [2],
  ),
  [1],
);
assert.deepStrictEqual(
  computer.execute([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], [0]),
  [0],
);
assert.deepStrictEqual(
  computer.execute([3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1], [2]),
  [1],
);

const partOne = computer.execute([...input], [1]).pop();
console.log("part one", partOne); // 9006673

const partTwo = computer.execute([...input], [5])[0];
console.log("part two", partTwo); // 3629692
