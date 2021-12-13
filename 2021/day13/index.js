const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");

const [rawDots, rawFolds] = readFile(__dirname, "./input.txt")
  .join("\n")
  .split("\n\n");
const coords = rawDots.split("\n").map((line) => line.split(",").map(Number));
const instructions = rawFolds
  .split("\n")
  .map((line) => [line[11] === "x", Number(line.substring(13))]);

const set = new CoordinateSet(coords);

function doFold([onX, idx]) {
  for (const [x, y] of set) {
    if (idx > (onX ? x : y)) continue;

    const [xn, yn] = onX ? [idx + idx - x, y] : [x, idx + idx - y];
    set.add(xn, yn);
    set.delete(x, y);
  }

  return set.size;
}

const counts = instructions.map(doFold);

const partOne = counts[0];
console.log("part one", partOne, partOne === 755);

function printDots() {
  for (let y = 0; y < 6; y++) {
    const line = [];
    for (let x = 0; x < 40; x++) {
      line.push(set.has(x, y) ? "█" : " ");
    }
    console.log(line.join(""));
  }
}

printDots();
// ███  █    █  █   ██ ███  ███   ██   ██
// █  █ █    █ █     █ █  █ █  █ █  █ █  █
// ███  █    ██      █ █  █ ███  █  █ █
// █  █ █    █ █     █ ███  █  █ ████ █ ██
// █  █ █    █ █  █  █ █ █  █  █ █  █ █  █
// ███  ████ █  █  ██  █  █ ███  █  █  ███

// I'm not going to bother auto-parsing this.
const partTwo = "BLKJRBAG";
console.log("part two", partTwo, partTwo === "BLKJRBAG");
