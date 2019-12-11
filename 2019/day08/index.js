const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("");

const horizontal = 25;
const vertical = 6;
const layerPixelCount = horizontal * vertical;

const layers = lodash.chunk(input, layerPixelCount);
const numZeros = layers.map(l => lodash.countBy(l)["0"]);
const fewestIndex = numZeros.indexOf(Math.min(...numZeros));
const counts = lodash.countBy(layers[fewestIndex]);

const partOne = counts["1"] * counts["2"];
console.log("part one", partOne); // 1703

const transparent = "2";
const finalImg = new Array(layerPixelCount).fill(transparent);

layers.forEach(layer =>
  layer
    .filter((pixelColor, i) => finalImg[i] === transparent)
    .forEach((pixelColor, i) => (finalImg[i] = pixelColor))
);

lodash.chunk(finalImg, horizontal).forEach(line => {
  console.log(line.map(p => (p === "0" ? " " : "■")).join("")); // HCGFE
});
