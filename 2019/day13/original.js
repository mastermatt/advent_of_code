const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const screen = [];

const comp = new Computer([...input]);
comp.execute();

while (comp.outBuf.length) {
  const x = comp.readNext();
  const y = comp.readNext();
  const obj = comp.readNext();

  if (!screen[y]) {
    screen[y] = [0];
  }

  screen[y][x] = obj;
}

const partOne = lodash.sum(
  screen.map((line) => {
    return line.filter((a) => a === 2).length;
  }),
);

console.log("step one", partOne); // 286

const printScreen = (screen) => {
  const pixelMap = {
    0: " ",
    1: "#",
    2: "x",
    3: "-",
    4: "*",
  };

  // 0 is an empty tile. No game object appears in this tile.
  // 1 is a wall tile. Walls are indestructible barriers.
  // 2 is a block tile. Blocks can be broken by the ball.
  // 3 is a horizontal paddle tile. The paddle is indestructible.
  // 4 is a ball tile. The ball moves diagonally and bounces off objects.
  screen.forEach((line) => {
    const pixels = line.map((c) => pixelMap[c]);
    console.log(pixels.join(""));
  });
};

const inputDup = [...input];
inputDup[0] = 2; // free games
const comp2 = new Computer(inputDup, 0, 0, 0, 0);
// comp2.execute()
const screen2 = [];
let score = 0;
let ballX = 0;
let paddleX = 0;

let limit = 10000;
while (!comp2.halted && limit--) {
  // console.log(comp2.outBuf.length);

  const joy = ballX === paddleX ? 0 : ballX < paddleX ? -1 : 1;
  comp2.writeAndExec(joy);

  while (comp2.outBuf.length) {
    const x = comp2.readNext();
    const y = comp2.readNext();
    const obj = comp2.readNext();

    if (x === -1 && y === 0) {
      score = obj;
      // console.log("score", score);
      continue;
    }

    if (obj === 3) {
      paddleX = x;
    }

    if (obj === 4) {
      ballX = x;
    }

    if (!screen2[y]) {
      screen2[y] = [0];
    }

    screen2[y][x] = obj;
  }

  // printScreen(screen2)
  // console.log("SCORE:", score)
  // console.log("halted?", comp2.halted)
  // break;
}

printScreen(screen2);
const partTwo = score;
console.log("step two", partTwo); // 14538
