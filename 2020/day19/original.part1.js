const Iter = require("es-iter");
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./input.txt")
const input = readFile(__dirname, "./sample.txt");

const [inputTop, inputBottom] = input.join("\n").split("\n\n");
const receivedMessages = inputBottom.split("\n");
const rules = [];
// 0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: "a"
// 5: "b"
inputTop.split("\n").forEach((line) => {
  const [idx, rest] = line.split(": ");
  rules[idx] =
    rest[0] === '"'
      ? [true, rest[1]]
      : rest.split(" | ").map((a) => a.split(" ").map(Number));
});

function* genPatterns(ruleIdx) {
  const rule = rules[ruleIdx];

  if (rule[0] === true) {
    yield rule[1];
    return;
  }

  for (const subRule of rule) {
    const gens = subRule.map(genPatterns);

    // pulling off the first generator is only required to work with a quirk of the es-iter api
    const firstGen = gens.shift();

    if (gens.length === 0) {
      yield* firstGen;
    } else {
      yield* new Iter(firstGen)
        .product(...gens)
        .map((results) => results.join(""));
    }
  }
}

// console.log(...genPatterns(0))
// aaaabb, aaabab, abbabb, abbbab, aabaab, aabbbb, abaaab, or ababbb.

// console.log(x)
// console.log("#####", x.length)

function countValidMessages() {
  const validPatterns = [...genPatterns(31)];
  console.log(validPatterns.length);
  console.log(validPatterns);
  const validMessages = receivedMessages.filter((message) =>
    validPatterns.includes(message)
  );
  return validMessages.length;
}

// 42 => 16
// [
//   'babbb', 'baabb', 'bbaab',
//   'bbabb', 'bbbab', 'bbbbb',
//   'abbbb', 'aabbb', 'aaaab',
//   'aaabb', 'aaaba', 'ababa',
//   'bbbba', 'aaaaa', 'baaaa',
//   'bbaaa'
// ]

// 31 => 16
// [
//   'bbaba', 'bbbaa', 'babab',
//   'babaa', 'babba', 'baaba',
//   'baaab', 'ababb', 'abaab',
//   'abbab', 'abaaa', 'abbaa',
//   'abbba', 'aabab', 'aabaa',
//   'aabba'
// ]

// const partOne = countValidMessages();
// console.log("part one", partOne); // 126

// 8: 42 | 42 8
// 11: 42 31 | 42 11 31
rules[8] = [[42], [42, 8]];
rules[11] = [
  [42, 31],
  [42, 11, 31],
];
// const partTwo = countValidMessages();
// console.log("part two", partTwo); //
