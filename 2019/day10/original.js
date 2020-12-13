const lodash = require("lodash");

const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").map((line) =>
  line.split("").map((c) => c === "#")
);

// const h = input[0].length;
// const v = input.length;

const positions = [];
input.forEach((line, y) => {
  line.forEach((c, x) => {
    if (c) {
      positions.push([x, y]);
    }
  });
});

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function reduce(numerator, denominator) {
  const gcdv = gcd(numerator, denominator);
  if (gcdv === 0) return [0, 0];
  return [numerator / gcdv, denominator / gcdv];
}

const counts = [];

// const d = lodash.cloneDeep(input);
//
// console.log(positions);

// [[4,0]].forEach(([x1, y1]) => {
positions.forEach(([x1, y1]) => {
  let count = 0;
  positions.forEach(([x2, y2]) => {
    if (x1 === x2 && y1 === y2) {
      return; // same asteroid
    }
    // if(x2 === 4 && y2 === 3) {
    //   console.log("here")
    // }

    let [xd, yd] = reduce(Math.abs(x1 - x2), Math.abs(y1 - y2));
    if (x1 > x2) xd *= -1;
    if (y1 > y2) yd *= -1;
    let x3 = x1 + xd;
    let y3 = y1 + yd;
    // .#..#
    // .....
    // #####
    // ....#
    // ...##
    while (x3 !== x2 || y3 !== y2) {
      // console.log(x3 , x2 , y3 , y2)
      if (input[y3][x3]) {
        // d[y3][x3] = 4
        return; // collision
      }
      x3 += xd;
      y3 += yd;
    }

    // d[y2][x2] = 2
    count++;
  });
  //   d[y1][x1]=3
  // console.dir(d)
  //   d.forEach(e => console.log( e.map(Number).join("")))
  // console.log(x1, y1, count); // 20 20 292
  counts.push(count);
});

// console.log(counts);
const partOne = Math.max(...counts);
console.log("part one", partOne); // 292

const stationX = 20;
const stationY = 20;

function calcAngleDegrees(x, y) {
  const a = ((Math.atan2(y, -x) * -180) / Math.PI + 270) % 360;
  // console.log(x,y,a)
  return a;
}

const b = new DefaultDict(Array);
const dist = (x, y) => {
  return Math.sqrt((stationX - x) ** 2 + (stationY - y) ** 2);
};
positions
  .filter(([x, y]) => !(x === stationX && y === stationY))
  .forEach(([x, y]) => {
    const angle = calcAngleDegrees(x - stationX, y - stationY);

    b[angle].push([x, y]);
  });
// console.log(angles)

Object.values(b).forEach((q) => q.sort((a, b) => dist(...a) - dist(...b)));

const vaporizedCoordinates = [];
while (Object.keys(b).length) {
  const sortedAngles = Object.keys(b).sort((a, b) => a - b);

  sortedAngles.forEach((angle) => {
    vaporizedCoordinates.push(b[angle].shift());
    if (!b[angle].length) {
      delete b[angle];
    }
  });

  // console.log("######", vaporizedCoordinates.length);
}

// console.log(sortedAngles)
// console.dir(b)
// console.dir(vaporizedCoordinates);
// console.dir(vaporizedCoordinates.length);
// console.dir(vaporizedCoordinates[199]);
const twoHundredVaporized = vaporizedCoordinates[199];

const partTwo = twoHundredVaporized[0] * 100 + twoHundredVaporized[1];
console.log("part two", partTwo); // 317
