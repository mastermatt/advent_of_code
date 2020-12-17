const readFile = require("../../helpers/readFile");
const { manhattanDistance, orthogonalDeltas } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const dirs = "NESW";
const instructions = input.map((line) => [line[0], parseInt(line.slice(1))]);

function step(x, y, dir, action, amount) {
  const dirIdx = dirs.indexOf(dir);

  if ("LR".includes(action)) {
    const rotIdx = (amount / 90) * (action === "R" ? 1 : -1);
    const newDirIdx = (4 + dirIdx + rotIdx) % 4;
    return [x, y, dirs[newDirIdx]];
  }

  const cartIdx = action === "F" ? dirIdx : dirs.indexOf(action);
  const [dx, dy] = orthogonalDeltas[cartIdx];
  return [x + dx * amount, y + dy * amount, dir];
}

function one() {
  let vector = [0, 0, "E"];
  for (const inst of instructions) {
    vector = step(...vector, ...inst);
    // console.log(...vector, ...inst);
  }

  return manhattanDistance([0, 0], [vector[0], vector[1]]);
}

const partOne = one();
console.log("part one", partOne); // 2847

function step2(sx, sy, wx, wy, action, amount) {
  if (action === "F") {
    return [sx + wx * amount, sy + wy * amount, wx, wy];
  }

  if (dirs.includes(action)) {
    const cartIdx = dirs.indexOf(action);
    const [dx, dy] = orthogonalDeltas[cartIdx];
    return [sx, sy, wx + dx * amount, wy + dy * amount];
  }

  const rots = [[], [wy, -wx], [-wx, -wy], [-wy, wx]];
  const rotIdx = (4 + (amount / 90) * (action === "R" ? 1 : -1)) % 4;
  return [sx, sy, ...rots[rotIdx]];
}

function two() {
  let positions = [0, 0, 10, 1];
  for (const inst of instructions) {
    positions = step2(...positions, ...inst);
  }

  return manhattanDistance([0, 0], [positions[0], positions[1]]);
}

const partTwo = two();
console.log("part two", partTwo); // 29839
