const input = [0, 6, 1, 7, 2, 19, 20];

function run(loops) {
  const map = new Map([...input.map((val, idx) => [val, idx])]);

  let last = 0;
  let next = 0;
  for (let i = input.length; i < loops; ++i) {
    const lastIdx = map.get(next);
    map.set(next, i);
    last = next;
    next = lastIdx === undefined ? 0 : i - lastIdx;
  }

  return last;
}

const partOne = run(2020);
console.log("part one", partOne); // 706

const partTwo = run(30_000_000);
console.log("part two", partTwo); // 19331
