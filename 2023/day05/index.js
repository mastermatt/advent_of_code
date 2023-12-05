const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");
const [firstGroup, ...otherGroups] = input;

const seeds = firstGroup[0].split(": ").pop().split(" ").map(Number);
const allMaps = otherGroups.map(([_, ...lines]) =>
  lines.map((line) => line.split(" ").map(Number)),
);

// a map contains three numbers: the destination range start, the source range start, and the range length
function step(val, maps) {
  for (const [destStart, sourceStart, len] of maps) {
    if (val >= sourceStart && val < sourceStart + len) {
      return destStart + (val - sourceStart);
    }
  }

  return val;
}

const distances = seeds.map((seed) => allMaps.reduce(step, seed));
const partOne = Math.min(...distances);
console.log("part one", partOne, partOne === 462648396); // ~3ms

// sort the maps so the sources are in order
allMaps.forEach((maps) => maps.sort((a, b) => a[1] - b[1]));

function walkRanges(sources, maps) {
  const results = [];

  for (let [ptr, workingLen] of sources) {
    for (const [destStart, sourceStart, mapLen] of maps) {
      if (!workingLen) break;

      // head, range outside/before of map range
      if (ptr < sourceStart) {
        const range = Math.min(workingLen, sourceStart - ptr);
        results.push([ptr, range]);
        ptr += range;
        workingLen -= range;
      }

      if (ptr >= sourceStart && ptr < sourceStart + mapLen) {
        const range = Math.min(workingLen, sourceStart + mapLen - ptr);
        results.push([destStart + (ptr - sourceStart), range]);
        ptr += range;
        workingLen -= range;
      }
    }

    // include tail, if any
    if (workingLen) {
      results.push([ptr, workingLen]);
    }
  }

  return results;
}

const walked = allMaps.reduce(walkRanges, lodash.chunk(seeds, 2));
const partTwo = Math.min(...walked.map(([a]) => a));
console.log("part two", partTwo, partTwo === 2520479); // ~2.4ms
