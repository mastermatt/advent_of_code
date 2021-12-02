const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) => {
  const [dir, num] = line.split(" ");
  return [dir, Number(num)];
});

function partOne() {
  let hor = 0;
  let dep = 0;

  for (const [dir, num] of input) {
    if (dir === "forward") {
      hor += num;
    } else {
      dep += dir === "down" ? num : -num;
    }
  }

  return hor * dep;
}

console.log("part one", partOne()); // 2117664

// down X increases your aim by X units.
// up X decreases your aim by X units.
// forward X does two things:
//    It increases your horizontal position by X units.
//    It increases your depth by your aim multiplied by X.
function partTwo() {
  let hor = 0;
  let dep = 0;
  let aim = 0;

  for (const [dir, num] of input) {
    if (dir === "forward") {
      hor += num;
      dep += aim * num;
    } else {
      aim += dir === "down" ? num : -num;
    }
  }

  return hor * dep;
}

console.log("part two", partTwo()); // 2073416724
