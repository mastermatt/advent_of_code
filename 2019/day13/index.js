const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0]
  .split(",")
  .map(Number);

// 0 is an empty tile. No game object appears in this tile.
// 1 is a wall tile. Walls are indestructible barriers.
// 2 is a block tile. Blocks can be broken by the ball.
// 3 is a horizontal paddle tile. The paddle is indestructible.
// 4 is a ball tile. The ball moves diagonally and bounces off objects.
const TILE_EMPTY = 0;
const TILE_WALL = 1;
const TILE_BLOCK = 2;
const TILE_PADDLE = 3;
const TILE_BALL = 4;

const comp = new Computer([...input]);
comp.execute();
let numBlocks = 0;

for (let i = 2; i < comp.outBuf.length; i += 3) {
  if (comp.outBuf[i] === TILE_BLOCK) {
    numBlocks++;
  }
}

console.log("step one", numBlocks); // 286

const printScreen = screen => {
  const pixelMap = {
    [TILE_EMPTY]: " ",
    [TILE_WALL]: "#",
    [TILE_BLOCK]: "x",
    [TILE_PADDLE]: "-",
    [TILE_BALL]: "*"
  };

  screen.forEach(line => {
    const pixels = line.map(c => pixelMap[c]);
    console.log(pixels.join(""));
  });
};

const inputDup = [...input];
inputDup[0] = 2; // free games

const comp2 = new Computer(inputDup);
let score = 0;
let ballX = 0;
let paddleX = 0;

// keeping track of what objects where rendered in which positions ended not being
// needed to solve the problem, but was instrumental in debugging.
const screen = [];

let limit = 10000;
while (!comp2.halted && limit--) {
  // console.log(comp2.outBuf.length);

  const joyDir = ballX === paddleX ? 0 : ballX < paddleX ? -1 : 1;
  comp2.writeAndExec(joyDir);

  while (comp2.hasOutput) {
    const [x, y, titleCode] = comp2.readChunk(3);

    if (x === -1 && y === 0) {
      score = titleCode;
      continue;
    }

    if (titleCode === TILE_PADDLE) {
      paddleX = x;
    }

    if (titleCode === TILE_BALL) {
      ballX = x;
    }

    // if (!screen[y]) {
    //   screen[y] = [];
    // }
    // screen[y][x] = titleCode;
  }

  // printScreen(screen)
  // console.log("SCORE:", score)
}

printScreen(screen);
const partTwo = score;
console.log("step two", partTwo); // 14538
