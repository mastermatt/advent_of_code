const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./example.txt");
const input = readFile(__dirname, "./input.txt");

const nodes = {};

function ensureNode(name) {
  if (nodes[name]) return nodes[name];

  const node = {
    name,
    isBig: name === name.toUpperCase(),
    neighbors: [],
  };
  nodes[name] = node;
  return node;
}

for (const line of input) {
  const [a, b] = line.split("-");

  const nodeA = ensureNode(a);
  const nodeB = ensureNode(b);

  nodeA.neighbors.push(nodeB);
  nodeB.neighbors.push(nodeA);
}

const { start, end } = nodes;

const stack = [[start]];
const throughPaths = [];

while (stack.length) {
  const seen = stack.pop();
  const last = lodash.last(seen);

  if (last === end) {
    throughPaths.push(seen);
    continue;
  }

  for (const n of last.neighbors) {
    if (n.isBig || !seen.includes(n)) {
      stack.push([...seen, n]);
    }
  }
}

const partOne = throughPaths.length;
console.log("part one", partOne, partOne === 5157);

stack.push([start]);
const throughPaths2 = [];

while (stack.length) {
  const seen = stack.pop();
  const last = lodash.last(seen);

  if (last === end) {
    throughPaths2.push(seen);
    continue;
  }

  const seenSmalls = seen
    .filter((node) => !node.isBig)
    .map((node) => node.name);
  const uniqSmalls = new Set(seenSmalls);
  const seenASmallTwice = seenSmalls.length !== uniqSmalls.size;

  for (const n of last.neighbors) {
    if (n === start) continue;
    if (n.isBig || !seenASmallTwice || !seen.includes(n)) {
      stack.push([...seen, n]);
    }
  }
}

const partTwo = throughPaths2.length;
console.log("part two", partTwo, partTwo === 144309);
