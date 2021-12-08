const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// const input = readFile(__dirname, "./example.txt").map((line) => {
const input = readFile(__dirname, "./input.txt").map((line) => {
  return line.split(" | ").map((chunk) => chunk.split(" "));
});

function sortWord(word) {
  return word.split("").sort().join("");
}

// chars in first string not in second string
function diffChars(one, two) {
  return one
    .split("")
    .filter((c) => !two.includes(c))
    .join("");
}

function signalsToMap(rawSignals) {
  const signals = rawSignals.map(sortWord);

  const one = signals.find((x) => x.length === 2);
  const seven = signals.find((x) => x.length === 3);
  const four = signals.find((x) => x.length === 4);
  const eight = signals.find((x) => x.length === 7);

  const counts = lodash.countBy(signals.join(""));
  const eeee = lodash.invert(counts)["4"];
  const ffff = lodash.invert(counts)["9"];

  const two = signals.find((x) => !x.includes(ffff));
  const three = signals.find(
    (x) => x.length === 5 && !diffChars(one, x).length
  );
  const five = signals.find((x) => x.length === 5 && ![two, three].includes(x));
  const six = signals.find((x) => x.length === 6 && diffChars(one, x).length);
  const zero = signals.find(
    (x) => x.includes(eeee) && ![two, six, eight].includes(x)
  );
  const nine = signals.find((x) => x.length === 6 && ![zero, six].includes(x));

  return {
    [zero]: "0",
    [one]: "1",
    [two]: "2",
    [three]: "3",
    [four]: "4",
    [five]: "5",
    [six]: "6",
    [seven]: "7",
    [eight]: "8",
    [nine]: "9",
  };
}

function outputToNumber(rawOutput, signalMap) {
  const output = rawOutput.map(sortWord);
  const num = output.map((word) => signalMap[word]).join("");
  return Number(num);
}

// const e = "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab".split(
//   " "
// );
// const o = "cdfeb fcadb cdfeb cdbaf".split(" ");
// console.log(
//   "############",
//   signalsToMap(e),
//   outputToNumber(o, signalsToMap(e))
// );

// const p = []
//
// const one = e.find(x => x.length === 2)
// const seven = e.find(x => x.length === 3)
// const four = e.find(x => x.length === 4)
// const eight = e.find(x => x.length === 7)
// const fortySeven = new Set(four + seven)
//
// const len5 = e.filter(x => x.length === 5)
// const len6 = e.filter(x => x.length === 6)
//
// const counts = lodash.countBy(e.join(''))
//
// p[0] = lodash.difference(seven.split(''), one.split(''))[0]
// p[1] = lodash.invert(counts)['6']
//
// p[4] = lodash.invert(counts)['4']
// p[5] = lodash.invert(counts)['9']
//
// p[3] = p[5] === one[0] ? one[1] : one[0]
//
//
//
// const zzz = len6.map(word => word.split('').filter(char => !fortySeven.has(char)).join(''))
// p[6] = zzz.find(x => x.length === 1)
//
// p[2] = lodash.difference(['a', 'b', 'c', 'd', 'e', 'f', 'g'], p)[0]

// 0 takes 6
// 1 takes 2
// 2 takes 5
// 3 takes 5
// 4 takes 4
// 5 takes 5
// 6 takes 6
// 7 takes 3
// 8 takes 7
// 9 takes 6

// a - 8
// b - 6
// c - 8
// d - 7
// e - 4
// f - 9
// g - 7

//   0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....
//
//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg

const uniqueLengths = [2, 4, 3, 7];
let a = 0;
for (const [_, output] of input) {
  for (const word of output) {
    if (uniqueLengths.includes(word.length)) {
      a++;
    }
  }
}

const partOne = a;
console.log("part one", partOne, partOne === 342);

const outputVals = input.map(([signals, output]) =>
  outputToNumber(output, signalsToMap(signals))
);

const partTwo = lodash.sum(outputVals);
console.log("part two", partTwo, partTwo === 1068933);
