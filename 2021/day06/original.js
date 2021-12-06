const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./example.txt")[0].split(',').map(Number);
const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);
// Each day, a 0 becomes a 6 and adds a new 8 to the end of the list,
// while each other number decreases by 1 if it was present at the start of the day.
const fish = [...input];
// console.log('initial state', fish.join(','));
for (let i = 0; i < 80; i++) {
  const l = fish.length;
  for (let j = 0; j < l; j++) {
    if (fish[j] === 0) {
      fish[j] = 6;
      fish.push(8);
    } else {
      fish[j]--;
    }
  }
  // console.log(i, fish.join(','));
}

const partOne = fish.length;
console.log("part one", partOne, partOne === 390923); // no 13117650

// 256 days
//36*7 == 252
// 2^32 == 4294967296
// 2^33 == 8589934592
// 2^34 == 17179869184
// 2^35 == 34359738368
// 2^36 == 68719476736
// 2^37 == 137438953472

// const ex = [3,4,3,1,2]
// const days = [0n,1n,1n,2n,1n,0n,0n]
const days = [0n, 0n, 0n, 0n, 0n, 0n, 0n];

for (const x of input) {
  days[x]++;
}
// console.log('######### this?', days);

const news = [0n, 0n, 0n, 0n, 0n, 0n, 0n];

for (let i = 0; i < 256; i++) {
  news[(i + 2) % 7] = days[i % 7];
  days[i % 7] += news[i % 7];
  news[i % 7] = 0n;
}

// 26984457539 expected (example)
const partTwo = lodash.sum(days) + lodash.sum(news);
console.log("part two", partTwo, partTwo === 1749945484935n);
