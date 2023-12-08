const readFile = require("../../helpers/readFile");
const { lcm } = require("../../helpers/math");

const input = readFile.doubleSplit(__dirname, "./input.txt");

const instructions = input[0][0];
const network = {};

for (const line of input[1]) {
  const [_, start, left, right] = line.match(/(\w+) = \((\w+), (\w+)\)/);
  network[start] = [left, right];
}

let currNode = "AAA";
let numSteps = 0;

while (currNode !== "ZZZ") {
  const dir = instructions[numSteps % instructions.length];
  currNode = network[currNode][dir === "L" ? 0 : 1];

  ++numSteps;
}

const partOne = numSteps;
console.log("part one", partOne, partOne === 20777); // ~0.9ms

const startingNodes = Object.keys(network).filter((node) => node.endsWith("A"));

const loopLengths = startingNodes.map((node) => {
  let i = 0;
  while (node[2] !== "Z") {
    const dir = instructions[i++ % instructions.length];
    node = network[node][dir === "L" ? 0 : 1];
  }
  return i;
});

const partTwo = lcm(...loopLengths);
console.log("part two", partTwo, partTwo === 13289612809129); // ~5.75ms
