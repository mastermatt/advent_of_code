const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

const comp = new Computer([...input]);

// NOT A J
// NOT B T
// AND T J
// NOT C T
// AND T J
// AND D J
const x = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
WALK
`;

const encoded = x
  .trimStart()
  .split("")
  .map(c => c.charCodeAt(0));
comp.writeAndExec(...encoded);

const map = comp.outBuf.map(c => String.fromCharCode(c)).join("");
console.log(map);

const partOne = comp.readLastChunk(1)[0];
console.log("part one", partOne); // 19353692

const xx = `
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
NOT J T
OR E T
OR H T
AND T J
RUN
`;

// ....@............
// .................
// .................
// #####.#.##.#.####
//      ABCDEFGHI
// . ^   ^
//       ^   ^
//     ^   ^
//          ^   ^

const comp2 = new Computer([...input]);
const encoded2 = xx
  .trimStart()
  .split("")
  .map(c => c.charCodeAt(0));
comp2.writeAndExec(...encoded2);

const map2 = comp2.outBuf.map(c => String.fromCharCode(c)).join("");
console.log(map2);

const partTwo = comp2.readLastChunk(1)[0];
console.log("part two", partTwo); // 1142048514
