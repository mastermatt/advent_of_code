const readFile = require("../../helpers/readFile");

const img = readFile(__dirname, "./input.txt");
const emptyRows = [];
const emptyCols = [];

for (let i = 0; i < img.length; ++i) {
  if (!img[i].includes("#")) {
    emptyRows.push(i);
  }
}

for (let i = 0; i < img[0].length; ++i) {
  if (img.every((line) => line[i] === ".")) {
    emptyCols.push(i);
  }
}

const empties = [emptyCols, emptyRows];
const galaxyCoords = [];

for (let y = 0; y < img.length; y++) {
  for (let x = 0; x < img[0].length; x++) {
    if (img[y][x] === "#") galaxyCoords.push([x, y]);
  }
}
// ~1ms to read, parse input and prep lookups

function inRange(min, max, arr) {
  let cnt = 0;

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] > max) return cnt;
    if (arr[i] > min) ++cnt;
  }

  return cnt;
}

function galacticManhattanDistance(a, b, emptySpaceFactor) {
  let result = 0;

  for (let i = 0; i < a.length; ++i) {
    const min = Math.min(a[i], b[i]);
    const max = Math.max(a[i], b[i]);
    const emptyCnt = inRange(min, max, empties[i]);
    result += max - min - emptyCnt + emptyCnt * emptySpaceFactor;
  }

  return result;
}

function distances(emptySpaceFactor) {
  let distance = 0;

  for (let i = 0; i < galaxyCoords.length; ++i) {
    const a = galaxyCoords[i];
    for (let j = i + 1; j < galaxyCoords.length; ++j) {
      const b = galaxyCoords[j];
      distance += galacticManhattanDistance(a, b, emptySpaceFactor);
    }
  }

  return distance;
}

const partOne = distances(2);
console.log("part one", partOne, partOne === 9686930); // ~5.7ms

const partTwo = distances(1_000_000);
console.log("part two", partTwo, partTwo === 630728425490); // ~5.0ms
