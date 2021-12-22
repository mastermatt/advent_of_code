const readFile = require("../../helpers/readFile");

console.time("parse input");
const input = readFile(__dirname, "./input.txt").map((line) => {
  const isOn = line.startsWith("on");
  const coords = line.match(/-?\d+/g).map(Number);
  return [isOn, coords];
});
console.timeEnd("parse input");

function cubeIntersection(a, b) {
  if (
    a[0] > b[1] ||
    a[1] < b[0] ||
    a[2] > b[3] ||
    a[3] < b[2] ||
    a[4] > b[5] ||
    a[5] < b[4]
  )
    return null; // no overlap

  return [
    Math.max(a[0], b[0]),
    Math.min(a[1], b[1]),
    Math.max(a[2], b[2]),
    Math.min(a[3], b[3]),
    Math.max(a[4], b[4]),
    Math.min(a[5], b[5]),
  ];
}

function countCuboids(coords) {
  return (
    (Math.abs(coords[0] - coords[1]) + 1) *
    (Math.abs(coords[2] - coords[3]) + 1) *
    (Math.abs(coords[4] - coords[5]) + 1)
  );
}

// The sum of all the cuboids in all the cubes, without double counting overlaps
function totalCuboids(cubes, onlyFirst) {
  let result = 0;
  const end = onlyFirst ? 1 : cubes.length;
  for (let i = 0; i < end; i++) {
    const cube = cubes[i];
    result += countCuboids(cube);

    const intersections = [];
    for (let j = i + 1; j < cubes.length; j++) {
      const intersection = cubeIntersection(cube, cubes[j]);
      if (intersection) intersections.push(intersection);
    }
    if (intersections.length) result -= totalCuboids(intersections);
  }
  return result;
}

// For every step that is 'on', count the cuboids not affected by future steps
function runSteps(steps) {
  let onCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const [isOn] = steps[i];
    if (!isOn) continue;

    const cubes = steps.slice(i).map((step) => step[1]);
    onCount += totalCuboids(cubes, true);
  }

  return onCount;
}

console.time("part one");
const partOne = runSteps(input.slice(0, 20));
console.timeEnd("part one"); // 8.549ms
console.log("part one", partOne, partOne === 644257);

console.time("part two");
const partTwo = runSteps(input);
console.timeEnd("part two"); // 7.789ms
console.log("part two", partTwo, partTwo === 1235484513229032);
