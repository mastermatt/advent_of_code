const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const splitTicket = (line) => line.split(",").map((i) => parseInt(i));

// departure location: 32-842 or 854-967
const rules = input.slice(0, 20).map((line) => {
  const [name, rest] = line.split(": ");
  const x = rest.split(" or ").map((y) => y.split("-").map((z) => parseInt(z)));
  return [name, x]; // ['departure location', [[32, 842], [854, 967]]]
});

const nearbyTickets = input.slice(26).map(splitTicket);
const yourTicket = splitTicket(input[22]);

const inRanges = (val, ranges) =>
  ranges.some(([to, from]) => to <= val && val <= from);

let errorRate = 0;
const validTickets = [];
for (const ticket of nearbyTickets) {
  const invalids = ticket.filter(
    (val) => !rules.some(([_, ranges]) => inRanges(val, ranges))
  );

  errorRate += lodash.sum(invalids);
  if (!invalids.length) validTickets.push(ticket);
}

const partOne = errorRate;
console.log("part one", partOne); // 20231

const fieldIndexes = {};
for (const [name, ranges] of rules) {
  fieldIndexes[name] = lodash
    .range(20)
    .filter((i) => validTickets.every((ticket) => inRanges(ticket[i], ranges)));
}

// most fields will have been valid for many indexes, however, only one has one index
// and only one has two indexes (and overlaps with the previous field), etc.
const indexes = lodash.sortBy(Object.values(fieldIndexes), "length");
const locked = [];
for (const arr of indexes) {
  const keepIdx = arr.findIndex((val) => !locked.includes(val));
  arr.splice(0, keepIdx); // mutating the array in place so the map prunes down
  arr.splice(1);
  locked.push(arr[0]);
}

const partTwo = Object.entries(fieldIndexes)
  .filter(([key]) => key.startsWith("departure"))
  .map(([_, [idx]]) => yourTicket[idx])
  .reduce((a, b) => a * b);
console.log("part two", partTwo); // 1940065747861
