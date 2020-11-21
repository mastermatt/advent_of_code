const genAStart = 883;
const genBStart = 879;

const genAFactor = 16807;
const genBFactor = 48271;

const mod = 2147483647; // 2^32-1
const mask = (1 << 16) - 1;

let genACurr = genAStart;
let genBCurr = genBStart;
let judgesCount = 0;

for (let i = 0; i < 40_000_000; ++i) {
  genACurr = (genACurr * genAFactor) % mod;
  genBCurr = (genBCurr * genBFactor) % mod;
  if ((genACurr & mask) === (genBCurr & mask)) {
    ++judgesCount;
  }
}

const partOne = judgesCount;
console.log("part one", partOne); // 609

function* gen(val, factor, filter) {
  while (true) {
    val = (val * factor) % mod;
    if (val % filter === 0) yield val;
  }
}

const genA = gen(genAStart, genAFactor, 4);
const genB = gen(genBStart, genBFactor, 8);
judgesCount = 0;

for (let i = 0; i < 5_000_000; ++i) {
  const aLower = genA.next().value & mask;
  const bLower = genB.next().value & mask;
  if (aLower === bLower) {
    ++judgesCount;
  }
}

const partTwo = judgesCount;
console.log("part two", partTwo); // 253
