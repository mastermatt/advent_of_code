const readFile = require("../../helpers/readFile");

const targetTime = 2503;
// Vixen can fly 8 km/s for 8 seconds, but then must rest for 53 seconds.
const regexp =
  /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds\./;
const input = readFile(__dirname, "./input.txt").map((line) =>
  line
    .match(regexp)
    .slice(2, 5)
    .map((digits) => parseInt(digits))
);

function getDistances(time) {
  return input.map(([velocity, go, rest]) => {
    const cycle = go + rest;
    const moving = go * ((time / cycle) | 0) + Math.min(go, time % cycle);
    return moving * velocity;
  });
}

const partOne = Math.max(...getDistances(targetTime));
console.log("part one", partOne); // 2655

const points = new Array(input.length).fill(0);

for (let i = 1; i <= targetTime; i++) {
  const distances = getDistances(i);
  const max = Math.max(...distances);
  distances.forEach((dist, idx) => {
    if (dist === max) ++points[idx];
  });
}

const partTwo = Math.max(...points);
console.log("part two", partTwo); // 1059
