const fs = require("fs");
const path = require("path");

const [aWireDirs, bWireDirs] = fs
  .readFileSync(path.resolve(__dirname, "./input.txt"))
  .toString()
  .split("\n");

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    return new Point(this.x + vector.x, this.y + vector.y);
  }
}

const origin = new Point(0, 0);

class Line {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  get isHorizontal() {
    return this.a.y === this.b.y;
  }

  get length() {
    return distance(this.a, this.b);
  }

  static length(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  intersection(other) {
    if (this.isHorizontal === other.isHorizontal) {
      return null;
    }

    const [h, v] = this.isHorizontal ? [this, other] : [other, this];

    if (between(v.a.x, h.a.x, h.b.x) && between(h.a.y, v.a.y, v.b.y)) {
      return new Point(v.a.x, h.a.y);
    }
    return null;
  }
}

// checks if Point `a` is between `b` and `c` without caring about direction
const between = (a, b, c) => (b < c ? a > b && a < c : a > c && a < b);

// Manhattan distance of two points
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const dirToVector = (input) => {
  const [dir, ...rest] = input;
  let dis = Number(rest.join(""));
  if (dir === "D" || dir === "L") {
    dis *= -1;
  }

  return dir === "R" || dir === "L" ? new Point(dis, 0) : new Point(0, dis);
};

const dirsToWire = (dirs) => {
  let start = origin;

  return dirs.split(",").map((dir) => {
    const end = start.add(dirToVector(dir));
    const line = new Line(start, end);
    start = end;
    return line;
  });
};

const aWire = dirsToWire(aWireDirs);
const distancesToOrigin = [];
const combinedStepsToIntersections = [];

let wireBDist = 0;
for (const bLine of dirsToWire(bWireDirs)) {
  let wireADist = 0;
  for (const aLine of aWire) {
    const intersection = aLine.intersection(bLine);
    if (intersection) {
      distancesToOrigin.push(distance(origin, intersection));

      combinedStepsToIntersections.push(
        wireADist +
          wireBDist +
          distance(aLine.a, intersection) +
          distance(bLine.a, intersection),
      );
    }
    wireADist += aLine.length;
  }
  wireBDist += bLine.length;
}

console.log("part one", Math.min(...distancesToOrigin)); // 1195
console.log("part two", Math.min(...combinedStepsToIntersections)); // 91518
