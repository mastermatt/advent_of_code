const readFile = require("../../helpers/readFile");
const {
  generateCoords,
  neighbors,
  diagonalDeltas,
} = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

let partOne = 0;

for (const [x, y] of generateCoords(input.length, input[0].length)) {
  if (input[y][x] !== "X") continue;

  for (const [char, newX, newY, deltaX, deltaY] of neighbors(x, y, input)) {
    if (char !== "M") continue;

    const third = input[newY + deltaY] && input[newY + deltaY][newX + deltaX];
    const fourth =
      input[newY + deltaY * 2] && input[newY + deltaY * 2][newX + deltaX * 2];

    if (third === "A" && fourth === "S") partOne += 1;
  }
}

console.log("part one", partOne, partOne === 2434);

let partTwo = 0;

for (const [x, y] of generateCoords(input.length, input[0].length)) {
  if (input[y][x] !== "A") continue;

  let masCnt = 0;
  for (const [char, _newX, _newY, deltaX, deltaY] of neighbors(
    x,
    y,
    input,
    diagonalDeltas,
  )) {
    if (char !== "M") continue;

    const third = input[y - deltaY] && input[y - deltaY][x - deltaX];

    if (third === "S") masCnt += 1;
  }

  if (masCnt === 2) partTwo += 1;
}

console.log("part two", partTwo, partTwo === 1835);
