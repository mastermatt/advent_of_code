const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// Step S must be finished before step B can begin.
const input = readFile(__dirname, "./input.txt");

const inputRegex = /Step (\w) must be finished before step (\w) can begin\./;
const nodeMap = {};

function getNode(char) {
  if (!nodeMap[char]) {
    nodeMap[char] = {
      char,
      reqs: [],
      used: false,
      started: false,
      dur: char.charCodeAt(0) - 4,
    };
  }
  return nodeMap[char];
}

input.forEach((line) => {
  const [a, b] = line.match(inputRegex).slice(1, 3);
  const an = getNode(a);
  const bn = getNode(b);
  bn.reqs.push(an);
});
const nodes = Object.values(nodeMap);

const result = [];
const filterPartOne = (node) => !node.used && node.reqs.every((n) => n.used);

while (true) {
  const avail = nodes.filter(filterPartOne);
  if (!avail.length) break;
  const next = lodash.sortBy(avail, "char")[0];
  result.push(next.char);
  next.used = true;
}

const partOne = result.join("");
console.log("part one", partOne); // JRHSBCKUTVWDQAIGYOPXMFNZEL

let seconds = 0;
const working = [];
const filterPartTwo = (node) =>
  !node.started && node.reqs.every((n) => n.dur === 0);

while (true) {
  working.forEach((node) => --node.dur);
  lodash.remove(working, (node) => node.dur === 0);

  const avail = nodes.filter(filterPartTwo);
  if (!working.length && !avail.length) break;

  const next = lodash
    .sortBy(avail, "char")
    .slice(0, Math.max(0, 5 - working.length));

  next.forEach((node) => (node.started = true));
  working.push(...next);
  ++seconds;
}

const partTwo = seconds;
console.log("part two", partTwo); // 975
