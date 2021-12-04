const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./example.txt");
const input = readFile(__dirname, "./input.txt");

const nums = input[0].split(",").map(Number);
const boards = [];

for (let i = 2; i < input.length; i++) {
  const rawBoard = [];
  const rows = [];
  const cols = [[], [], [], [], []];
  for (let j = 0; j < 5; j++, i++) {
    const lineNums = input[i].trim().split(/\s+/).map(Number);
    rows.push(lineNums);

    for (let k = 0; k < 5; k++) {
      cols[k].push(lineNums[k]);
    }

    rawBoard.push(...lineNums);
  }

  boards.push({
    raw: rawBoard,
    rows,
    cols,
    both: rows.concat(cols),
  });
}

function one() {
  let winIdx = 0;
  for (const num of nums) {
    for (const board of boards) {
      if (board.bingo) {
        continue;
      }

      for (const vals of board.both) {
        const idx = vals.indexOf(num);
        if (idx !== -1) {
          vals.splice(idx, 1);
        }
      }

      const isBingo = board.both.some((arr) => arr.length === 0);
      board.bingo = isBingo;

      if (isBingo) {
        board.winNum = num;
        board.winIdx = winIdx;
        winIdx++;

        board.unusedSum = 0;

        for (const row of board.rows) {
          board.unusedSum += lodash.sum(row);
        }
      }
    }
  }
}

one();
boards.sort((a, b) => a.winIdx - b.winIdx);

const first = boards[0];
const partOne = first.unusedSum * first.winNum;
// console.log("part one example", partOne, partOne === 4512);
console.log("part one", partOne, partOne === 10374);

const last = boards[boards.length - 1];
const partTwo = last.unusedSum * last.winNum;
console.log("part two", partTwo, partTwo === 24742);
