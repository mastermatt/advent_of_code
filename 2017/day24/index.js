const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

// const input = [
//   '0/2',
//   '2/2',
//   '2/3',
//   '3/4',
//   '3/5',
//   '0/1',
//   '10/1',
//   '9/10',
// ]

const map = Object.fromEntries(
  input.map(line => [line, line.split("/").map(digits => parseInt(digits))])
);

function* possibleComponents(port, seen) {
  for (const comp of input) {
    const hasPort = map[comp].includes(port);
    if (hasPort && !seen.includes(comp)) {
      yield comp;
    }
  }
}

const stack = [{ port: 0, strength: 0, seen: [] }];
let maxStrength = 0;
let maxLength = 0;
let maxLengthMaxStrength = 0;

while (stack.length) {
  const { port, strength, seen } = stack.pop();

  for (const comp of possibleComponents(port, seen)) {
    const ports = map[comp];
    const node = {
      port: ports[0] === port ? ports[1] : ports[0], // it's possible both ports are the same
      strength: strength + ports[0] + ports[1],
      seen: [...seen, comp]
    };

    // console.log(node)
    maxStrength = Math.max(maxStrength, node.strength);

    if (node.seen.length > maxLength) {
      maxLength = node.seen.length;
      maxLengthMaxStrength = node.strength;
    } else if (node.seen.length === maxLength) {
      maxLengthMaxStrength = Math.max(maxLengthMaxStrength, node.strength);
    }

    stack.push(node);
  }
}

const partOne = maxStrength;
console.log("part one", partOne); // 1906

const partTwo = maxLengthMaxStrength;
console.log("part two", partTwo); // 1824
