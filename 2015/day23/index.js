const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.replace(",", "").split(" ")
);

const registers = { a: 0, b: 0 };
let pointer = 0;

const instructions = {
  hlf: (reg) => (registers[reg] = (registers[reg] / 2) | 0),
  tpl: (reg) => (registers[reg] *= 3),
  inc: (reg) => (registers[reg] += 1),
  jmp: (offset) => (pointer += parseInt(offset) - 1),
  jie: (reg, offset) => {
    if (registers[reg] % 2 === 0) pointer += parseInt(offset) - 1;
  },
  jio: (reg, offset) => {
    if (registers[reg] === 1) pointer += parseInt(offset) - 1;
  },
};

while (pointer < input.length) {
  const [inst, ...args] = input[pointer];
  instructions[inst](...args);
  ++pointer;
}

const partOne = registers.b;
console.log("part one", partOne); // 170

registers.a = 1;
registers.b = 0;
pointer = 0;
while (pointer < input.length) {
  const [inst, ...args] = input[pointer];
  instructions[inst](...args);
  ++pointer;
}

const partTwo = registers.b;
console.log("part two", partTwo); // 247
