const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const myBag = "shiny gold bag";
const containedInMap = new DefaultDict(Array);
const containsMap = Object.fromEntries(input.map(parseLine));

// light red bags contain 1 bright white bag, 2 muted yellow bags.
function parseLine(line) {
  const [subject, remaining] = line.split("s contain ");

  if (remaining === "no other bags.") {
    return [subject, []];
  }

  const others = remaining.split(", ").map(c => {
    // console.log(c)
    const match = c.match(/(\d+) (.+ bag)s?\.?/);
    containedInMap[match[2]].push(subject);
    return [match[2], parseInt(match[1])];
  });

  return [subject, others];
}

// console.log(containsMap);
// console.log(containedInMap);

const stack = containedInMap[myBag];
const seen = new Set();

while (stack.length) {
  const bag = stack.pop();
  seen.add(bag);
  stack.push(...containedInMap[bag]);
}

const partOne = seen.size;
console.log("part one", partOne); // 103

function countSubBags(bag) {
  let count = 0;
  for (const [subBag, num] of containsMap[bag]) {
    count += num + num * countSubBags(subBag);
  }
  return count;
}

const partTwo = countSubBags(myBag);
console.log("part two", partTwo); // 1469
