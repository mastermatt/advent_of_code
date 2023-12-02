console.time();
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

function processLine(line) {
  const [pre, setsStr] = line.split(": ");
  const gameNum = Number(pre.substring(5));
  const sets = setsStr.split("; ").map((s) => {
    const a = s.split(", ").map((b) => {
      const [num, color] = b.split(" ");
      return [Number(num), color];
    });
    return a;
  });

  return [gameNum, sets];
}

const possible = { red: 12, green: 13, blue: 14 };

function isPossible(sets) {
  return sets.flat().every(([num, color]) => num <= possible[color]);
}

function power(sets) {
  const maxes = { red: 0, green: 0, blue: 0 };

  for (const [num, color] of sets.flat()) {
    maxes[color] = Math.max(maxes[color], num);
  }

  return Object.values(maxes).reduce((acc, cur) => acc * cur);
}

let partOne = 0;
let partTwo = 0;

for (const line of input) {
  let [gameNum, sets] = processLine(line);

  if (isPossible(sets)) partOne += gameNum;

  partTwo += power(sets);
}

console.timeEnd(); // 2.392ms
console.log("part one", partOne, partOne === 2679);
console.log("part two", partTwo, partTwo === 77607);
