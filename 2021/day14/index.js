const readFile = require("../../helpers/readFile");
const DefaultDict = require("../../helpers/defaultdict");

const [tmpl, _, ...rawRules] = readFile(__dirname, "./input.txt");

const rules = new Map(rawRules.map((line) => line.split(" -> ")));

function process(steps) {
  let counts = new DefaultDict(0);
  for (let i = 0; i < tmpl.length - 1; i++) {
    const pair = tmpl.substring(i, i + 2);
    counts[pair]++;
  }

  for (let i = 0; i < steps; i++) {
    let newCounts = new DefaultDict(0);
    for (const [pair, cnt] of Object.entries(counts)) {
      newCounts[pair[0] + rules.get(pair)] += cnt;
      newCounts[rules.get(pair) + pair[1]] += cnt;
    }
    counts = newCounts;
  }

  const finalCounts = new DefaultDict(0);
  for (const [key, cnt] of Object.entries(counts)) {
    // only count the char, otherwise we'd double count the lot
    finalCounts[key[0]] += cnt;
  }
  // the last char in the template would stay the last char in the final string,
  // but wouldn't be counted using the loop above, so make sure to include it.
  finalCounts[tmpl[tmpl.length - 1]]++;

  const nums = Object.values(finalCounts);
  return Math.max(...nums) - Math.min(...nums);
}

const partOne = process(10);
console.log("part one", partOne, partOne === 2975);

const partTwo = process(40);
console.log("part two", partTwo, partTwo === 3015383850689);
// 77ms
