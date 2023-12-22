const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const inputGrid = input.map((line) => line.split(""));

function weight(grid) {
  const len = grid.length;

  let result = 0;

  for (let x = 0; x < len; ++x) {
    for (let y = 0; y < len; ++y) {
      if (grid[y][x] === "O") {
        result += len - y;
      }
    }
  }

  return result;
}

function tilt(provided) {
  const grid = provided.map((row) => [...row]);

  for (let x = 0; x < grid[0].length; ++x) {
    let nextOpen = 0;
    for (let y = 0; y < grid.length; ++y) {
      const char = grid[y][x];
      if (char === ".") continue;
      if (char === "#") {
        nextOpen = y + 1;
        continue;
      }

      // is rolling rock
      if (nextOpen < y) {
        grid[nextOpen][x] = "O";
        grid[y][x] = ".";
      }
      ++nextOpen;
    }
  }

  return grid;
}

const partOne = weight(tilt(inputGrid));
console.log("part one", partOne, partOne === 108641); // ~0.8ms

function transpose(grid) {
  const len = grid.length; // the grids are square
  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    const newRow = new Array(len);
    result[i] = newRow;
    for (let j = 0; j < len; j++) {
      newRow[j] = grid[len - j - 1][i];
    }
  }

  return result;
}

function cycle(grid) {
  // north, then west, then south, then east.
  for (let i = 0; i < 4; i++) {
    grid = transpose(tilt(grid));
  }

  return grid;
}

function cycleSpec(grid) {
  const cache = new Map();

  for (let i = 1; i <= 1000; i++) {
    grid = cycle(grid);
    const key = grid.map((row) => row.join("")).join(",");
    const hit = cache.get(key);
    if (hit) {
      // console.log("hit", i, hit);
      return { offset: hit, cycleLength: i - hit };
    } else {
      cache.set(key, i);
    }
  }

  console.log("no cycle repeats found");
}

const specs = cycleSpec(inputGrid);
const cycles = 1_000_000_000;
const mod = (cycles - specs.offset) % specs.cycleLength;

let g = inputGrid;
for (let i = 0; i < specs.offset + mod; i++) {
  g = cycle(g);
}

const partTwo = weight(g);
console.log("part two", partTwo, partTwo === 84328); // ~225ms
