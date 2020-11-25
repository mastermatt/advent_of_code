const lodash = require("lodash");
const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>
const reInput = /p=<\s*([\d-]+),\s*([\d-]+),\s*([\d-]+)>, v=<\s*([\d-]+),\s*([\d-]+),\s*([\d-]+)>, a=<\s*([\d-]+),\s*([\d-]+),\s*([\d-]+)>/;

const positions = [];
const velocities = [];
const accelerations = [];

input.forEach(line => {
  const match = line.match(reInput);
  positions.push([parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]);
  velocities.push([parseInt(match[4]), parseInt(match[5]), parseInt(match[6])]);
  accelerations.push([
    parseInt(match[7]),
    parseInt(match[8]),
    parseInt(match[9])
  ]);
});

const sumAbs = ([x, y, z]) => Math.abs(x) + Math.abs(y) + Math.abs(z);

const sorted = lodash
  .range(input.length)
  .sort(
    (a, b) =>
      sumAbs(accelerations[a]) - sumAbs(accelerations[b]) ||
      sumAbs(velocities[a]) - sumAbs(velocities[b])
  );

const partOne = sorted[0];
console.log("part one", partOne); // 157

function stepTime() {
  for (let i = 0; i < positions.length; ++i) {
    positions[i][0] += velocities[i][0] += accelerations[i][0];
    positions[i][1] += velocities[i][1] += accelerations[i][1];
    positions[i][2] += velocities[i][2] += accelerations[i][2];
  }
}

function removeCollisions() {
  const map = new DefaultDict(Array);
  for (let i = 0; i < positions.length; ++i) {
    map[positions[i]].push(i);
  }

  const indexes = Object.values(map)
    .filter(list => list.length > 1)
    .flat()
    // sort so we can splice from the array in a way that wont waste our time :(
    .sort((a, b) => b - a);

  for (const idx of indexes) {
    positions.splice(idx, 1);
    velocities.splice(idx, 1);
    accelerations.splice(idx, 1);
  }
}

let attempts = 0;
while (1000 > attempts++) {
  stepTime();
  removeCollisions();
  // console.log(attempts, positions.length);
}

const partTwo = positions.length;
console.log("part two", partTwo); // 499 after 39 steps
