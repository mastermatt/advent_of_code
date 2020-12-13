const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((x) => parseInt(x));

let idx = 0;
let cnt = 0;
let mem = [...input];

while (mem[idx] !== undefined) {
  const jmp = mem[idx];
  mem[idx]++;
  idx += jmp;
  cnt++;
}

const partOne = cnt;
console.log("part one", partOne); // 372139

idx = 0;
cnt = 0;
mem = [...input];

while (mem[idx] !== undefined) {
  const jmp = mem[idx];
  mem[idx] += jmp >= 3 ? -1 : 1;
  idx += jmp;
  cnt++;
}

const partTwo = cnt;
console.log("part two", partTwo); // 29629538
