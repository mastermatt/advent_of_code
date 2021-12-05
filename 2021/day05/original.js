const readFile = require("../../helpers/readFile");
const CoordinateMap = require("../../helpers/coordinateMap");

// const input = readFile(__dirname, "./example.txt").map(line => {
const input = readFile(__dirname, "./input.txt").map((line) => {
  const a = line.split(" -> ");
  return a.map((pair) => {
    return pair.split(",").map(Number);
  });
});

console.log(input[0]);

let map = new CoordinateMap();

// For now, only consider horizontal and vertical lines: lines where either x1 = x2 or y1 = y2.
for (const row of input) {
  const [[x1, y1], [x2, y2]] = row;

  if (x1 === x2) {
    const [y1s, y2s] = [y1, y2].sort((a, b) => a - b);
    for (let y = y1s; y <= y2s; y++) {
      const curr = map.get(x1, y) || 0;
      map.set(x1, y, curr + 1);
    }
  }
  if (y1 === y2) {
    const [x1s, x2s] = [x1, x2].sort((a, b) => a - b);
    for (let x = x1s; x <= x2s; x++) {
      const curr = map.get(x, y1) || 0;
      map.set(x, y1, curr + 1);
      // console.log(row, y1, x, curr+1);
    }
  }
}

// console.log(map);

// for (let i = 0; i < 10; i++) {
//   for (let j = 0; j < 10; j++) {
//
//     const val = map.get(j, i) || '.'
//     process.stdout.write(val+ '')
//   }
//   process.stdout.write('\n')
// }

const partOne = [...map.entries()].filter(([_, num]) => num > 1).length;
console.log("part one", partOne, partOne === 4826); //
// no 3471
// no 4103
// no 4211

map = new CoordinateMap();

for (const row of input) {
  const [[x1, y1], [x2, y2]] = row;

  if (x1 === x2) {
    const [y1s, y2s] = [y1, y2].sort((a, b) => a - b);
    for (let y = y1s; y <= y2s; y++) {
      const curr = map.get(x1, y) || 0;
      map.set(x1, y, curr + 1);
    }
    continue;
  }

  if (y1 === y2) {
    const [x1s, x2s] = [x1, x2].sort((a, b) => a - b);
    for (let x = x1s; x <= x2s; x++) {
      const curr = map.get(x, y1) || 0;
      map.set(x, y1, curr + 1);
    }
    continue;
  }

  const xd = x1 > x2 ? -1 : 1;
  const yd = y1 > y2 ? -1 : 1;

  for (let x = x1, y = y1; ; x += xd, y += yd) {
    const curr = map.get(x, y) || 0;
    map.set(x, y, curr + 1);
    if (x === x2) break;
  }
}

// for (let i = 0; i < 10; i++) {
//   for (let j = 0; j < 10; j++) {
//
//     const val = map.get(j, i) || '.'
//     process.stdout.write(val+ '')
//   }
//   process.stdout.write('\n')
// }

const partTwo = [...map.entries()].filter(([_, num]) => num > 1).length;
console.log("part two", partTwo, partTwo === 16793);
// no 16772
// no 18258
// no 71459

// 1.1....11.
// .111...2..
// ..2.1.111.
// ...1.2.2..
// .112313211
// ...1.2....
// ..1...1...
// .1.....1..
// 1.......1.
// 222111....

// 1......11.
// .111...2..
// ..2.1.11..
// ...1.2.2..
// .112313211
// ...1.2....
// ..1...1...
// .1.....1..
// ..........
// 222111....
