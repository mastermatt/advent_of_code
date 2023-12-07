const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const hands = input.map((line) => {
  const [hand, bidStr] = line.split(" ");

  return { hand, bid: Number(bidStr) };
});

const typeMap = {
  5: 6,
  41: 5,
  32: 4,
  311: 3,
  221: 2,
  2111: 1,
  11111: 0,
};

function typeHand(hand) {
  const groups = lodash.groupBy(hand);
  const typeKey = Object.values(groups)
    .map((a) => a.length)
    .sort()
    .reverse()
    .join("");
  return typeMap[typeKey];
}

for (const hand of hands) {
  hand.type = typeHand(hand.hand);
}

const labelOrder = "AKQJT98765432";

function cmpHands(a, b) {
  if (a.type === b.type) {
    for (let i = 0; i < a.hand.length; i++) {
      if (a.hand[i] !== b.hand[i]) {
        return labelOrder.indexOf(a.hand[i]) - labelOrder.indexOf(b.hand[i]);
      }
    }
  }

  return b.type - a.type;
}

hands.sort(cmpHands);

const partOne = hands.reduce((acc, curr, idx) => {
  const rank = hands.length - idx;

  return acc + rank * curr.bid;
}, 0);

console.log("part one", partOne, partOne === 246424613); // ~4ms

function typeHand2(hand) {
  const { J, ...groups } = lodash.groupBy(hand);
  const sortedLengths = Object.values(groups)
    .map((a) => a.length)
    .sort()
    .reverse();

  if (J) {
    if (sortedLengths.length) sortedLengths[0] += J.length;
    else sortedLengths.push(J.length); // all jokers
  }

  const typeKey = sortedLengths.join("");
  return typeMap[typeKey];
}

for (const hand of hands) {
  hand.type = typeHand2(hand.hand);
}

const labelOrder2 = "AKQT98765432J";

function cmpHands2(a, b) {
  if (a.type === b.type) {
    for (let i = 0; i < a.hand.length; i++) {
      if (a.hand[i] !== b.hand[i]) {
        return labelOrder2.indexOf(a.hand[i]) - labelOrder2.indexOf(b.hand[i]);
      }
    }
  }

  return b.type - a.type;
}

hands.sort(cmpHands2);

const partTwo = hands.reduce((acc, curr, idx) => {
  const rank = hands.length - idx;

  return acc + rank * curr.bid;
}, 0);

console.log("part two", partTwo, partTwo === 248256639); // ~3.5ms
