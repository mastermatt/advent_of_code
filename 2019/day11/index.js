const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

const comp = new Computer([...input]);
let x = 0;
let y = 0;
let fx = 0;
let fy = -1;

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
    positions[y] = [0];
  }
  positions[y][x] = newColor;

  // direction the robot should turn: 0 means it should turn left 90 degrees, and 1 means it should turn right 90 degrees.
  const turn = comp.readNext();
  [fx, fy] = turn ? [-fy, fx] : [fy, -fx];
  x += fx;
  y += fy;
}
// console.log(positions);
const partOne = Object.keys(grid).length;
console.log("part one", partOne); // 2088

const partTwo = positions
  .map(line => line.map(x => (x ? "█" : " ")).join(""))
  .join("\n");
console.log("part two:");
console.log(partTwo); // URCAFLCP
