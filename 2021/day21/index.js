const lodash = require("lodash");

// Player 1 starting position: 6
// Player 2 starting position: 7

// example
// Player 1 starting position: 4
// Player 2 starting position: 8
const input = [6, 7];
// const input = [4, 8];

const positions = [...input];
let scores = [0, 0];
let die = -1;
let rolls = 0;
let turn = 0;

function roll() {
  ++rolls;
  die = (die + 1) % 100;
  return die + 1;
}
console.time("part one");
while (scores[0] < 1000 && scores[1] < 1000) {
  const move = roll() + roll() + roll();
  positions[turn] += move;
  positions[turn] %= 10;
  scores[turn] += positions[turn];
  if (positions[turn] === 0) scores[turn] += 10;
  turn ^= 1;
}

const partOne = Math.min(...scores) * rolls;
console.timeEnd("part one");
console.log("part one", partOne, partOne === 921585);

const possibilities = [
  [3, 1],
  [4, 3],
  [5, 6],
  [6, 7],
  [7, 6],
  [8, 3],
  [9, 1],
];
const cache = {};
function getPossibilities(p1, p2, s1, s2) {
  if (s1 > 20) return [1, 0];
  if (s2 > 20) return [0, 1];

  const key = [p1, p2, s1, s2].join("");
  const found = cache[key];
  if (found) return found;

  const result = [0, 0];
  for (const [points, prob] of possibilities) {
    const newP = (p1 + points) % 10;
    const [a, b] = getPossibilities(p2, newP, s2, s1 + newP + 1);
    result[0] += b * prob;
    result[1] += a * prob;
  }

  cache[key] = result;
  return result;
}

console.time("part two");
scores = getPossibilities(input[0] - 1, input[1] - 1, 0, 0);
console.timeEnd("part two");

const partTwo = Math.max(...scores);
console.log("part two", partTwo, partTwo === 911090395997650);
