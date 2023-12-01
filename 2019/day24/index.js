const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const adjacentDeltas = require("./adjacentDeltas");

const BUG = "#";
const SPACE = ".";

const input = readFile(__dirname, "./input.txt");
const gridWidth = input[0].length;
const flatMap = input.join("").split("");

const printState = (data) => {
  lodash.chunk(data, gridWidth).forEach((line) => console.log(line.join("")));
  console.log(" ");
};

const printAllStates = (levels) =>
  levels.forEach((level, idx) => {
    console.log("Depth", idx - ((levels.length / 2) | 0));
    printState(level);
    console.log(" ");
  });

printState(flatMap);

// Initial state:
// ....#
// #..#.
// #..##
// ..#..
// #....
//
// After 1 minute:
// #..#.
// ####.
// ###.#
// ##.##
// .##..
//
// Each minute, The bugs live and die based on the number of bugs in the four adjacent tiles:
// - A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
// - An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.

const countBugs = (dataArr) => dataArr.filter((char) => char === BUG).length;

const nextChar = (currentChar, adjacentBugCount) => {
  if (currentChar === BUG) {
    return adjacentBugCount === 1 ? BUG : SPACE;
  }
  return adjacentBugCount === 1 || adjacentBugCount === 2 ? BUG : SPACE;
};

const numAdjacentBugs = (data, idx) => {
  return countBugs([
    data[idx - gridWidth],
    idx % gridWidth === 0 ? SPACE : data[idx - 1],
    idx % gridWidth === gridWidth - 1 ? SPACE : data[idx + 1],
    data[idx + gridWidth],
  ]);
};

const findFirstRepeat = (data) => {
  const seen = new Set();

  while (true) {
    const str = data.join("");
    if (seen.has(str)) {
      return data;
    }
    seen.add(str);
    data = data.map((char, idx) => nextChar(char, numAdjacentBugs(data, idx)));
    // printState(data)
  }
};

const biodiversityRating = (data) =>
  data.reduce((acc, char, idx) => acc + (char === BUG ? 1 << idx : 0), 0);

const firstRepeat = findFirstRepeat(flatMap);
const partOne = biodiversityRating(firstRepeat);
console.log("part one", partOne); // 28903899

const nextStepRecursive = (current) => {
  const destination = current.map(() => []);

  destination.forEach((level, li) => {
    adjacentDeltas.forEach((deltas, pi) => {
      const deltaCb = ([shift, jump]) => (current[li + jump] || [])[pi + shift];
      const adjacentBugs = countBugs(deltas.map(deltaCb));

      destination[li][pi] = nextChar(current[li][pi], adjacentBugs);
    });
  });

  return destination;
};

const expandLevels = (levels) => {
  if (countBugs(levels[0])) {
    levels.unshift([]);
  }
  if (countBugs(lodash.last(levels))) {
    levels.push([]);
  }
  return levels;
};

const countBugsAcrossLevels = (levels) => {
  return levels.reduce((acc, level) => acc + countBugs(level), 0);
};

const two = (startingData, repetitions, print = false) => {
  const levels = lodash
    .range(repetitions)
    .reduce(
      (levels) => nextStepRecursive(expandLevels(levels)),
      [startingData],
    );

  if (print) {
    printAllStates(levels);
  }

  return countBugsAcrossLevels(levels);
};

const partTwo = two(flatMap, 200);
console.log("part two", partTwo); // 1896
