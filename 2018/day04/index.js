const lodash = require("lodash");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").sort();
const map = new DefaultDict(Array);

let id = "";
for (let i = 0; i < input.length; ++i) {
  const idMatch = input[i].match(/#(\d+)/);

  if (idMatch) {
    id = idMatch[1];
  } else {
    const a = parseInt(input[i].slice(15, 17));
    const b = parseInt(input[++i].slice(15, 17));
    map[id].push([a, b, b - a]);
  }
}

const totalTimes = Object.entries(map).map(([key, times]) => [
  key,
  lodash.sumBy(times, "2")
]);
const sortedTimes = totalTimes.sort((a, b) => b[1] - a[1]);
const mostSleepId = sortedTimes[0][0];

function maxMinute(times) {
  const sleepingMins = times.map(([from, to]) => lodash.range(from, to)).flat();
  const countedMins = lodash.countBy(sleepingMins);
  const sorted = Object.entries(countedMins).sort((a, b) => b[1] - a[1]);
  return sorted[0];
}

const partOne = mostSleepId * maxMinute(map[mostSleepId])[0];
console.log("part one", partOne); // 142515

let maxCnt = 0;
let partTwo = 0;
Object.entries(map).map(([id, times]) => {
  const [min, cnt] = maxMinute(times);

  if (cnt > maxCnt) {
    maxCnt = cnt;
    partTwo = id * min;
  }
});

console.log("part two", partTwo); // 5370
