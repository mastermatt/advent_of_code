const lodash = require("lodash");

const neighborDeltas = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];
exports.neighborDeltas = neighborDeltas;

const orthogonalDeltas = [
  [0, 1], // down
  [1, 0], // right
  [0, -1], // up
  [-1, 0], // left
];
exports.orthogonalDeltas = orthogonalDeltas;

const diagonalDeltas = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1],
];
exports.diagonalDeltas = diagonalDeltas;

/**
 * Walk all  possible points of an n-dimensional grid
 *
 * Accepts the size of each dimension. e.g. a 1x2x3 3D grid:
 *  generateCoords(1, 2, 3) ->
 *  [ 0, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 0, 1, 1 ], [ 0, 0, 2 ], [ 0, 1, 2 ]
 */
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

function coordsMatch(...coords) {
  for (let i = 0; i < coords[0].length; i++) {
    const val = coords[0][i];
    for (let j = 1; j < coords.length; j++) {
      if (coords[j][i] !== val) return false;
    }
  }

  return true;
}
exports.coordsMatch = coordsMatch;

// for 2 dimensions, just use the `neighborDeltas` array
function* generateNeighborDeltas(numDimensions) {
  const demSizes = new Array(numDimensions).fill(3);
  for (const deltas of generateCoords(...demSizes)) {
    if (deltas.every((coord) => coord === 1)) continue; // filter the origin

    yield deltas.map((coord) => coord - 1);
  }
}
exports.generateNeighborDeltas = generateNeighborDeltas;

// yields [val, x, y, deltaX, deltaY] for each neighbor of the given point, ignoring coordinates outside the grid
// assumes the grid is a std 2d array accessed as grid[y][x].
function* neighbors(x, y, grid, deltas = neighborDeltas) {
  const maxX = grid[0].length - 1;
  const maxY = grid.length - 1;
  for (const [xd, yd] of deltas) {
    const xn = x + xd;
    const yn = y + yd;
    if (xn >= 0 && xn <= maxX && yn >= 0 && yn <= maxY) {
      yield [grid[yn][xn], xn, yn, xd, yd];
    }
  }
}
exports.neighbors = neighbors;

function* orthogonalNeighbors(x, y, grid) {
  yield* neighbors(x, y, grid, orthogonalDeltas);
}
exports.orthogonalNeighbors = orthogonalNeighbors;

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
