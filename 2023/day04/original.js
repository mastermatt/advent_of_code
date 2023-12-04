const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

function parseLine(line) {
  const [a, b] = line.split(":");
  const cardNumStr = a.split(" ").pop();
  const [c, d] = b.split("|");
  const winningNums = c.split(" ").filter(Boolean).map(Number);
  const ourNums = d.split(" ").filter(Boolean).map(Number);

  return {
    cardNum: Number(cardNumStr),
    winningNums,
    ourNums,
    copies: 1,
  };
}

function getPoints(card) {
  const cnt = lodash.intersection(card.winningNums, card.ourNums).length;
  card.matching = cnt;
  card.points = cnt === 0 ? 0 : 1 << (cnt - 1);

  return card.points;
}

const cards = input.map(parseLine);
const points = cards.map(getPoints);

const partOne = lodash.sum(points);
console.log("part one", partOne, partOne === 28538);

for (const card of cards) {
  for (let i = 0; i < card.matching; i++) {
    cards[card.cardNum + i].copies += card.copies;
  }
}

const partTwo = lodash.sum(cards.map((card) => card.copies));
console.log("part two", partTwo, partTwo === 9425061);
