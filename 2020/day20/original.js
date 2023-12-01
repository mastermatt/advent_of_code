const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { generateCoords, genSymmetries } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt").join("\n");

const reverseStr = (str) => [...str].reverse().join("");

function edges(arr) {
  const left = arr.map((line) => line[0]).join("");
  const right = arr.map((line) => line[line.length - 1]).join("");
  const top = arr[0].join("");
  const bottom = arr[arr.length - 1].join("");

  return { top, right, bottom, left };
}

const tiles = input.split("\n\n").map((chuck) => {
  const arr = chuck.split("\n");
  const id = parseInt(arr.shift().substring(5, 9));
  const raw = arr.map((line) => line.split(""));
  const { top, right, bottom, left } = edges(raw);

  const allEdges = [
    top,
    right,
    bottom,
    left,
    reverseStr(top),
    reverseStr(right),
    reverseStr(bottom),
    reverseStr(left),
  ];

  return {
    id,
    raw,
    edges: allEdges,
    neighbors: [],
  };
});

tiles.forEach((tile) => {
  tiles.forEach((other) => {
    if (other.id === tile.id) return false; // same tile
    const overlap = lodash.intersection(tile.edges, other.edges);
    if (overlap.length) {
      tile.neighbors.push(other);
    }
  });
});

const partOne = tiles
  .filter((tile) => tile.neighbors.length === 2)
  .map((tile) => tile.id)
  .reduce((a, b) => a * b);
console.log("part one", partOne, partOne === 45443966642567); // 45443966642567

// Pick a corner and orientate it so its neighbors are right and down
const firstCorner = tiles.find((tile) => tile.neighbors.length === 2);
const seen = new Set([firstCorner.id]);

function orientateFirst() {
  const x = firstCorner.neighbors[0].edges.concat(
    firstCorner.neighbors[1].edges,
  );
  for (const sym of genSymmetries(firstCorner.raw)) {
    const es = edges(sym);
    const y = [es.right, es.bottom];
    if (lodash.intersection(x, y).length === 2) return;
  }
}
orientateFirst();

const imgMap = [[firstCorner]];

function getLowerTile(upperTile) {
  const desiredTop = edges(upperTile.raw).bottom;

  for (const neighbor of upperTile.neighbors) {
    if (seen.has(neighbor.id)) continue;

    for (const sym of genSymmetries(neighbor.raw)) {
      // NB this is mutating the raw matrix
      if (edges(sym).top === desiredTop) {
        return neighbor;
      }
    }
  }
}

// line up the first column
while (true) {
  const lastTile = imgMap[imgMap.length - 1][0];
  const nextTile = getLowerTile(lastTile);
  if (nextTile) {
    seen.add(nextTile.id);
    imgMap.push([nextTile]); // new row
  } else {
    break;
  }
}

function getRightTile(leftTile) {
  const desiredLeft = edges(leftTile.raw).right;

  for (const neighbor of leftTile.neighbors) {
    if (seen.has(neighbor.id)) continue;

    for (const sym of genSymmetries(neighbor.raw)) {
      // NB this is mutating the raw matrix
      if (edges(sym).left === desiredLeft) {
        return neighbor;
      }
    }
  }
}

for (const row of imgMap) {
  while (true) {
    const lastTile = row[row.length - 1];
    const nextTile = getRightTile(lastTile);

    if (nextTile) {
      seen.add(nextTile.id);
      row.push(nextTile);
    } else {
      break;
    }
  }
}

// console.log("seen size", seen.size);

function trimTile(tile) {
  return tile.raw.slice(1, -1).map((row) => row.slice(1, -1));
}

function assembleImage() {
  const result = [];
  for (const row of imgMap) {
    const x = [];
    for (const tile of row) {
      const trimmed = trimTile(tile);
      if (!x.length) {
        x.push(...trimmed);
      } else {
        // console.log(x)
        trimmed.forEach((y, idx) => x[idx].push(...y));
      }
    }

    result.push(...x);
  }
  return result;
}

//                   #
// #    ##    ##    ###
//  #  #  #  #  #  #
const monsterHashes = [
  [0, 18],
  [1, 0],
  [1, 5],
  [1, 6],
  [1, 11],
  [1, 12],
  [1, 17],
  [1, 18],
  [1, 19],
  [2, 1],
  [2, 4],
  [2, 7],
  [2, 10],
  [2, 13],
  [2, 16],
];

function countMonsters(image) {
  let count = 0;
  for (const [x, y] of generateCoords(image.length, image[0].length)) {
    const predicate = ([dx, dy]) => (image[x + dx] || [])[y + dy] === "#";
    if (monsterHashes.every(predicate)) ++count;
  }

  return count;
}

const assembledImage = assembleImage();
let numMonsters = 0;
for (const sym of genSymmetries(assembledImage)) {
  const count = countMonsters(sym);
  if (count) {
    numMonsters = count;
    break;
  }
}

const totalHashes = assembledImage.flat().filter((char) => char === "#").length;
// console.log("num monsters", numMonsters); // 21
// console.log("totalHashes", totalHashes); // 1922

const partTwo = totalHashes - 15 * numMonsters;
console.log("part two", partTwo, partTwo === 1607); // 1607
