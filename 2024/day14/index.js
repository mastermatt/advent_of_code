const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");

const input = readFile(__dirname, "./input.txt");
const bots = input.map((line) => line.match(/(-?\d+)/g).map(Number));

const tilesWide = 101;
const halfWide = (tilesWide / 2) | 0;
const tilesTall = 103;
const halfTall = (tilesTall / 2) | 0;
const quadrants = [0, 0, 0, 0];

for (const [px, py, vx, vy] of bots) {
  let x = (px + vx * 100) % tilesWide;
  let y = (py + vy * 100) % tilesTall;
  if (x < 0) x += tilesWide;
  if (y < 0) y += tilesTall;
  if (x === halfWide || y === halfTall) continue;
  let q = 0;

  if (x > halfWide) q += 1;
  if (y > halfTall) q += 2;
  quadrants[q]++;
}

const partOne = quadrants.reduce((acc, cur) => acc * cur, 1);
console.log("part one", partOne, partOne === 217_132_650);

const stepBot = (bot) => {
  bot[0] = (bot[0] + bot[2]) % tilesWide;
  if (bot[0] < 0) bot[0] += tilesWide;
  bot[1] = (bot[1] + bot[3]) % tilesTall;
  if (bot[1] < 0) bot[1] += tilesTall;
};

let partTwo = null;
for (let i = 1; i <= 10000; i++) {
  bots.forEach(stepBot);

  const uniqueCoords = new CoordinateSet();
  bots.forEach(([x, y]) => uniqueCoords.add(x, y));

  // console.log('Step', i, uniqueCoords.size)

  // I made the assumption it would be the first step where all bots were at unique location,
  // I was right.
  if (uniqueCoords.size !== bots.length) continue;
  partTwo = i;

  const grid = [];
  for (let row = 0; row < tilesTall; row++) {
    grid.push(new Array(tilesWide).fill("."));
  }

  bots.forEach(([x, y]) => (grid[y][x] = "X"));

  for (let j = 0; j < tilesTall; j++) {
    console.log(grid[j].join(""));
  }

  break;
}

console.log("part two", partTwo, partTwo === 6516);
