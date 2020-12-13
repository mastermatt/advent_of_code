/**
 * For each row, determine the difference between the largest value and the smallest value;
 * the checksum is the sum of all of these differences.
 *
 * For example, given the following spreadsheet:
 * 5 1 9 5
 * 7 5 3
 * 2 4 6 8
 * The first row's largest and smallest values are 9 and 1, and their difference is 8.
 * The second row's largest and smallest values are 7 and 3, and their difference is 4.
 * The third row's difference is 6.
 * In this example, the spreadsheet's checksum would be 8 + 4 + 6 = 18.
 */
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const diffs = input.map((row) => {
  const nums = row.split("\t");
  return Math.max(...nums) - Math.min(...nums);
});
const partOne = lodash.sum(diffs);

console.log("part one", partOne); // 34581

/**
 * the goal is to find the only two numbers in each row where one evenly divides the other -
 *  that is, where the result of the division operation is a whole number. They would like you
 *  to find those numbers on each line, divide them, and add up each line's result.
 */
const diffs2 = input.map((row) => {
  const nums = row.split("\t").map((x) => parseInt(x));
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue;
      const res = nums[i] / nums[j];
      if (res === (res | 0)) return res;
    }
  }
});

const partTwo = lodash.sum(diffs2);

console.log("part Two", partTwo); // 214
