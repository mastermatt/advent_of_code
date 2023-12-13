// heavily borrowed from https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161

const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const parsedInput = input.map((line) => {
  const [pattern, numsStr] = line.split(" ");
  const nums = numsStr.split(",").map(Number);
  return [pattern, nums];
});

const countPossibles = lodash.memoize(
  (line, runs) => {
    // trim any leading '.'
    while (line[0] === ".") line = line.slice(1);

    if (line.length === 0) {
      return runs.length === 0 ? 1 : 0;
    }
    if (runs.length === 0) {
      return line.includes("#") ? 0 : 1;
    }
    if (line.length < lodash.sum(runs) + runs.length - 1) {
      // The line is not long enough for all runs
      return 0;
    }

    if (line[0] === "#") {
      const [run, ...leftoverRuns] = runs;

      if (line.substring(0, run).includes(".") || line[run] === "#") return 0;

      return countPossibles(line.slice(run + 1), leftoverRuns);
    }

    // First char === '?'. Branch and count both options
    return (
      countPossibles("#" + line.slice(1), runs) +
      countPossibles(line.slice(1), runs) // don't both prefixing the '.', it will be ignored
    );
  },
  (...args) => String(args),
);

function countAllPossibles(records) {
  let cnt = 0;
  for (const [line, runs] of records) {
    cnt += countPossibles(line, runs);
  }

  return cnt;
}

const partOne = countAllPossibles(parsedInput);
console.log("part one", partOne, partOne === 6958); //  ~17ms

const expandedRecords = parsedInput.map(([line, runs]) => [
  lodash.times(5, () => line).join("?"),
  lodash.times(5, () => runs).flat(),
]);

const partTwo = countAllPossibles(expandedRecords);
console.log("part two", partTwo, partTwo === 6555315065024); // ~290ms
