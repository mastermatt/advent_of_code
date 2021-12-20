const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { manhattanDistance } = require("../../helpers/gird");

// const input = readFile(__dirname, "./example.txt").join("\n").split("\n\n");
const input = readFile(__dirname, "./input.txt").join("\n").split("\n\n");

const scanners = input.map((chunk) => {
  const lines = chunk.split("\n");
  lines.shift(); // don't need header line
  const beacons = [];
  const set = new CoordinateSet();
  for (const line of lines) {
    beacons.push({
      coords: line.split(",").map(Number),
      distances: new Array(30).fill(0),
    });
    set.addRaw(line);
  }
  return { beacons, set };
});

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

for (const scanner of scanners) {
  findDistances(scanner);
}

function intersectDistances(a, b) {
  const result = [];
  for (let ia = 0; ia < a.length; ia++) {
    const dist = a[ia];
    if (!dist) continue;
    const ib = b.indexOf(dist);
    if (ib !== -1) {
      result.push([ia, ib, dist]);
    }
  }

  return result;
}

function findIntersects(scannerA, scannerB) {
  for (const a of scannerA.beacons) {
    for (const b of scannerB.beacons) {
      const intersects = intersectDistances(a.distances, b.distances);
      if (intersects.length > 10) {
        // at least 12 beacons means at least 11 distances
        return [a, b];
      }
    }
  }
}

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
  //[2, 0, 1, -1, -1, 1],

  return [
    coords[perm[0]] * perm[3] + offset[0],
    coords[perm[1]] * perm[4] + offset[1],
    coords[perm[2]] * perm[5] + offset[2],
  ];
}

function align(scannerA, scannerB, refBeaconA, refBeaconB) {
  for (const perm of perms) {
    // console.log('perm', perm);
    const newCoords = applyPerm(refBeaconB.coords, perm);
    const offset = [
      refBeaconA.coords[0] - newCoords[0],
      refBeaconA.coords[1] - newCoords[1],
      refBeaconA.coords[2] - newCoords[2],
    ];

    const aligns = scannerB.beacons.filter((beacon) => {
      const permedCoords = applyPerm(beacon.coords, perm, offset);
      return scannerA.set.has(...permedCoords);
    });

    if (aligns.length > 11) return { offset, perm };
  }
  console.log("no alignment found");
}

const resolvedScanners = [scanners[0]];
scanners[0].coords = [0, 0, 0];

while (resolvedScanners.length < scanners.length) {
  for (const resolvedScanner of resolvedScanners) {
    for (const scanner of scanners) {
      if (scanner.coords) continue;

      // console.log('looking at', scanners.indexOf(scanner));
      const intersects = findIntersects(resolvedScanner, scanner);
      if (!intersects) continue;

      const aligned = align(resolvedScanner, scanner, ...intersects);
      if (!aligned) return;

      const { offset, perm } = aligned;
      scanner.coords = offset;
      scanner.set.clear();
      for (const beacon of scanner.beacons) {
        beacon.coords = applyPerm(beacon.coords, perm, offset);
        scanner.set.add(...beacon.coords);
      }
      resolvedScanners.push(scanner);

      // console.log('resolved', scanners.indexOf(scanner), scanner.coords);
    }
  }
}

const allBeacons = new CoordinateSet();

for (const scanner of scanners) {
  for (const beacon of scanner.beacons) {
    allBeacons.add(...beacon.coords);
  }
}

const partOne = allBeacons.size;
console.log("part one", partOne, partOne === 451);

let maxDistance = 0;

for (const a of scanners) {
  for (const b of scanners) {
    const dist = manhattanDistance(a.coords, b.coords);
    if (dist > maxDistance) maxDistance = dist;
  }
}

const partTwo = maxDistance;
console.log("part two", partTwo, partTwo === 13184);
