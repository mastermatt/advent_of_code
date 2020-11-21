const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const registers = {};
let lastFrequency = -1;
let instIdx = 0;

function toInt(val) {
  const int = parseInt(val);
  return Number.isNaN(int) ? registers[val] : int;
}

const instructions = {
  snd: x => (lastFrequency = toInt(x)),
  set: (x, y) => (registers[x] = toInt(y)),
  add: (x, y) => (registers[x] += toInt(y)),
  mul: (x, y) => (registers[x] *= toInt(y)),
  mod: (x, y) => (registers[x] %= toInt(y)),
  rcv: x => (toInt(x) !== 0 ? lastFrequency : 0),
  jgz: (x, y) => {
    if (toInt(x) > 0) {
      instIdx += toInt(y) - 1;
    }
  }
};

while (true) {
  const [inst, x, y] = input[instIdx].split(" ");
  const res = instructions[inst](x, y);

  if (inst === "rcv" && res) {
    break;
  }
  ++instIdx;
}

const partOne = lastFrequency;
console.log("part one", partOne); // 7071
