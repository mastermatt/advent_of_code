const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

function transpose(pattern) {
  const rowCnt = pattern[0].length;
  const result = new Array(rowCnt).fill("");

  for (let i = 0; i < rowCnt; ++i) {
    for (let j = 0; j < pattern.length; ++j) {
      result[i] += pattern[j][i];
    }
  }

  return result;
}

function compare(a, b) {
  if (a === b) return 0;

  let diffs = 0;
  for (let i = 0; i < a.length && diffs < 2; ++i) {
    if (a[i] !== b[i]) ++diffs;
  }

  return diffs;
}

function reflectionIdx(pattern) {
  for (let i = 0; i < pattern.length - 1; i++) {
    for (let j = 0; ; ++j) {
      const a = pattern[i - j];
      const b = pattern[i + j + 1];
      if (a === undefined || b === undefined) return i;
      if (a !== b) break;
    }
  }
}

function reflectionIdxWithSmudge(pattern, ignoreIdx) {
  for (let i = 0; i < pattern.length - 1; i++) {
    let foundSmudge = false;

    for (let j = 0; ; ++j) {
      const a = pattern[i - j];
      const b = pattern[i + j + 1];

      if (a === undefined || b === undefined) {
        if (foundSmudge && i !== ignoreIdx) return i;
        break;
      }

      const diffs = compare(a, b);
      if (diffs === 0) continue;
      if (diffs === 1 && !foundSmudge) {
        foundSmudge = true;
        continue;
      }

      break; // too different
    }
  }
}

const seenHorIdx = [];
const seenVerIdx = [];

function summarize(pattern, idx) {
  const horizontalIdx = reflectionIdx(pattern, seenHorIdx[idx]);

  if (horizontalIdx !== undefined) {
    seenHorIdx[idx] = horizontalIdx;
    return (horizontalIdx + 1) * 100;
  }

  const verticalIdx = reflectionIdx(transpose(pattern), seenHorIdx[idx]);

  seenVerIdx[idx] = verticalIdx;
  return verticalIdx + 1;
}

const partOne = lodash.sum(input.map(summarize));
console.log("part one", partOne, partOne === 33047); // ~0.8ms

function summarize2(pattern, idx) {
  const horizontalIdx = reflectionIdxWithSmudge(pattern, seenHorIdx[idx]);

  if (horizontalIdx !== undefined) {
    return (horizontalIdx + 1) * 100;
  }

  return reflectionIdxWithSmudge(transpose(pattern), seenVerIdx[idx]) + 1;
}

const partTwo = lodash.sum(input.map(summarize2));
console.log("part two", partTwo, partTwo === 28806); // ~1.2ms
