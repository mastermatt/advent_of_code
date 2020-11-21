const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map(line => line.split(" "));

let select = 0;
const pointers = [0, 0];
const queues = [[], []];
const sends = [0, 0];
const registers = [{ p: 0 }, { p: 1 }];

function toInt(val) {
  const int = parseInt(val);
  return Number.isNaN(int) ? registers[select][val] : int;
}

const instructions = {
  snd: x => {
    queues[select ^ 1].push(toInt(x));
    ++sends[select];
  },
  rcv: x => (registers[select][x] = queues[select].shift()),
  set: (x, y) => (registers[select][x] = toInt(y)),
  add: (x, y) => (registers[select][x] += toInt(y)),
  mul: (x, y) => (registers[select][x] *= toInt(y)),
  mod: (x, y) => (registers[select][x] %= toInt(y)),
  jgz: (x, y) => {
    if (toInt(x) > 0) {
      pointers[select] += toInt(y) - 1;
    }
  }
};

while (true) {
  const [inst, x, y] = input[pointers[select]];

  if (inst === "rcv" && queues[select].length === 0) {
    select ^= 1;
    if (queues[select].length === 0) {
      break;
    }
  } else {
    instructions[inst](x, y);
    ++pointers[select];
  }
}

const partTwo = sends[1];
console.log("part two", partTwo); // 8001
