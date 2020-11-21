const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

let x = input[0].indexOf("|");
let y = 0;
let dir = 0; // 0:down 1:right 2:up 3:left
let steps = 0;
const letters = [];

function checkNewDir(newDir) {
  const [dx, dy] = orthogonalDeltas[newDir];
  const char = (input[y + dy] || [])[x + dx];
  return char === "|" || char === "-";
}

while (true) {
  ++steps;
  x += orthogonalDeltas[dir][0];
  y += orthogonalDeltas[dir][1];
  const currChar = input[y][x];

  if (currChar === "|" || currChar === "-") {
    // just keep going on
    continue;
  }

  if (currChar === " ") {
    // we found the end!
    break;
  }

  if (currChar === "+") {
    // check possible options: straight on, followed by left/right
    dir = [0, 1, 3].map(offset => (dir + offset) % 4).find(checkNewDir);
    continue;
  }

  // we don't expect to come across undefined, so anything else must be a letter
  letters.push(currChar);
}

const partOne = letters.join("");
console.log("part one", partOne); // UICRNSDOK

const partTwo = steps;
console.log("part two", partTwo); // 16064

// how hard would it be to count by just grep-ing the input file?
// num letters: 9
// num pluses: 417
// num dashes: 7966
// num pipes: 6296
// num pipes that cross: ||: 0 -|-: 588 -|: 690 |-: 688  [a-z-]\|: 692  goal: 693

// this good some fancy multi cursors. I selected all the pipes, hit down then backspace.
// Then counted the dashes left and compared to the total dashes from above.
// num dashes that cross: 683

// 9 + 417 + 7966 + 6296 + 588 + 683 = 15959 (off by 105)
// 9 + 417 + 7966 + 6296 + 692 + 683 = 16063 (off by 105)

// 7283
