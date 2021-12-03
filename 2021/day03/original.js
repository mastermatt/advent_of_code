const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const a = input[0].length;
const total = input.length;

let b = "";
const c = new Array(a).fill(0);

for (const line of input) {
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "1") {
      c[i]++;
    }
  }
}

for (const d of c) {
  const e = d > total / 2 ? "1" : "0";
  b += e;
}

const gamma = parseInt(b, 2);

// https://stackoverflow.com/a/42450649/823942
const flipBits = function (v, digits) {
  return ~v & (Math.pow(2, digits) - 1);
};

const epsilon = flipBits(gamma, a);

const partOne = gamma * epsilon;
console.log("part one", partOne); // 845186

function commons(arr, tie) {
  const c = new Array(arr[0].length).fill(0);
  const h = arr.length / 2;

  for (const line of arr) {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "1") {
        c[i]++;
      }
    }
  }

  return c.map((d) => {
    if (d === h) return tie;

    return d > h ? "1" : "0";
  });
}

// To find oxygen generator rating, determine the most common value (0 or 1) in the current bit position,
// and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 1 in the position being considered.
function oxy() {
  let lines = [...input];

  for (let i = 0; i < a; i++) {
    const last = lines[lines.length - 1];
    const f = commons(lines, "1")[i];

    lines = lines.filter((line) => {
      return line[i] === f;
    });

    if (!lines.length) {
      return parseInt(last, 2);
    }
  }
  if (lines.length === 1) {
    return parseInt(lines[0], 2);
  }

  console.log("at the end", lines.length);
}

// To find CO2 scrubber rating, determine the least common value (0 or 1) in the current bit position,
// and keep only numbers with that bit in that position. If 0 and 1 are equally common, keep values with a 0 in the position being considered.
function co2() {
  let lines = [...input];

  for (let i = 0; i < a; i++) {
    const last = lines[lines.length - 1];
    const f = commons(lines, "1")[i];

    lines = lines.filter((line) => {
      return line[i] !== f;
    });

    if (!lines.length) {
      return parseInt(last, 2);
    }
  }
  if (lines.length === 1) {
    return parseInt(lines[0], 2);
  }

  console.log("at the end CO2", lines.length);
}

const oxygenRating = oxy();
const co2Rating = co2();
console.log("########", oxygenRating, co2Rating);
const partTwo = oxygenRating * co2Rating;
console.log("part two", partTwo); // 4636702
