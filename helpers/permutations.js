/**
 * taken from https://gist.github.com/justinfay/f30d53f8b85a274aee57
 * https://docs.python.org/2/library/itertools.html#itertools.permutations
 *
 * permutations('ABCD', 2) --> AB AC AD BA BC BD CA CB CD DA DB DC
 * permutations(range(3)) --> 012 021 102 120 201 210
 */
function permutations(array, r) {
  // Algorithm copied from Python `itertools.permutations`.
  const n = array.length;
  if (r === undefined) {
    r = n;
  }
  if (r > n) {
    return;
  }
  let indices = [];
  for (let i = 0; i < n; i++) {
    indices.push(i);
  }
  const cycles = [];
  for (let i = n; i > n - r; i--) {
    cycles.push(i);
  }
  const results = [];
  const res = [];
  for (let i = 0; i < r; i++) {
    res.push(array[indices[i]]);
  }
  results.push(res);

  let broken = false;
  while (n > 0) {
    for (let i = r - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        indices = indices
          .slice(0, i)
          .concat(indices.slice(i + 1).concat(indices.slice(i, i + 1)));
        cycles[i] = n - i;
        broken = false;
      } else {
        const j = cycles[i];
        const x = indices[i];
        indices[i] = indices[n - j];
        indices[n - j] = x;
        const res = [];
        for (let k = 0; k < r; k++) {
          res.push(array[indices[k]]);
        }
        results.push(res);
        broken = true;
        break;
      }
    }
    if (broken === false) {
      break;
    }
  }
  return results;
}

module.exports = permutations;
