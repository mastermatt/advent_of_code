const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("");

const housesVisited = new Set(["0,0"]);
let x = 0;
let y = 0;

input.forEach(dir => {
  switch (dir) {
    case "^":
      y++;
      break;
    case "v":
      y--;
      break;
    case ">":
      x++;
      break;
    case "<":
      x--;
      break;
  }

  housesVisited.add([x, y].join(","));
});

console.log("part one", housesVisited.size); // 2081

housesVisited.clear();
housesVisited.add("0,0");
let which = 0;
let positions = [
  [0, 0],
  [0, 0]
];

input.forEach(dir => {
  const pos = positions[which];
  switch (dir) {
    case "^":
      pos[1]++;
      break;
    case "v":
      pos[1]--;
      break;
    case ">":
      pos[0]++;
      break;
    case "<":
      pos[0]--;
      break;
  }

  housesVisited.add(pos.join(","));
  which ^= 1;
});
console.log("part two", housesVisited.size); // 2341
