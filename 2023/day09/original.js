const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const dataset = input.map((line) => line.split(" ").map(Number));

function predict(history) {
  const histories = [history];
  let currHistory = history;

  while (currHistory.some((val) => val !== 0)) {
    const newHistory = [];

    for (let i = 0; i < currHistory.length - 1; i++) {
      newHistory.push(currHistory[i + 1] - currHistory[i]);
    }

    histories.push(newHistory);
    currHistory = newHistory;
  }

  return lodash.sum(histories.map((history) => history[history.length - 1]));
}

const partOne = lodash.sum(dataset.map(predict));
console.log("part one", partOne, partOne === 2105961943); // ~2.2ms

function predictFirst(history) {
  const histories = [history];
  let currHistory = history;

  while (currHistory.some((val) => val !== 0)) {
    const newHistory = [];

    for (let i = 0; i < currHistory.length - 1; i++) {
      newHistory.push(currHistory[i + 1] - currHistory[i]);
    }

    histories.push(newHistory);
    currHistory = newHistory;
  }
  const firsts = histories.map((history) => history[0]);

  return firsts.reduce((acc, curr, idx) => (idx % 2 ? acc - curr : acc + curr));
}

const partTwo = lodash.sum(dataset.map(predictFirst));
console.log("part two", partTwo, partTwo === 1019); // ~1.9ms
