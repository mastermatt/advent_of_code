const Iter = require("es-iter");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");
const { isPrime } = require("../../helpers/math");

const input = readFile(__dirname, "./input.txt");

let registers = new DefaultDict(0);
let instIdx = 0;

function toInt(val) {
  const int = parseInt(val);
  return Number.isNaN(int) ? registers[val] : int;
}

const instructions = {
  set: (x, y) => (registers[x] = toInt(y)),
  sub: (x, y) => (registers[x] -= toInt(y)),
  mul: (x, y) => (registers[x] *= toInt(y)),
  jnz: (x, y) => {
    if (toInt(x) !== 0) {
      instIdx += toInt(y) - 1; // sub one because the main loop increments the index
    }
  },
};

let mulCalls = 0;
while (instIdx < input.length) {
  const [inst, x, y] = input[instIdx].split(" ");
  instructions[inst](x, y);

  if (inst === "mul") {
    ++mulCalls;
  }
  ++instIdx;
}

const partOne = mulCalls;
console.log("part one", partOne); // 8281

// this was all refactored from the assembly code in scratch.txt
// basically:
// b is set to 93 then multiplied by 100 and added to 100,000
// c is set to b plus 17000
// then it iterates from b to c in steps of 17 counting how many are not prime

let partTwo = 0;
for (const b of Iter.range(109300, 126300 + 1, 17)) {
  if (!isPrime(b)) ++partTwo;
}
console.log("part two", partTwo); // 911
