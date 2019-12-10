const readFile = require("../helpers/readFile");

const input = readFile(__dirname, "./input/day7.txt");

// 123 -> x
// 456 -> y
// x AND y -> d
// x OR y -> e
// x LSHIFT 2 -> f
// y RSHIFT 2 -> g
// NOT x -> h
// NOT y -> i

const fnMap = {
  " AND ": (a, b) => a & b,
  " OR ": (a, b) => a | b,
  " LSHIFT ": (a, b) => a << b,
  " RSHIFT ": (a, b) => a >> b,
  "NOT ": (a, b) => ~b // bitwise complement
};

const preparedCmds = input.map(line => {
  const [cmd, target] = line.split(" -> ");

  for (const [keyword, fn] of Object.entries(fnMap)) {
    if (cmd.includes(keyword)) {
      return { target, fn, args: cmd.split(keyword) };
    }
  }

  // 123 -> x
  return { target, fn: a => a, args: [cmd] };
});

const prepareArgs = (args, variables) => {
  const result = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (Number.isInteger(arg)) {
      result.push(arg);
      continue;
    }

    const cast = Number(arg);
    if (!Number.isNaN(cast)) {
      result.push(cast);
      continue;
    }

    if (arg in variables) {
      result.push(variables[arg]);
      continue;
    }

    return false; // variable isn't solved for yet
  }

  return result;
};

const run = (variables = {}) => {
  while (!("a" in variables)) {
    preparedCmds.forEach(({ target, fn, args }) => {
      if (target in variables) {
        return; // we've already solved this one
      }

      const goodArgs = prepareArgs(args, variables);
      if (goodArgs) {
        variables[target] = fn(...goodArgs);
      }
    });
  }

  return variables.a;
};

const partOne = run();
console.log("part one", partOne); // 46065

const partTwo = run({ b: partOne });
console.log("part two", partTwo); // 14134
