const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const startingStones = input[0].split(" ");

const convertNum = (numStr) => {
  if (numStr === "0") return ["1"];

  const isOdd = numStr.length % 2 === 1;

  if (isOdd) return [String(Number(numStr) * 2024)];

  const splitIdx = numStr.length / 2;
  return [
    // cast to numbers to trim leading zeros
    String(Number(numStr.substring(0, splitIdx))),
    String(Number(numStr.substring(splitIdx))),
  ];
};

const memo = {};
const blink = (tally) => {
  const res = {};

  for (const [numStr, cnt] of Object.entries(tally)) {
    const newVals = (memo[numStr] ??= convertNum(numStr));

    for (const newVal of newVals) {
      res[newVal] = (res[newVal] ?? 0) + cnt;
    }
  }

  return res;
};

const sumTally = (tally) => lodash.sum(Object.values(tally));

let list = {};
for (const numStr of startingStones) list[numStr] = 1;
for (let i = 0; i < 25; i++) list = blink(list);

const partOne = sumTally(list);
console.log("part one", partOne, partOne === 199986);

for (let i = 0; i < 50; i++) list = blink(list);

const partTwo = sumTally(list);
console.log("part two", partTwo, partTwo === 236804088748754); // ~80ms
