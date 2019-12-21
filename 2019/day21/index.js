const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

const run = springscript => {
  const newlineCode = 10;
  const encoded = springscript
    .trim()
    .split("")
    .map(c => c.charCodeAt(0));

  const comp = new Computer([...input], ...encoded, newlineCode);
  comp.execute();

  const lastOutput = lodash.last(comp.outBuf);
  if (lastOutput === newlineCode) {
    const map = comp.outBuf.map(c => String.fromCharCode(c)).join("");
    console.log(map);
    return null;
  }

  return lastOutput;
};

const partOne = run(`
NOT A J
NOT B T
OR T J
NOT C T
OR T J
AND D J
WALK
`);
console.log("part one", partOne); // 19353692

const partTwo = run(`
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
`);
console.log("part two", partTwo); // 1142048514
