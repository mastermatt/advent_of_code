const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];

const sameButDiff = (a, b) => a !== b && a.toUpperCase() === b.toUpperCase();

function reactPolymer(polymer) {
  const buf = [];
  for (const char of polymer) {
    if (buf.length && sameButDiff(char, buf[buf.length - 1])) {
      buf.pop();
    } else {
      buf.push(char);
    }
  }
  return buf.length;
}

const partOne = reactPolymer(input);
console.log("part one", partOne); // 10766

const units = new Set(input.toLowerCase());
const lengths = [...units].map((unit) =>
  reactPolymer(input.replace(new RegExp(unit, "ig"), "")),
);

const partTwo = Math.min(...lengths);
console.log("part two", partTwo); // 6538
