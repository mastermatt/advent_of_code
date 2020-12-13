const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const graph = new DefaultDict(Object);

input.forEach((line) => {
  const [from, rest] = line.split(" to ");
  const [to, dist] = rest.split(" = ");

  graph[from][to] = Number(dist);
  graph[to][from] = Number(dist);
});

const cities = Object.keys(graph);
let minDist = Infinity;
let maxDist = 0;

cities.forEach((start) => {
  const stack = [[[start], 0]];

  while (stack.length) {
    const [visited, dist] = stack.shift();

    if (visited.length === cities.length) {
      minDist = Math.min(minDist, dist);
      maxDist = Math.max(maxDist, dist);
      continue;
    }

    const head = visited[visited.length - 1];
    Object.entries(graph[head])
      .filter(([neighbor]) => !visited.includes(neighbor))
      .forEach(([neighbor, newDist]) => {
        stack.push([[...visited, neighbor], dist + newDist]);
      });
  }
});

const partOne = minDist;
console.log("part one", partOne); // 117

const partTwo = maxDist;
console.log("part two", partTwo); // 909
