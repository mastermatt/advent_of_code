const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const [tmpl, _, ...rawRules] = readFile(__dirname, "./example.txt");
// const [tmpl, _, ...rawRules] = readFile(__dirname, "./input.txt");

const rules = Object.fromEntries(rawRules.map((line) => line.split(" -> ")));

console.log(rules);

// NNCB
//
// CH -> B
// HH -> N
// CB -> H
// NH -> C
// HB -> C
// HC -> B
// HN -> C
// NN -> C
// BH -> H
// NC -> B
// NB -> B
// BN -> B
// BB -> N
// BC -> B
// CC -> N
// CN -> C

// B C N H

function step(template) {
  const result = [];
  let prev = ".";
  for (const char of template) {
    const key = prev + char;
    // console.log(key, found);
    result.push(rules[key], char);
    prev = char;
  }

  return result.join("");
}

let x = tmpl;

for (let i = 0; i < 10; i++) {
  x = step(x);
}

const y = Object.values(lodash.countBy(x)).sort((a, b) => a - b);
const partOne = y[y.length - 1] - y[0];
console.log("part one", partOne, partOne === 2975);

x = tmpl;

// for (let i = 0; i < 15; i++) {
//   x = step(x);
//   console.log("######", i, x.length, lodash.countBy(x));
// }

const z = Object.values(lodash.countBy(x)).sort((a, b) => a - b);
const partTwo = z[z.length - 1] - z[0];
console.log("part two", partTwo, partTwo === 2188189693529);

console.log(lodash.countBy(Object.values(rules)));

// B 2192039569602
// H    3849876073

let counts = {};

for (let i = 0; i < tmpl.length - 1; i++) {
  const k = tmpl.substring(i, i + 2);
  counts[k] |= 0;
  counts[k]++;
  // counts[k] = counts[k] ? counts[k]+1 : 1
}

console.log("counts", counts);

for (let i = 0; i < 5; i++) {
  const next = {};
  for (const [key, cnt] of Object.entries(counts)) {
    const a = key[0] + rules[key];
    next[a] |= 0;
    next[a] += cnt;
    const b = rules[key] + key[1];
    next[b] |= 0;
    next[b] += cnt;
    console.log("####", key, cnt, a, b);
  }
  counts = next;
  console.log("counts", i, counts);
}
