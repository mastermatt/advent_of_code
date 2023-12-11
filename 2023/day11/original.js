const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const img = input.map((line) => line.split(""));

const emptyRows = [];
const emptyCols = [];

for (let i = 0; i < img.length; i++) {
  if (img[i].every((spot) => spot === ".")) {
    emptyRows.push(i);
  }
}

for (let i = 0; i < img[0].length; i++) {
  if (img.every((line) => line[i] === ".")) {
    emptyCols.push(i);
  }
}

const galaxyCoords = [];

for (let y = 0; y < img.length; y++) {
  for (let x = 0; x < img[0].length; x++) {
    if (img[y][x] === "#") galaxyCoords.push([x, y]);
  }
}
// ~1ms to read, parse input and prep lookups

function galacticManhattanDistance([ax, ay], [bx, by], emptySpaceFactor) {
  let result = 0;

  let min = Math.min(ax, bx);
  let max = Math.max(ax, bx);

  for (let i = min; i < max; i++) {
    if (emptyCols.includes(i)) result += emptySpaceFactor;
    else ++result;
  }

  min = Math.min(ay, by);
  max = Math.max(ay, by);

  for (let i = min; i < max; i++) {
    if (emptyRows.includes(i)) result += emptySpaceFactor;
    else ++result;
  }

  return result;
}

const distances = [];
for (let i = 0; i < galaxyCoords.length; i++) {
  const a = galaxyCoords[i];
  for (let j = i + 1; j < galaxyCoords.length; j++) {
    const b = galaxyCoords[j];

    distances.push(galacticManhattanDistance(a, b, 2));
  }
}

const partOne = lodash.sum(distances);
console.log("part one", partOne, partOne === 9686930); // ~85ms

const distances2 = [];
for (let i = 0; i < galaxyCoords.length; i++) {
  const a = galaxyCoords[i];
  for (let j = i + 1; j < galaxyCoords.length; j++) {
    const b = galaxyCoords[j];

    distances2.push(galacticManhattanDistance(a, b, 1_000_000));
  }
}

const partTwo = lodash.sum(distances2);
console.log("part two", partTwo, partTwo === 630728425490); // ~81ms
