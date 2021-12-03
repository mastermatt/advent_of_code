const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const bitCnt = input[0].length;
const bitIdx = [...Array(bitCnt).keys()];

function mostCommonValue(arr, idx) {
  const half = arr.length / 2;
  const count = arr.filter((line) => line[idx] === "1").length;
  return count >= half ? "1" : "0";
}

const mostCommonValues = (arr) =>
  bitIdx.map((idx) => mostCommonValue(arr, idx));

// https://stackoverflow.com/a/42450649/823942
const flipBits = (v, digits) => ~v & (Math.pow(2, digits) - 1);

const gamma = parseInt(mostCommonValues(input).join(""), 2);
const epsilon = flipBits(gamma, bitCnt);
const partOne = gamma * epsilon;
console.log("part one", partOne, partOne === 845186);

function rating(useMostCommon) {
  let lines = [...input];

  for (const idx of bitIdx) {
    const common = mostCommonValue(lines, idx);
    lines = lines.filter((line) => useMostCommon === (line[idx] === common));

    if (lines.length === 1) {
      return parseInt(lines[0], 2);
    }
  }
}

const oxy = rating(true);
const co2 = rating(false);
const partTwo = oxy * co2;
console.log("part two", partTwo, partTwo === 4636702);
