const lodash = require("lodash");
const DefaultDict = require("../../helpers/defaultdict");

const tape = new DefaultDict(0);
let state = "A";
let cursor = 0;
let steps = 12_425_180;

const states = {
  A: [
    [1, 1, "B"],
    [0, 1, "F"]
  ],
  B: [
    [0, -1, "B"],
    [1, -1, "C"]
  ],
  C: [
    [1, -1, "D"],
    [0, 1, "C"]
  ],
  D: [
    [1, -1, "E"],
    [1, 1, "A"]
  ],
  E: [
    [1, -1, "F"],
    [0, -1, "D"]
  ],
  F: [
    [1, 1, "A"],
    [0, -1, "E"]
  ]
};

function step() {
  const currVal = tape[cursor];
  const [write, move, newState] = states[state][currVal];
  tape[cursor] = write;
  cursor += move;
  state = newState;
}

while (steps--) {
  step();
}

const partOne = lodash.sum(Object.values(tape));
console.log("part one", partOne); // 3099
