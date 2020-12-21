const lodash = require("lodash");

exports.neighborDeltas = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

exports.orthogonalDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function* generateCoords(...demSizes) {
  const demCnt = demSizes.length;
  const coords = new Array(demCnt).fill(0);

  while (true) {
    yield coords;

    let carry = 0;
    while (++coords[carry] === demSizes[carry]) {
      coords[carry] = 0;
      ++carry;
      if (carry === demCnt) {
        return;
      }
    }
  }
}
exports.generateCoords = generateCoords;

// for 2 dimensions, just use the `neighborDeltas` array
function* generateNeighborDeltas(numDimensions) {
  const demSizes = new Array(numDimensions).fill(3);
  for (const deltas of generateCoords(...demSizes)) {
    if (deltas.every((coord) => coord === 1)) continue; // filter the origin

    yield deltas.map((coord) => coord - 1);
  }
}
exports.generateNeighborDeltas = generateNeighborDeltas;

/**
 * https://en.wikipedia.org/wiki/Manhattan_distance
 * @param {number[]} a
 * @param {number[]} b
 * @return {number}
 */
function manhattanDistance(a, b) {
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result += Math.abs(a[i] - b[i]);
  }
  return result;
}
exports.manhattanDistance = manhattanDistance;

// given a 2D matrix (nested arrays) yield the eight symmetries (initial, rotation and reflection)
// initial > trans > rot 90, flipped Y > reverse > rot 270 > trans > flipped Y > reverse > rot 180 > trans > rot 90, flipped X > reverse > rot 90 > trans > flipped X
// mutates the input.
function* genSymmetries(grid) {
  // reversing basically flips on the X axis
  // unzip basically transposes the nested arrays
  const transpose = () => {
    grid.splice(0, grid.length, ...lodash.unzip(grid));
    return grid;
  };

  yield grid;
  yield transpose();
  yield grid.reverse();
  yield transpose();
  yield grid.reverse();
  yield transpose();
  yield grid.reverse();
  yield transpose();
}
exports.genSymmetries = genSymmetries;
