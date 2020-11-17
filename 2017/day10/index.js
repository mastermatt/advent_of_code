const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];

let lengths = input.split(",").map(nums => parseInt(nums));
let list = lodash.range(256);
let currPos = 0;
let skipSize = 0;

// for each length:
//   Reverse the order of that length of elements in the list, starting with the element at the current position.
//   Move the current position forward by that length plus the skip size.
//   Increase the skip size by one.
function round() {
  for (const length of lengths) {
    // rev
    const rev = [...list, ...list].slice(currPos, currPos + length).reverse();
    const revFront = rev.slice(0, list.length - currPos);
    const revBack = rev.slice(revFront.length);
    list.splice(currPos, revFront.length, ...revFront);
    list.splice(0, revBack.length, ...revBack);

    currPos = (currPos + length + skipSize) % list.length;
    ++skipSize;
  }
}

round();

const partOne = list[0] * list[1];
console.log("part one", partOne); // 46600

lengths = input
  .split("")
  .map(c => c.charCodeAt(0))
  .concat(17, 31, 73, 47, 23);
list = lodash.range(256);
currPos = 0;
skipSize = 0;

lodash.times(64, round);
const denseHash = new Array(16).fill(0);
list.forEach((num, idx) => (denseHash[(idx / 16) | 0] ^= num));

const partTwo = denseHash
  .map(num => num.toString(16).padStart(2, "0"))
  .join("");
console.log("part two", partTwo); // 23234babdc6afa036749cfa9b597de1b
