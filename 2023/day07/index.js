const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const hands = input.map((line) => {
  const [hand, bidStr] = line.split(" ");

  return { hand, bid: Number(bidStr) };
});

const hex = "0123456789abcdef";

function typeHand(hand) {
  return Object.values(lodash.groupBy(hand))
    .map((a) => a.length)
    .sort()
    .reverse()
    .join("")
    .padEnd(5, "0");
}

function orderIdxHand(hand, hexMap) {
  const hex = hand
    .split("")
    .map((char) => hexMap[char])
    .join("");
  return parseInt(hex, 16);
}

function prepHandsForSort(typeFn, labelOrder) {
  const hexMap = Object.fromEntries(
    lodash.zip(labelOrder.split(""), hex.split("")),
  );

  for (const hand of hands) {
    hand.type = typeFn(hand.hand);
    hand.orderIdx = orderIdxHand(hand.hand, hexMap);
  }
}

const cmpHands = (a, b) =>
  a.type !== b.type ? a.type - b.type : b.orderIdx - a.orderIdx;

prepHandsForSort(typeHand, "AKQJT98765432");
hands.sort(cmpHands);

const winnings = hands.map((hand, idx) => (idx + 1) * hand.bid);
const partOne = lodash.sum(winnings);
console.log("part one", partOne, partOne === 246424613); // ~3.8ms

function typeHandWithJokers(hand) {
  const { J: jokers, ...groups } = lodash.groupBy(hand);
  const sortedLengths = Object.values(groups)
    .map((a) => a.length)
    .sort()
    .reverse();

  if (jokers) {
    sortedLengths[0] = (sortedLengths[0] || 0) + jokers.length;
  }

  return sortedLengths.join("").padEnd(5, "0");
}

prepHandsForSort(typeHandWithJokers, "AKQT98765432J");
hands.sort(cmpHands);

const winningsTwo = hands.map((hand, idx) => (idx + 1) * hand.bid);
const partTwo = lodash.sum(winningsTwo);
console.log("part two", partTwo, partTwo === 248256639); // ~3.3ms
