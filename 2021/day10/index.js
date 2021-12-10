const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const opening = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};
const closing = lodash.invert(opening);

const illegalChars = [];
const completionChars = [];

function processLine(line) {
  const queue = [];

  for (const char of line) {
    if (closing[char]) {
      const last = queue.pop();
      if (last !== closing[char]) {
        illegalChars.push(char);
        return;
      }
    } else {
      queue.push(char);
    }
  }

  const completion = queue.reverse().map((char) => opening[char]);
  completionChars.push(completion);
}

input.map(processLine);

const points1 = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const partOne = lodash.sum(illegalChars.map((char) => points1[char]));
console.log("part one", partOne, partOne === 389589);

// Start with a total score of 0. Then, for each character, multiply the total
// score by 5 and then increase the total score by the point value given for the character in the following table:
const points2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};
const scores = completionChars
  .map((chars) => {
    let score = 0;
    for (const char of chars) {
      score *= 5;
      score += points2[char];
    }
    return score;
  })
  .sort((a, b) => a - b);

const partTwo = scores[(scores.length / 2) | 0];
console.log("part two", partTwo, partTwo === 1190420163);
