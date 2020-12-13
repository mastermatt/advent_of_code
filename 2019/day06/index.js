const lodash = require("lodash");

const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// Initial thoughts:
// this was a shitty way to go, but my mind blanked on graph structures in the moment.
// I never would have gone this route if I'd thought it through, I should have kept orbiting values in arrays.

// Thoughts the next morning:
// After a couple refactors, this ended up being not too bad given that the input isn't huge.
// The big problem was, when trying to solve it quickly, having the graph backwards made it difficult
// to wrap my head around what was happening on the root node during the counting. Specifically, I lost a lot of time
// by having an off-by-one bug for all direct orbits expect for the one value that orbits the root (COM).
// Refactoring the orbit map into two objects that track relationships and walk counts separately
// allowed for a lot of simplifying everywhere else.
const orbits = Object.fromEntries(
  input.map((line) => line.split(")").reverse())
);
const counts = new DefaultDict(0);

const incr = (orbiting) => {
  while (orbiting !== "COM") {
    orbiting = orbits[orbiting];
    counts[orbiting]++;
  }
};

Object.keys(orbits).forEach(incr);

const partOne = lodash.sum(Object.values(counts));
console.log("part one", partOne); // 162816

/**
                          YOU
                         /
        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
 */
const getPath = (orbiting) => {
  const res = [];
  while (orbiting !== "COM") {
    orbiting = orbits[orbiting];
    res.push(orbiting);
  }

  // Reversing here is just to shorten the line length of the `while` comparison below.
  // "Optimization" you say?
  return res.reverse();
};

// Since the orbits are keyed by the orbiting values, it seemed faster to walk the two paths
// down to the root, then compare how much of the paths were shared. A BFS probably wouldn't have
// been any faster to write.
const youPath = getPath("YOU");
const sanPath = getPath("SAN");
let shared = 0;

while (youPath[shared] === sanPath[shared]) {
  shared++;
}

const partTwo = youPath.length + sanPath.length - shared * 2;
console.log("part two", partTwo); // 304
