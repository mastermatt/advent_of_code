const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

//   \ n  /
// nw +--+ ne
//   /    \
// -+      +-
//   \    /
// sw +--+ se
//   / s  \

const steps = input[0].split(",");
console.log(lodash.countBy(steps));
// { n: 1265, ne: 1019, se: 1382, s: 1344, sw: 1482, nw: 1731 } remove back and forth
// { n: 0, ne: 0, se: 0, s: 79, sw: 463, nw: 349 } s->sw->nw == sw->sw
// { n: 0, ne: 0, se: 0, s: 0, sw: 542, nw: 270 }

const partOne = 812;
console.log("part one", partOne); // 812

// part one was done by hand. now need to automate the calc so I can run it for all steps

function dist(steps) {
  const counts = lodash.countBy(steps);
  const a = Math.abs(counts["n"] - counts["s"]) || 0;
  const b = Math.abs(counts["ne"] - counts["sw"]) || 0;
  const c = Math.abs(counts["nw"] - counts["se"]) || 0;
  const sorted = lodash.sortBy([a, b, c]);
  const shortest = sorted[1] + sorted[2];
  // console.log("###", counts, a, b, c, sorted, shortest)
  return shortest;
}

let furthest = 0;
for (let i = 1; i <= steps.length; i++) {
  furthest = Math.max(furthest, dist(steps.slice(0, i)));
}

const partTwo = furthest;
console.log("part two", partTwo); // 1603
