console.time();
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

function processLine(line) {
  const [_, gameNumStr, ...rest] = line.replaceAll(/[^\w ]/g, "").split(" ");
  const maxes = [0, 0, 0];

  for (let i = 0; i < rest.length; ++i) {
    const num = Number(rest[i]);
    const colorIdx = rest[++i].length - 3;
    if (num > maxes[colorIdx]) maxes[colorIdx] = num;
  }

  return [Number(gameNumStr), maxes];
}

let partOne = 0;
let partTwo = 0;

for (const line of input) {
  const [gameNum, maxes] = processLine(line);

  if (maxes[0] <= 12 && maxes[2] <= 13 && maxes[1] <= 14) partOne += gameNum;

  partTwo += maxes[0] * maxes[1] * maxes[2];
}

console.timeEnd(); // 1.144ms
console.log("part one", partOne, partOne === 2679);
console.log("part two", partTwo, partTwo === 77607);
