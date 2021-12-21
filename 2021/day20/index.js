const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

console.time("parse input");
const input = readFile(__dirname, "./input.txt");

function parseLine(line) {
  return line.split("").map((char) => (char === "." ? 0 : 1));
}

const alg = parseLine(input[0]);
const inputImg = input.slice(2).map(parseLine);
console.timeEnd("parse input");

const deltas = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

function enhanceImage(img, defaultPixel) {
  const width = img[0].length;
  const height = img.length;
  const result = new Array(height + 2);

  for (let y = -1; y <= height; ++y) {
    const line = new Array(width + 2);
    for (let x = -1; x <= width; ++x) {
      let num = 0;
      for (let i = 0; i < deltas.length; i++) {
        const xd = x + deltas[i][0];
        const yd = y + deltas[i][1];
        const sourceLine = img[yd];
        const bit =
          sourceLine === undefined || sourceLine[xd] === undefined
            ? defaultPixel
            : sourceLine[xd];
        num <<= 1;
        num |= bit;
      }
      line[x + 1] = alg[num];
    }
    result[y + 1] = line;
  }

  return result;
}

function multiEnhance(img, iters) {
  for (let i = 0; i < iters; i++) {
    img = enhanceImage(img, i % 2);
  }
  return img;
}

console.time("part one");
const doubleEnhanced = multiEnhance(inputImg, 2);
const partOne = lodash.sum(doubleEnhanced.flat());
console.timeEnd("part one");
console.log("part one", partOne, partOne === 5354);

console.time("part two");
const csi = multiEnhance(doubleEnhanced, 48);
const partTwo = lodash.sum(csi.flat());
console.timeEnd("part two");
console.log("part two", partTwo, partTwo === 18269);
