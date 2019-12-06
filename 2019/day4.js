console.time();
const lodash = require("lodash");

const start = 236491;
const end = 713787;

const ascending = str =>
  str
    .split("")
    .sort()
    .join("") === str;

const hasRepeats = str =>
  lodash.map(lodash.groupBy(str), "length").some(l => l > 1);

const hasDoubles = str =>
  lodash.map(lodash.groupBy(str), "length").some(l => l === 2);

const ascendingVals = lodash
  .range(start, end)
  .map(String)
  .filter(ascending);

console.log("part one:", ascendingVals.filter(hasRepeats).length); // 1169
console.log("part two:", ascendingVals.filter(hasDoubles).length); // 757
console.timeEnd(); // ~380ms
