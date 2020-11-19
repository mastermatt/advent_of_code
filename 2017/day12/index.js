const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
// 954 <-> 607, 1055, 1452

const nodes = input.map(line => {
  const [from, to] = line.split(" <-> ");
  return { from, to: to.split(", ") };
});

const map = lodash.keyBy(nodes, "from");
const seen = new Set();

function add(program) {
  if (seen.has(program)) {
    return;
  }
  seen.add(program);
  map[program].to.forEach(add);
}

add("0");

const partOne = seen.size;
console.log("part one", partOne); // 380

let count = 0;
let unseen = [...Object.keys(map)]; // start will all
while (unseen.length) {
  count++;
  seen.clear();
  add(unseen[0]);
  unseen = lodash.difference(unseen, [...seen]);
}

const partTwo = count;
console.log("part two", partTwo); // 181
