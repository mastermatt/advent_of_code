const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map(line => {
  const [inst, arg] = line.split(" ");
  return [inst, parseInt(arg)];
});

function run(tape) {
  let acc = 0;
  let pointer = 0;
  const seen = new Set();

  const instructions = {
    acc: arg => (acc += arg),
    jmp: arg => (pointer += arg - 1),
    nop: () => {}
  };

  while (true) {
    if (seen.has(pointer)) {
      return [false, acc];
    }

    seen.add(pointer);
    const [inst, arg] = tape[pointer];
    instructions[inst](arg);
    ++pointer;

    if (pointer === tape.length) {
      return [true, acc];
    }
  }
}

const partOne = run(input)[1];
console.log("part one", partOne); // 1586

let partTwo = null;

for (let i = 0; i < input.length; i++) {
  const tape = lodash.cloneDeep(input);
  const inst = tape[i][0];

  if (inst === "acc") continue;

  tape[i][0] = inst === "jmp" ? "nop" : "jmp";
  const [success, acc] = run(tape);

  if (success) {
    partTwo = acc;
    break;
  }
}

console.log("part two", partTwo); // 703
