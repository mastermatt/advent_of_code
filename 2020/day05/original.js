const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
// const input = ['FBFBBFFRLR']

const reduce = (str, start, end) => {
  const a = [start, end];
  [...str].forEach(char => {
    const mid = ((a[1] - a[0]) / 2) | 0;
    if (char === "F" || char === "L") {
      a[1] -= mid + 1;
    } else {
      a[0] += mid + 1;
    }
  });
  return a[0];
};

const a = input.map(line => {
  const rows = line.slice(0, 7);
  const cols = line.slice(7);
  const row = reduce(rows, 0, 127);
  const col = reduce(cols, 0, 7);
  return row * 8 + col;
});

const partOne = lodash.max(a);
console.log("part one", partOne); // 813

const b = lodash.sortBy(a);

let partTwo;
for (let i = b[0]; i < b[b.length - 1]; i++) {
  if (!b.includes(i)) {
    partTwo = i;
  }
}

console.log("part two", partTwo); // 612
