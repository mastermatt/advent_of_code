const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const comp = new Computer([...input]);
let x = 0;
let y = 0;
let dir = 0;
const grid = {
  "0:0": 1, // this val changes for part one vs two
};
const positions = Array(30);

while (!comp.halted) {
  const key = `${x}:${y}`;
  const currentColor = grid[key] || 0;
  comp.writeAndExec(currentColor);
  const newColor = comp.readNext();
  grid[key] = newColor;

  if (!positions[y + 20]) {
    positions[y + 20] = Array(50).fill(false);
  }
  positions[y + 20][x] = !!newColor;

  const turnDir = comp.readNext();
  dir = (dir + 360 + (turnDir ? 90 : -90)) % 360;
  switch (dir) {
    case 0:
      y++;
      break;
    case 90:
      x++;
      break;
    case 180:
      y--;
      break;
    case 270:
      x--;
      break;
    default:
      throw "unknown dir" + dir;
  }
}
console.log(grid);
const partOne = Object.keys(grid).length;
console.log("part one", partOne); // 2088

positions.forEach((ys) => {
  // console.log(ys);
  console.log(ys.map((x) => (x ? "■" : " ")).join(""));
});
// console.log(positions)
const partTwo = 2;
console.log("part two", partTwo); // URCAFLCP
