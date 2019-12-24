const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("");

const freq = input.reduce((acc, newFreq) => {
  acc += parseInt(newFreq);
  return acc;
}, 0);

console.log("part one", freq); // 533

const partTwo = () => {
  const seen = new Set([0]);
  let current = 0;

  while (true) {
    for (const newFreq of input) {
      current += parseInt(newFreq);
      if (seen.has(current)) {
        return current;
      }
      seen.add(current);
    }
  }
};

console.log("part two", partTwo()); // 73272
