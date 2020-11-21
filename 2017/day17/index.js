const input = 359;
const buf = [0];
let idx = 0;

for (let i = 1; i <= 2017; ++i) {
  idx = ((idx + input) % buf.length) + 1;
  buf.splice(idx, 0, i);
}

const partOne = buf[idx + 1];
console.log("part one", partOne); // 1506

idx = 0;
let zeroIdx = 0;
let afterVal = -1;

for (let i = 1; i <= 50_000_000; ++i) {
  idx = (idx + input + 1) % i;

  if (idx < zeroIdx) {
    ++zeroIdx;
  } else if (idx === zeroIdx) {
    afterVal = i;
  }

  // console.log(i, idx, zeroIdx, afterVal)
  // if(i%100_000 === 0) console.log(i)
}

const partTwo = afterVal;
console.log("part two", partTwo); // 39479736
