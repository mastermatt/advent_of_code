const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const tape = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1
};

// Sue 1: cars: 9, akitas: 3, goldfish: 0
const remembered = input.map(line => {
  return [...line.matchAll(/(\w+): (\d+)/g)].map(match => [
    match[1],
    parseInt(match[2])
  ]);
});

const idx = remembered.findIndex(stuff => {
  return stuff.every(([key, val]) => tape[key] === val);
});

const partOne = idx + 1; // Sue's have a 1 count
console.log("part one", partOne); // 373

const gt = new Set(["cats", "trees"]);
const lt = new Set(["pomeranians", "goldfish"]);

const idx2 = remembered.findIndex(stuff => {
  return stuff.every(([key, val]) => {
    if (gt.has(key)) return val > tape[key];
    if (lt.has(key)) return val < tape[key];
    return tape[key] === val;
  });
});

const partTwo = idx2 + 1;
console.log("part two", partTwo); // 260
