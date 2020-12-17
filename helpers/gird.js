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
