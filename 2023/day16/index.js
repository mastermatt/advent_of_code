const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

function calc(startingTile) {
  const energizedTiles = new CoordinateSet();
  const beams = [startingTile];
  const seen = new CoordinateSet();

  while (beams.length) {
    const [ox, oy, v] = beams.pop();
    // vector indexes: [down, right, up, left]
    const [dx, dy] = orthogonalDeltas[v];
    const x = ox + dx;
    const y = oy + dy;

    const char = input[y]?.[x]; // .-|\/
    if (!char) continue;

    if (seen.has(x, y, v)) continue;

    energizedTiles.add(x, y);
    seen.add(x, y, v);

    if (char === ".") {
      beams.push([x, y, v]);
      continue;
    }

    if (char === "-") {
      if (v === 1 || v === 3) {
        // the beam passes through the splitter as if the splitter were empty space.
        beams.push([x, y, v]);
      } else {
        beams.push([x, y, 1], [x, y, 3]);
      }
      continue;
    }

    if (char === "|") {
      if (v === 0 || v === 2) {
        // the beam passes through the splitter as if the splitter were empty space.
        beams.push([x, y, v]);
      } else {
        beams.push([x, y, 0], [x, y, 2]);
      }
      continue;
    }

    if (char === "\\") {
      const dv = [1, 0, 3, 2];
      beams.push([x, y, dv[v]]);
      continue;
    }

    if (char === "/") {
      const dv = [3, 2, 1, 0];
      beams.push([x, y, dv[v]]);
    }
  }

  return energizedTiles.size;
}

const partOne = calc([-1, 0, 1]);
console.log("part one", partOne, partOne === 7236); // ~13ms

const counts = [];

const height = input.length;
const width = input[0].length;

for (let i = 0; i < height; i++) {
  counts.push(calc([-1, i, 1]));
  counts.push(calc([width, i, 3]));
}
for (let i = 0; i < width; i++) {
  counts.push(calc([i, -1, 0]));
  counts.push(calc([i, height, 2]));
}

const partTwo = Math.max(...counts);
console.log("part two", partTwo, partTwo === 7521); // ~1050ms
