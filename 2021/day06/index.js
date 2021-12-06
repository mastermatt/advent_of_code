const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

// keep track of how many fish, on each day of the week, will spawn (double)
const days = [0n, 0n, 0n, 0n, 0n, 0n, 0n];
// new spawn can't be added to the list above until they've waited out their extra two days
const spawns = [0n, 0n, 0n, 0n, 0n, 0n, 0n];

for (const x of input) {
  days[x]++;
}

for (let i = 0; i < 80; i++) {
  spawns[(i + 2) % 7] = days[i % 7];
  days[i % 7] += spawns[i % 7];
  spawns[i % 7] = 0n;
}

const partOne = lodash.sum(days.concat(spawns));
console.log("part one", partOne, partOne === 390923n);

// same bit of code in loop, just different `i` bounds.
// not refactoring guts into a function for speed.
for (let i = 80; i < 256; i++) {
  spawns[(i + 2) % 7] = days[i % 7];
  days[i % 7] += spawns[i % 7];
  spawns[i % 7] = 0n;
}

const partTwo = lodash.sum(days.concat(spawns));
console.log("part two", partTwo, partTwo === 1749945484935n);
