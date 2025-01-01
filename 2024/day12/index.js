const lodash = require("lodash");
const readFile = require("../../helpers/readFile");
const { walkGrid, orthogonalNeighbors } = require("../../helpers/gird");
const CoordinateSet = require("../../helpers/coordinateSet");

const grid = readFile(__dirname, "./input.txt");

const regions = [];
const seen = new CoordinateSet();

for (const [char, xx, yy] of walkGrid(grid)) {
  if (seen.has(xx, yy)) continue;

  const region = { char, area: 0, perim: 0, sides: 0 };
  const stack = [[xx, yy]];

  while (stack.length) {
    const [x, y] = stack.pop();
    if (seen.has(x, y)) continue;
    seen.add(x, y);

    region.area++;

    // can't use `orthogonalNeighbors` since we want to check exterior sides too.
    const up = grid[y - 1]?.[x];
    const down = grid[y + 1]?.[x];
    const left = grid[y][x - 1];
    const right = grid[y][x + 1];

    if (up === char) stack.push([x, y - 1]);
    else {
      region.perim++;
      if (left !== char || grid[y - 1]?.[x - 1] === char) region.sides++;
    }

    if (down === char) stack.push([x, y + 1]);
    else {
      region.perim++;
      if (left !== char || grid[y + 1]?.[x - 1] === char) region.sides++;
    }

    if (left === char) stack.push([x - 1, y]);
    else {
      region.perim++;
      if (up !== char || grid[y - 1][x - 1] === char) region.sides++;
    }

    if (right === char) stack.push([x + 1, y]);
    else {
      region.perim++;
      if (up !== char || grid[y - 1][x + 1] === char) region.sides++;
    }
  }

  regions.push(region);
}

const partOne = regions.reduce((acc, { area, perim }) => acc + area * perim, 0);
console.log("part one", partOne, partOne === 1473276);

const partTwo = regions.reduce((acc, { area, sides }) => acc + area * sides, 0);
console.log("part two", partTwo, partTwo === 901100);
