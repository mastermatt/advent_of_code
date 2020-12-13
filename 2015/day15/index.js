const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// Frosting: capacity 4, durability -2, flavor 0, texture 0, calories 5
const parseLine = (line) => {
  const rawAttrs = line.split(": ")[1];
  const attrs = rawAttrs.split(", ").map((attr) => {
    const [key, val] = attr.split(" ");
    return [key, parseInt(val)];
  });
  return Object.fromEntries(attrs);
};

const ing = input.map(parseLine); // ingredients
const attrs = lodash.pull(Object.keys(ing[0]), "calories");

function* genDistribution() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100 - i; j++) {
      for (let k = 0; k < 100 - i - j; k++) {
        yield [i, j, k, 100 - i - j - k];
      }
    }
  }
}

let highScore = 0;
let highDietScore = 0;

for (const dist of genDistribution()) {
  const score = attrs
    .map((attr) => {
      const scores = dist.map((amount, idx) => ing[idx][attr] * amount);
      return Math.max(0, lodash.sum(scores));
    })
    .reduce((a, b) => a * b);

  highScore = Math.max(highScore, score);

  const calories = dist.map((amount, idx) => ing[idx].calories * amount);
  if (lodash.sum(calories) === 500) {
    highDietScore = Math.max(highDietScore, score);
  }
}

const partOne = highScore;
console.log("part one", partOne); // 18965440

const partTwo = highDietScore;
console.log("part two", partTwo); // 15862900
