const Iter = require("es-iter");
const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
// const input = readFile(__dirname, "./sample.txt");

const [inputTop, inputBottom] = input.join("\n").split("\n\n");
const receivedMessages = inputBottom.split("\n");
const rules = [];
let doingPartTwo = false;
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

  if (doingPartTwo && (ruleIdx === 31 || ruleIdx === 42)) {
    yield ruleIdx.toString();
    // yield xxx[ruleIdx];
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

const patterns31 = [...genPatterns(31)];
const patterns42 = [...genPatterns(42)];
const _xxx = {
  31: `(?:${patterns31.join("|")})+`,
  42: `(?:${patterns42.join("|")})+`,
};

console.log(patterns31, patterns31.length);
console.log(patterns42, patterns42.length);
console.log(lodash.intersection(patterns31, patterns42)); // []
console.log(lodash.countBy(patterns31, "length"));
console.log(lodash.countBy(patterns42, "length"));

function _countValidMessages() {
  const validPatterns = [...genPatterns(0)];
  // console.log(validPatterns.length)
  // console.log(lodash.countBy(validPatterns, 'length'))
  // console.log(validPatterns)
  // const regexs = validPatterns.map(pattern => new RegExp(`^${pattern}$`));
  // const validMessages = receivedMessages.filter((message) => {
  //     return regexs.some(regex => regex.test(message));
  //   }
  // );
  const validMessages = receivedMessages.filter((message) =>
    validPatterns.includes(message),
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
const aaa = receivedMessages.filter((message) => {
  const r = [0, 0];
  for (let i = 0; i < message.length; i += 8) {
    const sub = message.substring(i, i + 8);
    if (patterns42.includes(sub)) ++r[0];
    else if (patterns31.includes(sub)) ++r[1];
    else return false;
  }
  return r[0] === 2 && r[1] === 1;
});

// const partOne = countValidMessages();
const partOne = aaa.length;
console.log("part one", partOne); // 126

const _longerMessages = receivedMessages.filter(
  (message) => message.length > 24,
);
// console.log("#####", byL.length)

doingPartTwo = true;
const validPatterns = [...genPatterns(0)];
console.log(validPatterns.length);
console.log(lodash.countBy(validPatterns, "length"));
// console.log(validPatterns)

// 0: 8 11
// 8: 42
// 11: 42 31
// 8: 42 | 42 8
// 11: 42 31 | 42 11 31
// rules[8] = [[42], [42, 8]];
// rules[11] = [
//   [42, 31],
//   [42, 11, 31],
// ];

// 42 42 31

const bbb = receivedMessages.filter((message) => {
  const r = [0, 0];
  let f = true;
  for (let i = 0; i < message.length; i += 8) {
    const sub = message.substring(i, i + 8);
    if (f && patterns42.includes(sub)) {
      ++r[0];
    } else {
      f = false;
      if (patterns31.includes(sub)) ++r[1];
      else return false;
    }
  }
  return r[0] >= 2 && r[1] >= 1 && r[0] > r[1];
});

const partTwo = bbb.length;
console.log("part two", partTwo); // 282
