const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").join("\n");
const groups = input.split("\n\n");

const answerCounts = groups
  .map(group => group.replace(/\s/g, ""))
  .map(group => Object.values(lodash.countBy(group)));
const anyoneAnswered = answerCounts.map(counts => counts.length);

const partOne = lodash.sum(anyoneAnswered);
console.log("part one", partOne); // 6596

const peoplePerGroup = groups.map(g => g.split("\n").length);
const everyoneAnswered = lodash
  .zip(answerCounts, peoplePerGroup)
  .map(([counts, people]) => counts.filter(c => c === people).length);

const partTwo = lodash.sum(everyoneAnswered);
console.log("part two", partTwo); // 3219
