const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

function transpose(pattern) {
  return lodash
    .unzip(pattern.map((line) => line.split("")))
    .map((chars) => chars.join(""));
}

function compare(a, b) {
  let diffs = 0;
  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) ++diffs;
  }

  return diffs;
}

function reflectionIdx(pattern) {
  for (let i = 0; i < pattern.length - 1; i++) {
    for (let j = 0; ; ++j) {
      if (pattern[i - j] === undefined || pattern[i + j + 1] === undefined)
        return i;
      if (pattern[i - j] !== pattern[i + j + 1]) break;
    }
  }
}

function reflectionIdxWithSmudge(pattern, ignoreIdx) {
  for (let i = 0; i < pattern.length - 1; i++) {
    let foundSmudge = false;

    for (let j = 0; ; ++j) {
      if (pattern[i - j] === undefined || pattern[i + j + 1] === undefined) {
        if (foundSmudge && i !== ignoreIdx) return i;
        else break;
      }

      const diffs = compare(pattern[i - j], pattern[i + j + 1]);
      if (diffs === 0) continue;
      if (diffs === 1) {
        if (foundSmudge) break;
        else {
          foundSmudge = true;
          continue;
        }
      }

      break; // too different
    }
  }
}

const aaa = [];

function summarize(pattern) {
  const bbb = [null, null];
  aaa.push(bbb);
  const horizontalIdx = reflectionIdx(pattern);

  if (horizontalIdx !== undefined) {
    bbb[0] = horizontalIdx;
    return (horizontalIdx + 1) * 100;
  }

  const verticalIdx = reflectionIdx(transpose(pattern));

  if (verticalIdx !== undefined) {
    bbb[1] = verticalIdx;
    return verticalIdx + 1;
  }
}

const partOne = lodash.sum(input.map(summarize));
console.log("part one", partOne, partOne === 33047); // ~1.4ms

function summarize2(pattern, idx) {
  const bbb = aaa[idx];
  const horizontalIdx = reflectionIdxWithSmudge(pattern, bbb[0]);

  if (horizontalIdx !== undefined) {
    return (horizontalIdx + 1) * 100;
  }

  const verticalIdx = reflectionIdxWithSmudge(transpose(pattern), bbb[1]);

  if (verticalIdx !== undefined) {
    return verticalIdx + 1;
  }
}

const partTwo = lodash.sum(input.map(summarize2));
console.log("part two", partTwo, partTwo === 28806); // ~1.6ms
