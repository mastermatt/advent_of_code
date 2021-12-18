const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

function parseNumber(numStr) {
  const result = [];
  let depth = 0;

  for (const char of numStr) {
    if (char === "[") ++depth;
    else if (char === "]") --depth;
    else if (char !== ",") result.push([Number(char), depth]);
  }

  return result;
}

const parsed = input.map(parseNumber);

function explode(fullNum) {
  const idx = fullNum.findIndex((num) => num[1] === 5);
  if (idx === -1) return false;
  // idx now points to the left value of a pair nested inside four pairs

  // the pair's left value is added to the first regular number to the left of the exploding pair (if any)
  if (idx > 0) fullNum[idx - 1][0] += fullNum[idx][0];
  // and the pair's right value is added to the first regular number to the right of the exploding pair (if any)
  if (idx < fullNum.length - 2) fullNum[idx + 2][0] += fullNum[idx + 1][0];
  // Then, the entire exploding pair is replaced with the regular number 0.
  fullNum.splice(idx, 2, [0, fullNum[idx][1] - 1]);
  return true;
}

function split(fullNum) {
  const idx = fullNum.findIndex((num) => num[0] > 9);
  if (idx === -1) return false;

  const [num, depth] = fullNum[idx];
  const leftNum = Math.floor(num / 2);
  const rightNum = Math.ceil(num / 2);
  fullNum.splice(idx, 1, [leftNum, depth + 1], [rightNum, depth + 1]);
  return true;
}

function sum(left, right) {
  const result = [];
  for (const [num, depth] of left) {
    result.push([num, depth + 1]);
  }
  for (const [num, depth] of right) {
    result.push([num, depth + 1]);
  }
  while (explode(result) || split(result)) {} // reduce
  return result;
}

function sumList(list) {
  return list.reduce((acc, cur) => sum(acc, cur));
}

function magnitude(fullNum) {
  for (let depth = 4; depth >= 0; depth--) {
    for (let i = 0; i < fullNum.length - 1; i++) {
      const [curNum, currDepth] = fullNum[i];
      const [nextNum, nextDepth] = fullNum[i + 1];
      if (currDepth === depth && nextDepth === depth)
        fullNum.splice(i, 2, [3 * curNum + 2 * nextNum, depth - 1]);
    }
  }

  return fullNum[0][0];
}

const partOne = magnitude(sumList(parsed));
console.log("part one", partOne, partOne === 4433);

let maxMag = 0;
for (const a of parsed) {
  for (const b of parsed) {
    if (a !== b) maxMag = Math.max(maxMag, magnitude(sum(a, b)));
  }
}

const partTwo = maxMag;
console.log("part two", partTwo, partTwo === 4559);
