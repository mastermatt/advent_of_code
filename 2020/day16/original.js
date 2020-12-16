const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// departure location: 32-842 or 854-967
const rules = input.slice(0, 20).map((line) => {
  const [name, rest] = line.split(": ");
  const x = rest.split(" or ").map((y) => y.split("-").map((z) => parseInt(z)));
  return [name, x];
});

const nearbyTickets = input
  .slice(26)
  .map((line) => line.split(",").map((i) => parseInt(i)));
const yourTicket = input[22].split(",").map((i) => parseInt(i));

let errorRate = 0;
const validTickets = [];
for (const ticket of nearbyTickets) {
  const invalids = ticket.filter((val) => {
    return !rules.some(([_, ranges]) => {
      return ranges.some(([to, from]) => {
        return to <= val && val <= from;
      });
    });
  });

  errorRate += lodash.sum(invalids);
  if (!invalids.length) validTickets.push(ticket);
}

const partOne = errorRate;
console.log("part one", partOne); // 20231

function isValid(val, ranges) {
  return ranges.some(([to, from]) => to <= val && val <= from);
}

const foundMap = {};
for (const [name, ranges] of rules) {
  for (let i = 0; i < 20; i++) {
    const valid = validTickets.every((ticket) => isValid(ticket[i], ranges));

    if (valid) {
      if (!foundMap[name]) foundMap[name] = [];
      foundMap[name].push(i);
    }
  }
}

// console.log(foundMap);

const indexes = Object.values(foundMap);

let t = 2;
while (t <= 20) {
  const locked = indexes.filter((arr) => arr.length === 1).flat();
  const next = indexes.find((arr) => arr.length === t);
  ++t;
  if (!next) continue;

  // console.log("######", locked, next)
  const keepIdx = next.findIndex((val) => !locked.includes(val));
  next.splice(0, keepIdx);
  next.splice(1);
}

// console.log(foundMap)

const partTwo = Object.entries(foundMap)
  .filter(([key]) => key.startsWith("departure"))
  .map(([key, [idx]]) => yourTicket[idx])
  .reduce((a, b) => a * b);
console.log("part two", partTwo); // 1940065747861
