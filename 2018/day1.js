const fs = require("fs");

const input = fs
  .readFileSync("day1_input.txt")
  .toString()
  .split("\n");

const freq = input.reduce((acc, newFreq) => {
  acc += parseInt(newFreq);
  return acc;
}, 0);


console.log(freq); // 533

const xxx = () => {
    const seen = new Set([0])
    let current = 0

    while (true) {
        for (const newFreq of input) {
            current += parseInt(newFreq);
            if(seen.has(current)) {
                return current
            }
            seen.add(current);
        }
    }
}

console.log("########### dup", xxx()) // 73272

