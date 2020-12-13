const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// wdugfj (72519) -> qdqkaw, xfcoi, rtydk, kbbgkmr, uxsrdpn
function parseLine(line) {
  const [first, subs] = line.split(" -> ");
  const [_, name, weight] = first.match(/^([a-z]+) \((\d+)\)$/);

  return {
    name,
    weight: parseInt(weight),
    totalWeight: 0,
    subs: subs ? subs.split(", ") : [],
  };
}

const parsed = input.map(parseLine);
const s = new Set(parsed.map((node) => node.name));
parsed.forEach((node) => node.subs.forEach((sub) => s.delete(sub)));
const partOne = [...s.values()][0];
console.log("part one", partOne); // mkxke

const map = lodash.keyBy(parsed, "name");

function totalWeight(name) {
  const node = map[name];
  if (!node.totalWeight) {
    node.totalWeight = node.subs.reduce(
      (acc, sub) => acc + totalWeight(sub),
      node.weight
    );
  }
  return node.totalWeight;
}

// populate total weights
totalWeight(partOne);

const unbalanced = parsed.filter((node) => {
  const subWeights = node.subs.map((sub) => map[sub].totalWeight);
  return new Set(subWeights).size > 1;
});

const topUnbalanced = lodash.sortBy(unbalanced, "totalWeight")[0];
const subWeights = topUnbalanced.subs
  .map((sub) => map[sub].totalWeight)
  .sort((a, b) => a - b);
const oddWeight =
  subWeights[0] === subWeights[1] ? subWeights.pop() : subWeights.shift();
const weightDiff = oddWeight - subWeights[0];
const badBoy = topUnbalanced.subs.find(
  (sub) => map[sub].totalWeight === oddWeight
);
// console.log(subWeights, oddWeight, weightDiff, badBoy, map[badBoy].weight)

const partTwo = map[badBoy].weight - weightDiff;
console.log("part two", partTwo); // gexwzw 277 - 9 = 268
