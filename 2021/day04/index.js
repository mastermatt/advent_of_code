const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const [rawNums, _, ...rest] = input;
const nums = rawNums.split(",").map(Number);

const boards = [];
const rawBoards = rest.join("\n").split("\n\n");

for (const rawBoard of rawBoards) {
  const rows = rawBoard
    .split("\n")
    .map((row) => row.trim().split(/\s+/).map(Number));
  const cols = lodash.unzip(rows); // transposes 2d arrays
  const lines = rows.concat(cols); // all the directions that can win

  boards.push({ rows, lines, roundsPlayed: 0 });
}

for (const board of boards) {
  for (const num of nums) {
    for (const line of board.lines) {
      lodash.remove(line, (n) => n === num); // mutates in place
    }

    board.roundsPlayed++;
    const isBingo = board.lines.some((remaining) => !remaining.length);

    if (isBingo) {
      // we won!
      const unusedSum = lodash.sum(board.rows.flat());
      board.score = unusedSum * num;
      break;
    }
  }
}

boards.sort((a, b) => a.roundsPlayed - b.roundsPlayed);

const first = boards[0];
const partOne = first.score;
console.log("part one", partOne, partOne === 10374);

const last = lodash.last(boards);
const partTwo = last.score;
console.log("part two", partTwo, partTwo === 24742);
