const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords, genSymmetries } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt").join("\n");

const monsterPattern = `
                  #
#    ##    ##    ###
 #  #  #  #  #  #
`;

const reverseStr = (str) => [...str].reverse().join("");
const trimTile = (tile) => tile.raw.slice(1, -1).map((row) => row.slice(1, -1));
const countHashes = (arr) => arr.filter((char) => char === "#").length;

function getEdges(arr) {
  const left = arr.map((line) => line[0]).join("");
  const right = arr.map((line) => line[line.length - 1]).join("");
  const top = arr[0].join("");
  const bottom = arr[arr.length - 1].join("");

  return { top, right, bottom, left };
}

const tiles = input.split("\n\n").map((chunk) => {
  const arr = chunk.split("\n");
  const id = parseInt(arr.shift().substring(5, 9));
  const raw = arr.map((line) => line.split(""));
  const edges = Object.values(getEdges(raw));
  edges.push(...edges.map(reverseStr));

  return { id, raw, edges, neighbors: [] };
});

// populate "neighbors". This takes advantage of the fact that the input doesn't provide any
// ambiguous edges. If two tiles have the same edge (including symmetries) then they are neighbors.
tiles.forEach((tile) => {
  tiles.forEach((other) => {
    if (other.id === tile.id) return false; // same tile
    const overlap = lodash.intersection(tile.edges, other.edges);
    if (overlap.length) tile.neighbors.push(other);
  });
});

// Because no edges are ambiguous there will be exactly four tiles with two neighbors, those are the corners.
const partOne = tiles
  .filter((tile) => tile.neighbors.length === 2)
  .map((tile) => tile.id)
  .reduce((a, b) => a * b);
console.log("part one", partOne, partOne === 45443966642567); // 45443966642567

// Pick a corner and orientate it so its neighbors are right and down
function getFirstCorner() {
  const tile = tiles.find((tile) => tile.neighbors.length === 2);
  const neighborEdges = tile.neighbors.map((neighbor) => neighbor.edges).flat();

  // NB this is mutating the raw grid
  for (const sym of genSymmetries(tile.raw)) {
    const edges = getEdges(sym);
    const keyEdges = [edges.right, edges.bottom];
    if (lodash.intersection(neighborEdges, keyEdges).length === 2) return tile;
  }
}

function getNeighborTile(source, direction, seen) {
  if (!source) throw direction;
  const desiredEdge = getEdges(source.raw)[direction];
  const opDir = direction === "bottom" ? "top" : "left";

  for (const neighbor of source.neighbors) {
    if (seen.has(neighbor.id)) continue;

    // NB this is mutating the raw grid
    for (const sym of genSymmetries(neighbor.raw)) {
      if (getEdges(sym)[opDir] === desiredEdge) {
        return neighbor;
      }
    }
  }
}

// figure how how all the tiles fit together, both relative to each other in a grid, but also
// updates the `raw` attr of each tile to have the right orientation.
function buildImageMap() {
  const grid = []; // tile[][]
  const firstCorner = getFirstCorner();
  const seen = new Set();

  while (seen.size < tiles.length) {
    // select the first tile for each row by finding what fits beneath the first tile of the last row
    let tile = grid.length
      ? getNeighborTile(lodash.last(grid)[0], "bottom", seen)
      : firstCorner;

    const row = [];
    grid.push(row);

    do {
      row.push(tile);
      seen.add(tile.id);
      tile = getNeighborTile(tile, "right", seen);
    } while (tile);
  }

  return grid;
}

function assembleImage(imageMap) {
  const result = [];
  for (const sourceRow of imageMap) {
    const targetRows = [[], [], [], [], [], [], [], []];
    result.push(...targetRows);

    for (const tile of sourceRow) {
      trimTile(tile).forEach((subRow, idx) => targetRows[idx].push(...subRow));
    }
  }
  return result;
}

const monsterHashDeltas = [];
monsterPattern
  .split("\n")
  .slice(1, -1)
  .forEach((line, lineIdx) => {
    line.split("").forEach((char, charIdx) => {
      if (char === "#") monsterHashDeltas.push([lineIdx, charIdx]);
    });
  });

function countMonsters(image) {
  let count = 0;
  for (const [x, y] of generateCoords(image.length, image[0].length)) {
    const predicate = ([dx, dy]) => (image[x + dx] || [])[y + dy] === "#";
    if (monsterHashDeltas.every(predicate)) ++count;
  }

  return count;
}

// the input is such that only one symmetry of the stitched image will have any monsters present
function findMonsterCount(image) {
  for (const sym of genSymmetries(image)) {
    const count = countMonsters(sym);
    if (count) return count;
  }
}

const imageMap = buildImageMap();
const assembledImage = assembleImage(imageMap);
const numMonsters = findMonsterCount(assembledImage);

const totalHashes = countHashes(assembledImage.flat());
const monsterHashes = countHashes(monsterPattern.split(""));
// console.log("num monsters", numMonsters); // 21
// console.log("totalHashes", totalHashes); // 1922

const partTwo = totalHashes - numMonsters * monsterHashes;
console.log("part two", partTwo, partTwo === 1607); // 1607
