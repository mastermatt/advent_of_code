const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const partOneRaces = lodash.unzip(
  input.map((line) => line.split(/:\s+/).pop().split(/\s+/).map(Number)),
);

function countWinningWays([time, dist]) {
  // binary lower
  let a = 0;
  let b = time;

  while (b > a + 1) {
    const m = (((b - a) / 2) | 0) + a;
    if ((time - m) * m > dist) b = m;
    else a = m;
  }

  const atLeast = b;

  // binary upper
  b = time;

  while (b > a + 1) {
    const m = (((b - a) / 2) | 0) + a;
    if ((time - m) * m > dist) a = m;
    else b = m;
  }

  return b - atLeast;
}

const partOne = partOneRaces.map(countWinningWays).reduce((a, c) => a * c);
console.log("part one", partOne, partOne === 1413720); // ~250us

const partTwoRace = input.map((line) =>
  Number(line.replaceAll(/\s+/g, "").split(":").pop()),
);

const partTwo = countWinningWays(partTwoRace);
console.log("part two", partTwo, partTwo === 30565288); // ~80us
