const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("").map(Number);

const h = 25;
const v = 6;
const layerSize = h * v;

const count = (arr, x) => arr.filter((i) => i === x).length;
const layers = lodash.chunk(input, layerSize);
const numZeros = layers.map((l) => count(l, 0));

let fewestZeros = Infinity;
let fewestIndex;

numZeros.forEach((num, i) => {
  if (num < fewestZeros) {
    fewestZeros = num;
    fewestIndex = i;
  }
});

const fewestLayer = layers[fewestIndex];
const numOnes = count(fewestLayer, 1);
const numTwos = count(fewestLayer, 2);
console.log(numOnes, numTwos);

const partOne = numOnes * numTwos;
console.log("part one", partOne); // 1703

const finalImg = new Array(layerSize).fill(2);

layers.forEach((layer) => {
  layer.forEach((pixelColor, i) => {
    if (pixelColor === 2 || finalImg[i] !== 2) {
      return;
    }

    finalImg[i] = pixelColor;
  });
});

const lines = lodash.chunk(finalImg, h);
lines.forEach((line) => {
  console.log(line.map((p) => (p === 0 ? " " : "■")).join(""));
});

// console.log(finalImg)
const partTwo = 2;
console.log("part two", partTwo); // ..
