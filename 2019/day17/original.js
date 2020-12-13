const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const comp = new Computer([...input]);
comp.execute();

const map = comp.outBuf.map((c) => String.fromCharCode(c)).join("");
// console.log(comp.outBuf.map(c => String.fromCharCode(c)))
// process.stdout.write(map + "\n");
// console.log(map);

const lines = map.split("\n");
let t = 0;
lines.forEach((line, lineIdx) => {
  line.split("").forEach((char, charIdx) => {
    const intersection = [
      (lines[lineIdx - 1] || [])[charIdx],
      lines[lineIdx][charIdx - 1],
      lines[lineIdx][charIdx],
      lines[lineIdx][charIdx + 1],
      (lines[lineIdx + 1] || [])[charIdx],
    ].every((c) => c === "#");

    if (intersection) {
      t += lineIdx * charIdx;
    }
  });
});

const partOne = t;
console.log("step one", partOne); // 3448

const input2 = [...input];
input2[0] = 2;
const comp2 = new Computer(input2);
const xxx = `A,A,B,C,C,A,C,B,C,B
L,4,L,4,L,6,R,10,L,6
L,12,L,6,R,10,L,6
R,8,R,10,L,6
n
`;

const yyy = xxx.split("").map((c) => c.charCodeAt(0));
// console.log(yyy);
comp2.writeAndExec(...yyy);
// console.log(comp2.outBuf);
// console.log(lodash.last(comp2.outBuf));
const partTwo = lodash.last(comp2.outBuf);
console.log("step two", partTwo); // 762405

// L,4,L,4,L,6,R,10,L,6,L,4,L,4,L,6,R,10,L,6,L,12,L,6,R,10,L,6,R,8,R,10,L,6,R,8,R,10,L,6,L,4,L,4,L,6,R,10,L,6,R,8,R,10,L,6,L,12,L,6,R,10,L,6,R,8,R,10,L,6,L,12,L,6,R,10,L,6
// A,A,B,C,C,A,C,B,C,B

// A: L,4,L,4,L,6,R,10,L,6
// B: L,12,L,6,R,10,L,6
// C: R,8,R,10,L,6

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
