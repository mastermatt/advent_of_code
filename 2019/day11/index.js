const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

const comp = new Computer([...input]);
let x = 0;
let y = 0;
let dir = 0;
const grid = {
  "0:0": 1 // this val changes for part one vs two
};

const positions = [];

while (!comp.halted) {
  const key = `${x}:${y}`;
  const currentColor = grid[key] || 0;
  comp.writeAndExec(currentColor);
  const newColor = comp.readNext();
  grid[key] = newColor;

  if (!positions[y]) {
    // ensure the 0th index is set otherwise it may not print right below
    positions[y] = [false];
  }
  positions[y][x] = !!newColor;

  const turnDir = comp.readNext();
  dir += turnDir ? 1 : 3;
  switch (dir % 4) {
    case 0:
      y--;
      break;
    case 1:
      x++;
      break;
    case 2:
      y++;
      break;
    case 3:
      x--;
      break;
    default:
      throw "unknown dir: " + dir;
  }
}
// console.log(grid);
const partOne = Object.keys(grid).length;
console.log("part one", partOne); // 2088

positions.forEach(line => {
  console.log(line.map(x => (x ? "█" : " ")).join("")); // URCAFLCP
});
