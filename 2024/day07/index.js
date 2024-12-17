const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const equations = input.map((line) => {
  const [a, b] = line.split(": ");
  const value = Number(a);
  const numbers = b.split(" ").map(Number);
  return { value, numbers };
});

const doesEquate = ({ value, numbers }, allowConcat) => {
  const queue = [numbers];

  while (queue.length) {
    const [sum, next, ...rest] = queue.pop();

    if (sum === value && !next) return true;
    if (sum > value || !next) continue;

    queue.push([sum + next, ...rest], [sum * next, ...rest]);

    if (allowConcat) {
      const concat = Number([sum, next].join(""));
      queue.push([concat, ...rest]);
    }
  }

  return false;
};

const sumValues = (eqs) => lodash.sum(eqs.map((eq) => eq.value));

const trueEquations = equations.filter((eq) => doesEquate(eq, false));
const partOne = sumValues(trueEquations);
console.log("part one", partOne, partOne === 4998764814652);

const trueEquations2 = equations.filter((eq) => doesEquate(eq, true));
const partTwo = sumValues(trueEquations2);
console.log("part two", partTwo, partTwo === 37598910447546);
