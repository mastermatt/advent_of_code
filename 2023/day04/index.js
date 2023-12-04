const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

function parseLine(line) {
  const [winningNums, ourNums] = line
    .split(":")
    .pop()
    .split("|")
    .map((chunk) => chunk.split(" ").filter(Boolean).map(Number));

  const matching = lodash.intersection(winningNums, ourNums).length;
  const points = matching === 0 ? 0 : 1 << (matching - 1);

  return { copies: 1, matching, points };
}

const cards = input.map(parseLine);

const partOne = lodash.sum(cards.map(({ points }) => points));
console.log("part one", partOne, partOne === 28538);

for (let i = 0; i < cards.length; i++) {
  const { copies, matching } = cards[i];
  for (let j = 0; j < matching; j++) {
    cards[i + j + 1].copies += copies;
  }
}

const partTwo = lodash.sum(cards.map(({ copies }) => copies));
console.log("part two", partTwo, partTwo === 9425061);
