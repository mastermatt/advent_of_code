const fs = require("fs");
const lodash = require("lodash");
const path = require("path");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"))
  .toString()
  .trim()
  .split("\n");

const map = {
  COM: {
    // orbits: a,
    count: 0
  }
};

const incr = (i, x) => {
  if (i === "COM") {
    return x;
  }
  // console.log(i, map[i].orbits)
  if (!map[i]) {
    return x;
  }

  x++;
  map[i].count++;
  // if (map[i].orbits!=='COM') {
  return incr(map[i].orbits, x);
  // }
};

input.forEach(line => {
  const [a, b] = line.split(")");

  map[b] = {
    orbits: a,
    count: 1
  };
});

Object.values(map).forEach(v => {
  const x = incr(v.orbits, 0);
  // console.log( v.orbits, x)
});

// console.log(map)
const counts = Object.values(map).map(v => v.count);
const partOne = lodash.sum(counts);
console.log("part one", partOne); // 162816

/**
 *                           YOU
                         /
        G - H       J - K - L
       /           /
COM - B - C - D - E - F
               \
                I - SAN
 */
const aaa = s => {
  const res = [];
  while (s !== "COM") {
    res.push(map[s].orbits);
    s = map[s].orbits;
  }

  return res;
};
// console.log(aaa("YOU"))
// console.log(aaa("SAN"))
const foo = aaa("YOU");
const bar = aaa("SAN");

while (foo[foo.length - 1] === bar[bar.length - 1]) {
  foo.pop();
  bar.pop();
}
// console.log(foo, bar)

const partTwo = foo.length + bar.length;
console.log("part two", partTwo); // 304
