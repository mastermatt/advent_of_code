const input = [4, 1, 8, 9, 7, 6, 2, 3, 5];

const arr = [...input];
for (let i = 0; i < 100; i++) {
  const three = arr.splice(1, 3);
  let dest = -1;
  let label = arr[0];
  while (dest === -1) {
    label = (label + 9) % 10;
    dest = arr.indexOf(label);
  }
  arr.splice(dest + 1, 0, ...three);
  arr.push(arr.shift()); // rotate counter to keep "current" at index 0
}

while (arr[0] !== 1) arr.push(arr.shift());

const partOne = arr.slice(1).join("");
console.log("part one", partOne, partOne === "96342875"); // 96342875

// part two requires a linked hash map to be performant (~250ms).
// because all the vals are basically indexes, the map can be an array to avoid the stringification on the lookup
const numCups = 1_000_000;
const map = new Array(numCups);

for (let i = 1; i < input.length; ++i) {
  map[input[i - 1]] = input[i];
}
map[input[input.length - 1]] = input.length + 1;
for (let i = input.length + 1; i < numCups; ++i) {
  map[i] = i + 1;
}
map[numCups] = input[0];

let head = input[0];
for (let i = 0; i < 10_000_000; ++i) {
  // splice three
  const a = map[head];
  const b = map[a];
  const c = map[b];
  const d = map[c];
  map[head] = d;

  // find a valid destination label
  let label = head;
  while (true) {
    --label;
    if (label === 0) label = numCups;
    if (label !== a && label !== b && label !== c) break;
  }

  // insert the three after the destination
  map[c] = map[label];
  map[label] = a;

  // the next node is always the one right after where the three where spliced from
  head = d;
}

const partTwo = map[1] * map[map[1]];
console.log("part two", partTwo, partTwo === 563362809504); // 563362809504
