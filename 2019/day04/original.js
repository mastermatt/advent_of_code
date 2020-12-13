const lodash = require("lodash");
const start = 236491;
const end = 713787;

const hasRepeats = (str) => {
  for (let i = 1; i < 6; i++) {
    if (str[i] === str[i - 1]) {
      return true;
    }
  }
  return false;
};

// this looks for sequential values, but because ascending values was the
// other criteria, this could have been simpler.
const hasDoubles = (str) => {
  const x = [[str[0]]];

  for (let i = 1; i < 6; i++) {
    if (str[i] !== str[i - 1]) {
      x.push([]);
    }
    x[x.length - 1].push(str[i]);
  }
  // console.log(str, x, x.map(y => y.length))

  return x.map((y) => y.length).some((l) => l === 2);
};

const ascending = (str) => str.split("").sort().join("") === str;

console.log("### test 112233", hasDoubles("112233"));
console.log("### test 123444", hasDoubles("123444"));
console.log("### test 111122", hasDoubles("111122"));

let partOne = 0;
let partTwo = 0;
for (let i = start; i < end; i++) {
  const str = String(i);
  if (hasRepeats(str) && ascending(str)) {
    partOne++;
  }
  if (hasDoubles(str) && ascending(str)) {
    partTwo++;
  }
}

console.log("part one:", partOne); // 1169

console.log("part two:", partTwo); // 757
