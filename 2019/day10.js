const DefaultDict = require("../helpers/defaultdict");
const readFile = require("../helpers/readFile");

const input = readFile(__dirname, "./input/day10.txt");

// an array of [x,y] coordinates of all the asteroids
const positions = [];
input.forEach((line, y) => {
  line.split("").forEach((c, x) => {
    if (c === "#") {
      positions.push([x, y]);
    }
  });
});

// NB. this starts degrees at the 12 o'clock position and increases _clockwise_ [0-360)°
const calcAngleDegrees = (x, y) =>
  ((Math.atan2(y, -x) * -180) / Math.PI + 270) % 360;

// returns an object, keyed by degree angles, with array values that contain
// the [x,y] coordinates for all the asteroids along that angle.
const getVisibleAsteroids = (x1, y1) => {
  const results = new DefaultDict(Array);
  positions
    .filter(([x2, y2]) => !(x1 === x2 && y1 === y2)) // remove asteroid under test
    .forEach(([x2, y2]) => {
      const angle = calcAngleDegrees(x2 - x1, y2 - y1);

      // the floating point number is going to be converted to a string in order to key in
      // this object. we're relying on precision being good enough for our purposes.
      results[angle].push([x2, y2]);
    });
  return results;
};

// we could get tricky and cache results, since if asteroid A sees B, the B also sees A. However,
// it's not worth it for our input size. Do O(n^2) loops to see how many asteroids each asteroid can see.
const counts = positions
  .map(([x, y]) => getVisibleAsteroids(x, y))
  .map(visibles => Object.keys(visibles).length);

const partOne = Math.max(...counts);
console.log("part one", partOne); // 292

// These values are specific to my input, they were found by logging coordinates and visible
// length above then I just searched for the pair that matched part one's answer.
const stationX = 20;
const stationY = 20;

const visibleToStation = new DefaultDict(Array);

positions
  .filter(([x, y]) => !(x === stationX && y === stationY)) // remove the station itself
  .forEach(([x, y]) => {
    const angle = calcAngleDegrees(x - stationX, y - stationY);
    visibleToStation[angle].push([x, y]);
  });

// sort the asteroids along the same angles from closest to farthest (<- @orez- 😀)
const dist = (x, y) => Math.sqrt((stationX - x) ** 2 + (stationY - y) ** 2);
Object.values(visibleToStation).forEach(coordinates =>
  coordinates.sort((a, b) => dist(...a) - dist(...b))
);

const vaporizedCoordinates = [];
while (Object.keys(visibleToStation).length) {
  // sorting the angles numerically will allow us to "rotate" clockwise
  const sortedAngles = Object.keys(visibleToStation).sort((a, b) => a - b);

  // dequeue the closed asteroid from each angle, remove the angle if its array is depleted
  sortedAngles.forEach(angle => {
    vaporizedCoordinates.push(visibleToStation[angle].shift());
    if (!visibleToStation[angle].length) {
      delete visibleToStation[angle];
    }
  });
}

const twoHundredthVaporized = vaporizedCoordinates[199];

const partTwo = twoHundredthVaporized[0] * 100 + twoHundredthVaporized[1];
console.log("part two", partTwo); // 317
