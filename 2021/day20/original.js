const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
// const input = readFile(__dirname, "./example.txt");

function parseLine(line) {
  return line.split("").map((char) => (char === "." ? 0 : 1));
}

const alg = parseLine(input[0]);
const inputImg = input.slice(2).map(parseLine);

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
  const result = [];

  for (let y = -1; y <= height; y++) {
    const line = [];
    for (let x = -1; x <= width; x++) {
      const bin = deltas.map(([xd, yd]) => {
        if (img[y + yd] === undefined || img[y + yd][x + xd] === undefined)
          return defaultPixel;
        return img[y + yd][x + xd];
      });
      const num = parseInt(bin.join(""), 2);
      line.push(alg[num]);
    }

    result.push(line);
  }
  // printImg(result);
  // console.log(result);
  return result;
}

function printImg(img) {
  const chars = [".", "#"];
  for (const line of img) console.log(line.map((flag) => chars[flag]).join(""));
  console.log("--------------------");
}

// printImg(inputImg);

const doubleEnhanced = enhanceImage(enhanceImage(inputImg, 0), 1);

const partOne = lodash.sum(doubleEnhanced.flat());
console.log("part one", partOne, partOne === 5354);

console.time("part two");
let img = doubleEnhanced;
for (let i = 2; i < 50; i++) {
  img = enhanceImage(img, i % 2);
}

const partTwo = lodash.sum(img.flat());
console.timeEnd("part two");
console.log("part two", partTwo, partTwo === 18269);
