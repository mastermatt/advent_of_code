const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const adjacentDeltas = require("./adjacentDeltas");

const BUG = "#";
const SPACE = ".";

// const input = readFile(__dirname, "./sample.txt");
const input = readFile(__dirname, "./input.txt");
const gridWidth = input[0].length;
const flatMap = input.join("").split("");
const printState = data => {
  lodash.chunk(data, gridWidth).forEach(line => console.log(line.join("")));
  console.log(" ");
};

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

const isBug = char => char === BUG;

const numAdjacentBugs = (data, idx) => {
  return [
    data[idx - gridWidth],
    idx % gridWidth === 0 ? SPACE : data[idx - 1],
    idx % gridWidth === gridWidth - 1 ? SPACE : data[idx + 1],
    data[idx + gridWidth]
  ].filter(char => char === BUG).length;
};

const nextChar = (currentChar, adjacentBugCount) => {
  if (currentChar === BUG) {
    return adjacentBugCount === 1 ? BUG : SPACE;
  }
  return adjacentBugCount === 1 || adjacentBugCount === 2 ? BUG : SPACE;
};

const nextStep = data =>
  data.map((char, idx) => {
    const adjacentBugs = numAdjacentBugs(data, idx);
    // console.log(idx, char, adjacentBugs, newChar);
    return nextChar(char, adjacentBugs);
  });

const findFirstRepeat = data => {
  const seen = new Set();

  while (true) {
    const str = data.join("");
    if (seen.has(str)) {
      return data;
    }
    seen.add(str);
    data = nextStep(data);
    // printState(data)
  }
};

const biodiversityRating = data =>
  data.reduce((acc, char, idx) => acc + (char === BUG ? 1 << idx : 0), 0);

printState(flatMap);
const firstRepeat = findFirstRepeat(flatMap);
// printState(firstRepeat);

const partOne = biodiversityRating(firstRepeat);
console.log("part one", partOne); // 28903899

const nextStepRecursive = current => {
  const destination = current.map(() => []);

  destination.forEach((level, levelIdx) => {
    adjacentDeltas.forEach((deltas, posIdx) => {
      const adjacentBugs = deltas
        .map(
          ([shift, jump]) => (current[levelIdx + jump] || [])[posIdx + shift]
        )
        .filter(char => char === BUG).length;

      destination[levelIdx][posIdx] = nextChar(
        current[levelIdx][posIdx],
        adjacentBugs
      );
    });
  });

  return destination;
};

const countBugs = levels => {
  return levels.reduce(
    (acc, level) => acc + level.filter(char => char === BUG).length,
    0
  );
};

const two = (startingData, repetitions) => {
  let levels = [startingData];

  for (let i = 0; i < repetitions; i++) {
    if (levels[0].some(isBug)) {
      levels.unshift([]);
    }
    if (lodash.last(levels).some(isBug)) {
      levels.push([]);
    }
    levels = nextStepRecursive(levels);
  }

  // levels.forEach((level, idx) => {
  //   console.log("Depth", idx - (levels.length / 2 | 0));
  //   printState(level);
  //   console.log(" ");
  // });

  return countBugs(levels);
};

const partTwo = two(flatMap, 200);
console.log("part two", partTwo); // 1896
