const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const comp = new Computer([...input]);
comp.execute();

const map = comp.outBuf.map((c) => String.fromCharCode(c)).join("");
// console.log(map);

const grid = map.split("\n").map((line) => line.split(""));
const directions = ["^", ">", "v", "<"];

// movement deltas
const forwardDeltas = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const leftDeltas = [
  [-1, 0],
  [0, -1],
  [1, 0],
  [0, 1],
];
const rightDeltas = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

let botX = 0;
let botY = 0;
let botDir = 0;
let alignmentParameterSum = 0;

grid.forEach((line, lineIdx) => {
  line.forEach((char, charIdx) => {
    const intersection = [
      (grid[lineIdx - 1] || [])[charIdx],
      grid[lineIdx][charIdx - 1],
      grid[lineIdx][charIdx],
      grid[lineIdx][charIdx + 1],
      (grid[lineIdx + 1] || [])[charIdx],
    ].every((c) => c === "#");

    if (intersection) {
      alignmentParameterSum += lineIdx * charIdx;
    }

    const dirIdx = directions.indexOf(char);
    if (dirIdx !== -1) {
      [botX, botY, botDir] = [charIdx, lineIdx, dirIdx];
    }
  });
});

const partOne = alignmentParameterSum;
console.log("step one", partOne); // 3448

/**
 * This solution for Part Two takes into account a few shortcuts that were only identified after
 * solving the problem long hand first.
 *
 * - When scaffolding crosses, those are not intersections where the bot has a choice to turn.
 * - Following the path means the bot never double backs/reuses on paths.
 * - A movement never has the bot stop midway down a straight line before needing more input.
 * - Therefore: The bot always follows the pattern of: turn, move some spaces, repeat.
 */

const path = [];
const isScaffolding = (xd, yd) => (grid[botY + yd] || [])[botX + xd] === "#";

// walk the scaffolding
// the path is a cycle of rotation followed by moving all the way to the next bend
while (true) {
  // determine which way to turn
  if (isScaffolding(...leftDeltas[botDir])) {
    path.push("L");
    botDir = (botDir + 3) % 4;
  } else if (isScaffolding(...rightDeltas[botDir])) {
    path.push("R");
    botDir = (botDir + 1) % 4;
  } else {
    break;
  }

  // determine how many steps to move forward
  let steps = 0;
  while (isScaffolding(...forwardDeltas[botDir])) {
    steps++;
    const [xd, yd] = forwardDeltas[botDir];
    botX += xd;
    botY += yd;
  }
  path.push(steps);
}

//// Convert the path to movement rules
const pathStr = path.join(",");
// using capture group references was surprisingly effective and performant (~0.3ms)
// some things it had to do:
// - assume all three movement-functions/sub-routines would be used
// - allow for sub routines to be reused before finding the first occurrence of all of them
// - limit how many chars each sub routine could be, even though movements could be double digits
// - deal with trailing commas (not well, the code below cleans these up)
const regex =
  /^(?<A>(?:[LR],\d+,){1,5})\1*(?<B>(?:[LR],\d+,){1,5})(?:\1|\2)*(?<C>(?:[LR],\d+,){1,5})(?:\1|\2|\3)*$/;

const subRoutineMatches = (pathStr + ",").match(regex);
const movementRules = [];
const mainRoutine = Object.entries(subRoutineMatches.groups)
  // strip trailing comma
  .map(([key, subRoutine]) => [key, subRoutine.replace(/,$/, "")])
  // add the sub-routine to the list and replace its occurrences in the main routine
  .reduce((acc, [key, subRoutine]) => {
    movementRules.push(subRoutine);
    return acc.replace(new RegExp(subRoutine, "g"), key);
  }, pathStr);

movementRules.unshift(mainRoutine);
// Finally, you will be asked whether you want to see a continuous video feed; provide either y or n and a newline.
movementRules.push("n", "");

const encodedMoveRules = movementRules
  .join("\n")
  .split("")
  .map((c) => c.charCodeAt(0));

// Force the vacuum robot to wake up by changing the value in your ASCII program at address 0 from 1 to 2.
const input2 = [...input];
input2[0] = 2;
const comp2 = new Computer(input2);
comp2.writeAndExec(...encodedMoveRules);

// only grab the last output. it will out the map again, but we don't need it.
const partTwo = comp2.readLastChunk(1)[0];
console.log("step two", partTwo); // 762405

// ..........####^..............................
// ..........#..................................
// ..........#..................................
// ..........#..................................
// ..........#######............................
// ................#............................
// ................#.......#############........
// ................#.......#...........#........
// #######.........#.......#...........#........
// #.....#.........#.......#...........#........
// #.....#.........#.#####.#.....#########......
// #.....#.........#.#...#.#.....#.....#.#......
// #.....#.......###########.###########.#......
// #.....#.......#.#.#...#...#...#.......#......
// #.....#.......#.#######...#...#.......#......
// #.....#.......#...#.......#...#.......#......
// #.....#.###########.###########.......#......
// #.....#.#.....#.....#.....#...........#......
// #.....#########.....#.....#...........#......
// #.......#...........#.....#...........#......
// #######.#...........#.....#######.....#######
// ......#.#...........#...........#...........#
// ......#.#############...........#...........#
// ......#.........................#...........#
// ......#.........................#...........#
// ......#.........................#...........#
// ......#.........................#...........#
// ......#.........................#...........#
// ......#.........................#.###########
// ......#.........................#.#..........
// ......#######...................#######......
// ..................................#...#......
// ..................................#...#......
// ..................................#...#......
// ..................................#####......

// my path
// L,4,L,4,L,6,R,10,L,6,L,4,L,4,L,6,R,10,L,6,L,12,L,6,R,10,L,6,R,8,R,10,L,6,R,8,R,10,L,6,L,4,L,4,L,6,R,10,L,6,R,8,R,10,L,6,L,12,L,6,R,10,L,6,R,8,R,10,L,6,L,12,L,6,R,10,L,6
// A,A,B,C,C,A,C,B,C,B

// A: L,4,L,4,L,6,R,10,L,6
// B: L,12,L,6,R,10,L,6
// C: R,8,R,10,L,6

// orez-
// L111111111111L111111L11111111R111111L11111111L11111111R1111R111111R111111L111111111111L111111L11111111R111111L11111111L11111111R1111R111111R111111L111111111111R111111L11111111L111111111111R111111L11111111L11111111L11111111R1111R111111R111111L111111111111L111111L11111111R111111L11111111L11111111R1111R111111R111111L111111111111R111111L11111111
// L12,L6,L8,R6,L8,L8,R4,R6,R6,L12,L6,L8,R6,L8,L8,R4,R6,R6,L12,R6,L8,L12,R6,L8,L8,L8,R4,R6,R6,L12,L6,L8,R6,L8,L8,R4,R6,R6,L12,R6,L8

// A C A C B B C A C B
// A: L12 L6 L8 R6
// B: L12 R6 L8
// C: L8 L8 R4 R6 R6
