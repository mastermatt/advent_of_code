const readFile = require("../../helpers/readFile");
const Iter = require("es-iter");

// const input = readFile(__dirname, "./example.txt");
const input = readFile(__dirname, "./input.txt");

function parseNumber(numStr) {
  const result = [];
  const path = [];

  for (const char of numStr) {
    if (char === "[") path.push(0);
    else if (char === "]") path.pop();
    else if (char === ",") ++path[path.length - 1];
    else result.push([Number(char), ...path]);
  }

  return result;
}

const parsed = input.map(parseNumber);

function explode(fullNum) {
  const idx = fullNum.findIndex((num) => num.length === 6);
  if (idx === -1) return false;
  // idx now points to the left value of a pair nested inside four pairs

  // the pair's left value is added to the first regular number to the left of the exploding pair (if any)
  if (idx > 0) fullNum[idx - 1][0] += fullNum[idx][0];
  // and the pair's right value is added to the first regular number to the right of the exploding pair (if any)
  if (idx < fullNum.length - 2) fullNum[idx + 2][0] += fullNum[idx + 1][0];
  // Then, the entire exploding pair is replaced with the regular number 0.
  fullNum.splice(idx, 2, [0, ...fullNum[idx].slice(1, -1)]);
  // console.log('after explode', toStr(fullNum));
  return true;
}

function split(fullNum) {
  const idx = fullNum.findIndex((num) => num[0] > 9);
  if (idx === -1) return false;

  const [num, ...path] = fullNum[idx];
  const leftNum = Math.floor(num / 2);
  const rightNum = Math.ceil(num / 2);
  fullNum.splice(idx, 1, [leftNum, ...path, 0], [rightNum, ...path, 1]);
  // console.log('after split', toStr(fullNum));
  return true;
}

// [[[[[9,8],1],2],3],4]
// 9,0,0,0,0,0
// 8,0,0,0,0,1
// 1,0,0,0,1
// 2,0,0,1
// 3,0,1
// 4,1
/// explode the first pair:
// 0,0,0,0,0
// 9,0,0,0,1
// 2,0,0,1
// 3,0,1
// 4,1

function sum(left, right) {
  const result = [];
  for (const [num, ...path] of left) {
    result.push([num, 0, ...path]);
  }
  for (const [num, ...path] of right) {
    result.push([num, 1, ...path]);
  }
  // console.log('after addition', toStr(result));
  while (explode(result) || split(result)) {}
  // console.log('after reduction', toStr(result));
  return result;
}

function sumList(list) {
  return list.reduce((acc, cur) => sum(acc, cur));
}

// function toStr(fullNum) {
//   const single = []
//   for (const [num, ...path] of fullNum) {
//     lodash.set(single, path, num)
//   }
//   return JSON.stringify(single)
// }

function magnitude(fullNum) {
  while (fullNum.length > 1) {
    for (let i = 0; i < fullNum.length - 1; i++) {
      const curr = fullNum[i];
      if (
        curr.length !== fullNum[i + 1].length ||
        curr[curr.length - 1] !== 0
      ) {
        // not the first index of a reg-number pair
        continue;
      }

      const [leftNum, ...path] = curr;
      const [rightNum] = fullNum[i + 1];
      const newNum = 3 * leftNum + 2 * rightNum;
      path.pop();
      fullNum.splice(i, 2, [newNum, ...path]);
    }
  }

  return fullNum[0][0];
}

// const magTest = '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]'
// console.log('mag test', magnitude(parseNumber(magTest)) === 4140);

const partOne = magnitude(sumList(parsed));
console.log("part one", partOne, partOne === 4433);

const mags = new Iter(parsed)
  .permutations(2)
  .map(([a, b]) => magnitude(sum(a, b)))
  .toArray();
const partTwo = Math.max(...mags);
console.log("part two", partTwo, partTwo === 4559);
