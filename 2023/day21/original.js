const readFile = require("../../helpers/readFile");
const CoordinateSet = require("../../helpers/coordinateSet");
const { orthogonalNeighbors } = require("../../helpers/gird");

const input = readFile(__dirname, "./input.txt");

const sx = (input[0].length / 2) | 0;
const sy = (input.length / 2) | 0;

let seta = new CoordinateSet([[sx, sy]]);
let setb = new CoordinateSet();

for (let i = 0; i < 64; i++) {
  for (const [x, y] of seta.values()) {
    for (const [char, xn, yn] of orthogonalNeighbors(x, y, input)) {
      if (char !== "#") setb.add(xn, yn);
    }
  }

  const a = seta;
  seta = setb;
  setb = a;
  setb.clear();
}

const partOne = seta.size;
console.log("part one", partOne, partOne === 3782);

const partTwo = null;
console.log("part two", partTwo, partTwo === undefined);
