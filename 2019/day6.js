const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const DefaultDict = require("../helpers/defaultdict");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input/day6.txt"))
  .toString()
  .trim()
  .split("\n");

// this was a shitty way to go, but my mind blanked on graph structures in the moment.
// I never would have gone this route if I'd thought it through, I should have kept orbiting values in arrays.
const orbits = Object.fromEntries(input.map(line => line.split(")").reverse()));
const counts = new DefaultDict(0);

const incr = orbiting => {
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
const getPath = orbiting => {
  const res = [];
  while (orbiting !== "COM") {
    orbiting = orbits[orbiting];
    res.push(orbiting);
  }

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
