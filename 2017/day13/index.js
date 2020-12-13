const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
// const input = ['0: 3', '1: 2', '4: 4', '6: 4',]

const depths = [];
input.forEach((line) => {
  const [depth, range] = line.split(": ");
  depths[depth] = parseInt(range);
});

const severities = depths.map((range, depth) =>
  depth % (range * 2 - 2) === 0 ? range * depth : 0
);

const partOne = lodash.sum(severities);
console.log("part one", partOne); // 2164

function getsCaught(delay) {
  return !!depths.find(
    (range, depth) => (depth + delay) % (range * 2 - 2) === 0
  );
}

let delay = 1;
while (getsCaught(delay)) {
  ++delay;
}

const partTwo = delay;
console.log("part two", partTwo); // 3861798
