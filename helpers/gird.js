exports.neighborDeltas = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1]
];

exports.orthogonalDeltas = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
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

// https://en.wikipedia.org/wiki/Manhattan_distance
function manhattanDistance(...coordinates) {
  return coordinates.reduce((a, b) => Math.abs(a) + Math.abs(b));
}
exports.manhattanDistance = manhattanDistance;
