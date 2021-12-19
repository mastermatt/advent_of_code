const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];

function parseLine(line) {
  return line.match(/\d+/g).map(Number);
}

function main(numPlayers, highMarble, expected) {
  const scores = new Array(numPlayers).fill(0);

  // linked list. nodes: [val, prev, next]
  let curr = [0];
  curr.push(curr, curr);

  for (let marble = 1; marble <= highMarble; marble++) {
    if (marble % 23 === 0) {
      curr = curr[1][1][1][1][1][1];
      const sliced = curr[1];
      curr[1] = sliced[1];
      sliced[1][2] = curr;
      scores[marble % numPlayers] += marble + sliced[0];
    } else {
      const newPrev = curr[2];
      const newNext = newPrev[2];
      const newNode = [marble, newPrev, newNext];
      curr = newPrev[2] = newNext[1] = newNode;
    }
  }

  const score = Math.max(...scores);
  if (expected) console.log(numPlayers, highMarble, score, score === expected);
  return score;
}

[
  "9 players; last marble is worth 25 points: high score is 32",
  "10 players; last marble is worth 1618 points: high score is 8317",
  "13 players; last marble is worth 7999 points: high score is 146373",
  "17 players; last marble is worth 1104 points: high score is 2764",
  "21 players; last marble is worth 6111 points: high score is 54718",
  "30 players; last marble is worth 5807 points: high score is 37305",
].map((line) => main(...parseLine(line)));

const [numPlayers, highMarble] = parseLine(input);
const partOne = main(numPlayers, highMarble);
console.log("part one", partOne, partOne === 439341);

const partTwo = main(numPlayers, highMarble * 100);
console.log("part two", partTwo, partTwo === 3566801385);
