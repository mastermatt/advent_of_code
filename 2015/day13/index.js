const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// Carol would lose 62 happiness units by sitting next to Alice.
const input = readFile(__dirname, "./input.txt");
const map = {};

input.forEach((line) => {
  const matches = line.match(
    /(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\./
  );
  const [subject, dir, num, other] = matches.splice(1, 5);
  const units = parseInt(num) * (dir === "lose" ? -1 : 1);

  if (!map[subject]) map[subject] = {};
  map[subject][other] = units;
});

const addHappiness = (curr, a, b) =>
  curr + ((map[a] || {})[b] || 0) + ((map[b] || {})[a] || 0);

function go() {
  let maxHappiness = 0;
  const names = Object.keys(map);
  const stack = [[[names[0]], 0]];

  while (stack.length) {
    const [seen, happiness] = stack.pop();
    const subject = seen[0];

    if (seen.length === names.length) {
      // remember to calc around the ends
      const last = seen[seen.length - 1];
      const fullHappiness = addHappiness(happiness, subject, last);
      maxHappiness = Math.max(maxHappiness, fullHappiness);
    }

    for (const other of lodash.difference(names, seen)) {
      stack.push([[other, ...seen], addHappiness(happiness, subject, other)]);
    }
  }

  return maxHappiness;
}

const partOne = go();
console.log("part one", partOne); // 618

map.me = {};
const partTwo = go();
console.log("part two", partTwo); // 601
