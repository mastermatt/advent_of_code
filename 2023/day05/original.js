const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const [firstLine, ...otherLineGroups] = input.join("\n").split("\n\n");

const seeds = firstLine.split(": ").pop().split(" ").map(Number);

const allMaps = otherLineGroups.map((chunk) => {
  const lines = chunk.split("\n");
  lines.shift();

  return lines.map((line) => line.split(" ").map(Number));
});

// a map contains three numbers: the destination range start, the source range start, and the range length
function step(val, maps) {
  for (const [destStart, sourceStart, len] of maps) {
    if (val >= sourceStart && val < sourceStart + len) {
      return destStart + (val - sourceStart);
    }
  }

  return val;
}

function walk(seed) {
  let val = seed;

  for (const maps of allMaps) {
    val = step(val, maps);
  }

  return val;
}

const distances = seeds.map(walk);

const partOne = Math.min(...distances);
console.log("part one", partOne, partOne === 462648396);

const seedRanges = [];

for (let i = 0; i < seeds.length; i++) {
  seedRanges.push([seeds[i], seeds[++i]]);
}

// sort the maps so the sources are in order
allMaps.forEach((maps) => maps.sort((a, b) => a[1] - b[1]));

function walkRanges(sources, maps) {
  const results = [];

  for (let [start, len] of sources) {
    for (const [a, b, c] of maps) {
      if (!len) break;

      // head, range outside of any map range
      if (start < b) {
        const range = Math.min(len, b - start);
        results.push([start, range]);
        start += range;
        len -= range;
      }

      if (start >= b && start < b + c) {
        const range = Math.min(len, b + c - start);
        results.push([a + (start - b), range]);
        start += range;
        len -= range;
      }
    }

    // include tail, if any
    if (len) {
      results.push([start, len]);
    }
  }

  return results;
}

function walkAllRanges(ranges) {
  for (const maps of allMaps) {
    ranges = walkRanges(ranges, maps);
  }

  return ranges;
}

const walked = walkAllRanges(seedRanges);

const partTwo = Math.min(...walked.map(([a]) => a));
console.log("part two", partTwo, partTwo === 2520479);
