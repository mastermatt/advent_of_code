const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => {
  return line.split(" | ").map((chunk) => chunk.split(" "));
});

function sortWord(word) {
  return word.split("").sort().join("");
}

function intersectionCount(one, two) {
  return lodash.intersection(one.split(""), two.split("")).length;
}

function signalsToMap(rawSignals) {
  const signals = rawSignals.map(sortWord);

  function find(len, intersection, interLen) {
    const found = signals.find((signal) => {
      if (signal.length !== len) return false;
      if (intersection) {
        return intersectionCount(signal, intersection) === interLen;
      }
      return true;
    });

    lodash.pull(signals, found); // remove by value, mutates
    return found;
  }

  const digits = [];
  digits[1] = find(2);
  digits[7] = find(3);
  digits[4] = find(4);
  digits[2] = find(5, digits[4], 2);
  digits[3] = find(5, digits[1], 2);
  digits[5] = find(5);
  digits[9] = find(6, digits[4], 4);
  digits[0] = find(6, digits[1], 2);
  digits[6] = find(6);
  digits[8] = find(7);

  return lodash.invert(digits);
}

function outputToDigits(rawOutput, signalMap) {
  const output = rawOutput.map(sortWord);
  return output.map((word) => signalMap[word]);
}

const outputDigits = input.map(([signals, output]) =>
  outputToDigits(output, signalsToMap(signals))
);

const desiredDigits = ["1", "4", "7", "8"];
const desiredDigitInstances = outputDigits
  .map((digits) => digits.filter((digit) => desiredDigits.includes(digit)))
  .flat();

const partOne = desiredDigitInstances.length;
console.log("part one", partOne, partOne === 342);

const outputNums = outputDigits.map((digits) => Number(digits.join("")));
const partTwo = lodash.sum(outputNums);
console.log("part two", partTwo, partTwo === 1068933);
