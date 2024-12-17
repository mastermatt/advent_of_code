const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

const rules = input[0].map((line) =>
  line.split("|").map((str) => parseInt(str)),
);
const updates = input[1].map((line) =>
  line.split(",").map((str) => parseInt(str)),
);

// console.log(rules, updates);

const findBadIdx = (update) => {
  for (let i = 0; i < update.length - 1; i++) {
    const currPage = update[i];
    const laterPages = update.slice(i + 1);
    const requiredEarlierPages = rules
      .filter((rule) => rule[1] === currPage)
      .map((rule) => rule[0]);

    const inter = lodash.intersection(laterPages, requiredEarlierPages);
    if (inter.length > 0) return [i, update.indexOf(inter[0])];
  }
  return null;
};

const isUpdateCorrect = (update) => {
  return findBadIdx(update) === null;
};

const sumMiddles = (updates) => {
  const middleNums = updates.map((update) => update[(update.length / 2) | 0]);

  return lodash.sum(middleNums);
};

const [correctUpdates, incorrectUpdates] = lodash.partition(
  updates,
  isUpdateCorrect,
);

const partOne = sumMiddles(correctUpdates);
console.log("part one", partOne, partOne === 5955);

const orderUpdate = (update) => {
  const result = [...update];

  while (true) {
    const indexes = findBadIdx(result);
    if (indexes === null) break;
    const [i, j] = indexes;
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
};

const reorderedUpdates = incorrectUpdates.map(orderUpdate);
const partTwo = sumMiddles(reorderedUpdates);
console.log("part two", partTwo, partTwo === 4030);
