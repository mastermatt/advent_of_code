const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./example.txt");
const input = readFile(__dirname, "./input.txt");

const closing = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
};

const opening = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
};

function firstIllegalChar(line) {
  const queue = [];

  for (const char of line) {
    if (closing[char]) {
      const last = queue.pop();
      if (last !== closing[char]) return char;
    } else {
      queue.push(char);
    }
  }
}

const points = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};
let score = 0;

for (const line of input) {
  const char = firstIllegalChar(line);
  if (char) {
    score += points[char];
  }
}

const partOne = score;
console.log("part one", partOne, partOne === 389589);

function completionChars(line) {
  const queue = [];

  for (const char of line) {
    if (closing[char]) {
      const last = queue.pop();
      if (last !== closing[char]) return null;
    } else {
      queue.push(char);
    }
  }

  return queue.reverse().map((char) => opening[char]);
}

// Start with a total score of 0. Then, for each character, multiply the total
// score by 5 and then increase the total score by the point value given for the character in the following table:
const points2 = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};
const scores = [];
for (const line of input) {
  const chars = completionChars(line);
  if (chars) {
    score = 0;
    for (const char of chars) {
      score *= 5;
      score += points2[char];
    }

    scores.push(score);
  }
}

scores.sort((a, b) => a - b);

const partTwo = scores[(scores.length / 2) | 0];
console.log("part two", partTwo, partTwo === 1190420163);
