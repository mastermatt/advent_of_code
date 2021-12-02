const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

let hor = 0;
let dep = 0;

for (const line of input) {
  const [dir, num] = line.split(" ");
  const n = Number(num);
  if (dir === "forward") {
    hor += n;
    continue;
  }

  dep += dir === "down" ? n : -n;
}

const partOne = hor * dep;
console.log("part one", partOne); // 2117664

// down X increases your aim by X units.
// up X decreases your aim by X units.
// forward X does two things:
// It increases your horizontal position by X units.
// It increases your depth by your aim multiplied by X.

hor = 0;
dep = 0;
let aim = 0;

for (const line of input) {
  const [dir, num] = line.split(" ");
  const n = Number(num);
  if (dir === "down") {
    aim += n;
    continue;
  }
  if (dir === "up") {
    aim -= n;
    continue;
  }

  hor += n;
  dep += aim * n;
}

const partTwo = hor * dep;
console.log("part two", partTwo); // 2073416724
