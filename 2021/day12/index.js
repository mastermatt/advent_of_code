const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const nodes = {};

function ensureNode(name) {
  if (!nodes[name]) {
    const isBig = name === name.toUpperCase();
    nodes[name] = { name, isBig, neighbors: [] };
  }
  return nodes[name];
}

for (const line of input) {
  const [a, b] = line.split("-");

  const nodeA = ensureNode(a);
  const nodeB = ensureNode(b);

  nodeA.neighbors.push(nodeB);
  nodeB.neighbors.push(nodeA);
}

const { start, end } = nodes;

function countThroughPaths(smallTwice) {
  const stack = [[start]];
  let count = 0;

  while (stack.length) {
    const path = stack.pop();
    const last = path[path.length - 1];

    for (const n of last.neighbors) {
      if (n === start) continue;
      if (n === end) {
        count++;
      } else if (n.isBig || !path.includes(n)) {
        stack.push([...path, n]);
      } else if (smallTwice && path[0] !== true) {
        // since we don't care about the paths themselves, tack a flag at the front
        // of the seen array when we add our second 'small' node
        stack.push([true, ...path, n]);
      }
    }
  }

  return count;
}

const partOne = countThroughPaths(false);
console.log("part one", partOne, partOne === 5157);

const partTwo = countThroughPaths(true);
console.log("part two", partTwo, partTwo === 144309);
