const readFile = require("../../helpers/readFile");

console.time("parse input");
const input = readFile(__dirname, "./input.txt").map((line) => {
  const flag = line.startsWith("on");
  const coords = line.match(/-?\d+/g).map(Number);
  return [flag, coords];
});
console.timeEnd("parse input");
// off x=10079..23835,y=68428..73664,z=21838..38598

const smalls = input.slice(0, 20);
// console.log(smalls);

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

function totalCuboids(cubes) {
  // for each cube, look at all the future cubes for intersections
  // if zero, add countCuboids(cube)
  // if one, add countCuboids(cube) - countCuboids(intersection)
  // if two, add countCuboids(cube) - (countCuboids(intersection1) + countCuboids(intersection1) - countCuboids(crossIntersection))
  let result = 0;
  for (let i = 0; i < cubes.length; i++) {
    result += countCuboids(cubes[i]);

    const intersections = [];
    for (let j = i + 1; j < cubes.length; j++) {
      const intersection = cubeIntersection(cubes[i], cubes[j]);
      if (intersection) intersections.push(intersection);
    }
    if (intersections.length) result -= totalCuboids(intersections);
  }
  return result;
}

console.time("part one");
let smallCnt = 0;
for (let i = 0; i < smalls.length; i++) {
  const [isOn, coords] = smalls[i];
  if (!isOn) continue;

  smallCnt += countCuboids(coords);

  const intersections = [];
  for (let j = i + 1; j < smalls.length; j++) {
    const intersection = cubeIntersection(coords, smalls[j][1]);
    if (intersection) intersections.push(intersection);
  }
  if (intersections.length) smallCnt -= totalCuboids(intersections);
}
console.timeEnd("part one"); // 8.642ms

//   ----|------------|----------
//   --|------------|----------
//   ---------------------||-----
//   -||------------------------

const partOne = smallCnt;
console.log("part one", partOne, partOne === 644257);

console.time("part two");
let bigCnt = 0;
for (let i = 0; i < input.length; i++) {
  const [isOn, coords] = input[i];
  if (!isOn) continue;

  bigCnt += countCuboids(coords);

  const intersections = [];
  for (let j = i + 1; j < input.length; j++) {
    const intersection = cubeIntersection(coords, input[j][1]);
    if (intersection) intersections.push(intersection);
  }
  if (intersections.length) bigCnt -= totalCuboids(intersections);
}

console.timeEnd("part two"); // 14.813ms
const partTwo = bigCnt;
console.log("part two", partTwo, partTwo === 1235484513229032);
