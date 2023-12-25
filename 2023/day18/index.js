const readFile = require("../../helpers/readFile");
const { orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

// Shoelace formula and Pick's theorem (had to look that one up)
function area(plans) {
  let total = 0;
  let ax = 0;
  let ay = 0;

  for (const [v, dist] of plans) {
    const [dx, dy] = orthogonalDeltas[v];
    const bx = ax + dx * dist;
    const by = ay + dy * dist;

    total += (ax * by - ay * bx + Math.abs(bx - ax + by - ay)) / 2;
    ax = bx;
    ay = by;
  }

  return total + 1;
}

const partOnePlans = input.map((line) => {
  const [dir, distStr] = line.split(" ");
  const dirMap = { D: 0, R: 1, U: 2, L: 3 };
  return [dirMap[dir], Number(distStr)];
});

const partOne = area(partOnePlans);
console.log("part one", partOne, partOne === 72821);

const partTwoPlans = input.map((line) => {
  const color = line.split(" ").pop();
  // the direction to dig: 0 means R, 1 means D, 2 means L, and 3 means U.
  const dirMap = { 0: 1, 1: 0, 2: 3, 3: 2 };
  return [dirMap[color[7]], parseInt(color.substring(2, 7), 16)];
});

const partTwo = area(partTwoPlans);
console.log("part two", partTwo, partTwo === 127844509405501);
