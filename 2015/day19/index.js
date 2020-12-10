const readFile = require("../../helpers/readFile");
const DefaultDict = require("../../helpers/defaultdict");

const input = readFile(__dirname, "./input.txt");

const medicineMolecule = input.pop();
const replacements = new DefaultDict(Array);

// Al => ThRnFAr
input.filter(Boolean).forEach(line => {
  const [from, to] = line.split(" => ");
  replacements[from].push(to);
});

const regexp = new RegExp(Object.keys(replacements).join("|"), "g");

const molecules = new Set();
for (const match of medicineMolecule.matchAll(regexp)) {
  const found = match[0];
  const front = medicineMolecule.substring(0, match.index);
  const back = medicineMolecule.substring(match.index + found.length);
  for (const sub of replacements[found]) {
    molecules.add(`${front}${sub}${back}`);
  }
}

const partOne = molecules.size;
console.log("part one", partOne); // 535

// I attempted to brute force this a couple different ways before I decided there was a trick
// that I wasn't seeing. So I looked it up! This is a great explanation:
// https://www.reddit.com/r/adventofcode/comments/3xflz8/day_19_solutions/cy4etju
const partTwo =
  medicineMolecule
    .replace(/Rn|Ar/g, "")
    .replace(/[a-z]/g, "")
    .replace(/Y./g, "").length - 1;

console.log("part two", partTwo); // 212
