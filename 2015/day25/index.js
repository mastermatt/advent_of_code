const { modExp } = require("../../helpers/math");

// To continue, please consult the code grid in the manual.
// Enter the code at row 3010, column 3019.
const row = 3010;
const col = 3019;

const start = 20151125n;
const mul = 252533n;
const mod = 33554393n;

const exp = ((row + col - 2) * (row + col - 1)) / 2 + col - 1;
const partOne = (modExp(mul, exp, mod) * start) % mod;
console.log("part one", partOne.toString()); // 8997277
