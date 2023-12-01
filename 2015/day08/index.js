const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const result = input.reduce(
  (acc, raw) => {
    // console.log(raw, raw.length);
    acc[0] += raw.length;

    const parsed = eval(raw);
    // console.log(parsed, parsed.length);
    acc[1] += parsed.length;

    const encoded = raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    // console.log(encoded, encoded.length)
    acc[2] += encoded.length + 2; // extra 2 for the new quotes

    return acc;
  },
  [0, 0, 0],
);
// console.log(result);

const partOne = result[0] - result[1];
console.log("partOne", partOne); // 1350

const partTwo = result[2] - result[0];
console.log("part two", partTwo); // 2085
