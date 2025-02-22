const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const isPulled = (x, y) => {
  const comp = new Computer([...input], x, y);
  comp.execute();
  return comp.readNext();
};

const range = lodash.range(50);
let partOne = 0;

const grid = range.map((y) => {
  return range.map((x) => {
    const result = isPulled(x, y);
    partOne += result;
    return result ? "#" : ".";
  });
});

console.log("partOne", partOne); // 197

grid.forEach((line) => console.log(line.join("")));

let x;
let y = 1000;
const shipSize = 100;

while (true) {
  x = y;
  // console.log(y)
  while (!isPulled(x, y)) {
    x--;
  }

  if (isPulled(x - shipSize + 1, y + shipSize - 1)) {
    break;
  }
  y++;
}

const partTwo = (x - shipSize + 1) * 10000 + y;
// console.log("yes", x-shipSize+1, y, partTwo)
console.log("part two", partTwo); // 9181022
// 5,6 15,17 23,26

// #.................................................
// ..................................................
// ..................................................
// ..................................................
// ..................................................
// ..................................................
// .....#............................................
// ......#...........................................
// .......#..........................................
// ........#.........................................
// .........#........................................
// ..........#.......................................
// ..........##......................................
// ...........##.....................................
// ............##....................................
// .............##...................................
// ..............##..................................
// ..............#O#.................................
// ...............###................................
// ................###...............................
// .................###..............................
// ..................###.............................
// ...................###............................
// ...................####...........................
// ....................####..........................
// .....................####.........................
// ......................#O##........................
// .......................####.......................
// .......................#####......................
// ........................#####.....................
// .........................#####....................
// ..........................#####...................
// ...........................#####..................
// ............................#####.................
// ............................######................
// .............................######...............
// ..............................######..............
// ...............................######.............
// ................................######............
// ................................#######...........
// .................................#######..........
// ..................................#######.........
// ...................................#######........
// ....................................#######.......
// .....................................#######......
// .....................................########.....
// ......................................########....
// .......................................########...
// ........................................########..
// .........................................########.
