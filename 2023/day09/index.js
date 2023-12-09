const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const dataset = input.map((line) => line.split(" ").map(Number));

function predict(history) {
  let before = 0;
  let after = 0;
  let cnt = 0;

  while (history.some((val) => val !== 0)) {
    before += cnt % 2 ? -history[0] : history[0];
    after += history[history.length - 1];

    for (let i = 0, j = 1; j < history.length; ++i, ++j) {
      history[i] = history[j] - history[i];
    }

    --history.length;
    ++cnt;
  }

  return [before, after];
}

const predictions = dataset.map(predict); // ~1.6ms

const partOne = lodash.sumBy(predictions, "1");
console.log("part one", partOne, partOne === 2105961943);

const partTwo = lodash.sumBy(predictions, "0");
console.log("part two", partTwo, partTwo === 1019);
