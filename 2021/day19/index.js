const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { manhattanDistance, coordsMatch } = require("../../helpers/gird");

console.time("process input");
const input = readFile(__dirname, "./input.txt").join("\n").split("\n\n");

const scanners = input.map((chunk) => {
  const lines = chunk.split("\n");
  lines.shift(); // don't need header line
  const beacons = [];
  for (const line of lines) {
    beacons.push({
      coords: line.split(",").map(Number),
      distances: [],
    });
  }
  return { beacons };
});
scanners[0].coords = [0, 0, 0];
console.timeEnd("process input");

function findDistances(scanner) {
  const { beacons } = scanner;
  const len = beacons.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      const dist = manhattanDistance(beacons[i].coords, beacons[j].coords);
      beacons[i].distances[j] = beacons[j].distances[i] = dist;
    }
  }
}

function intersectDistances(a, b) {
  const result = [];
  for (let ia = 0; ia < a.length; ia++) {
    const dist = a[ia];
    if (!dist) continue;
    const ib = b.indexOf(dist);
    if (ib !== -1) {
      result.push([ia, ib]);
    }
  }

  return result;
}

function findIntersects(scannerA, scannerB) {
  for (const a of scannerA.beacons) {
    for (const b of scannerB.beacons) {
      const intersects = intersectDistances(a.distances, b.distances);
      if (intersects.length > 10) {
        // at least 12 beacons means at least 11 distances to neighbors
        return [a, b, intersects];
      }
    }
  }
}

// 24 permutations of 3-axis coord system.
// for each perm, the first three digits denote how the axes swap around and the last three digits denote their signs
const perms = [
  [0, 1, 2, 1, 1, 1], // original
  [0, 1, 2, -1, -1, 1],
  [0, 1, 2, -1, 1, -1],
  [0, 1, 2, 1, -1, -1],

  [1, 2, 0, 1, 1, 1],
  [1, 2, 0, -1, -1, 1],
  [1, 2, 0, -1, 1, -1],
  [1, 2, 0, 1, -1, -1],

  [2, 0, 1, 1, 1, 1],
  [2, 0, 1, -1, -1, 1],
  [2, 0, 1, -1, 1, -1],
  [2, 0, 1, 1, -1, -1],

  [0, 2, 1, -1, 1, 1],
  [0, 2, 1, 1, -1, 1],
  [0, 2, 1, 1, 1, -1],
  [0, 2, 1, -1, -1, -1],

  [1, 0, 2, -1, 1, 1],
  [1, 0, 2, 1, -1, 1],
  [1, 0, 2, 1, 1, -1],
  [1, 0, 2, -1, -1, -1],

  [2, 1, 0, -1, 1, 1],
  [2, 1, 0, 1, -1, 1],
  [2, 1, 0, 1, 1, -1],
  [2, 1, 0, -1, -1, -1],
];

function applyPerm(coords, perm, offset = [0, 0, 0]) {
  return [
    coords[perm[0]] * perm[3] + offset[0],
    coords[perm[1]] * perm[4] + offset[1],
    coords[perm[2]] * perm[5] + offset[2],
  ];
}

function align(scannerA, scannerB, refBeaconA, refBeaconB, neighbors) {
  for (const perm of perms) {
    const newCoords = applyPerm(refBeaconB.coords, perm);
    const offset = [
      refBeaconA.coords[0] - newCoords[0],
      refBeaconA.coords[1] - newCoords[1],
      refBeaconA.coords[2] - newCoords[2],
    ];

    const aligns = neighbors.filter(([ia, ib]) => {
      const targetCoords = scannerA.beacons[ia].coords;
      const neighborCoords = scannerB.beacons[ib].coords;
      const permedCoords = applyPerm(neighborCoords, perm, offset);
      return coordsMatch(targetCoords, permedCoords);
    });

    if (aligns.length > 9) return { offset, perm };
  }
  console.log("no alignment found");
}

console.time("part one");
for (const scanner of scanners) {
  findDistances(scanner);
}

const resolvedScanners = [scanners[0]];
const resolvedBeacons = new CoordinateSet();

for (const beacon of scanners[0].beacons) {
  resolvedBeacons.add(...beacon.coords);
}

while (resolvedScanners.length < scanners.length) {
  for (const resolvedScanner of resolvedScanners) {
    for (const scanner of scanners) {
      if (scanner.coords) continue;

      // console.log('looking at', scanners.indexOf(scanner));
      const intersects = findIntersects(resolvedScanner, scanner);
      if (!intersects) continue;

      const { offset, perm } = align(resolvedScanner, scanner, ...intersects);
      scanner.coords = offset;
      for (const beacon of scanner.beacons) {
        beacon.coords = applyPerm(beacon.coords, perm, offset);
        resolvedBeacons.add(...beacon.coords);
      }
      resolvedScanners.push(scanner);

      // console.log('resolved', scanners.indexOf(scanner), scanner.coords);
    }
  }
}

const partOne = resolvedBeacons.size;

console.timeEnd("part one");
console.log("part one", partOne, partOne === 451);

console.time("part two");
let maxDistance = 0;
for (let i = 0; i < scanners.length; i++) {
  for (let j = i + 1; j < scanners.length; j++) {
    const dist = manhattanDistance(scanners[i].coords, scanners[j].coords);
    if (dist > maxDistance) maxDistance = dist;
  }
}

const partTwo = maxDistance;
console.timeEnd("part two");
console.log("part two", partTwo, partTwo === 13184);
