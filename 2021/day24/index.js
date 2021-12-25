const readFile = require("../../helpers/readFile");

const monad = readFile(__dirname, "./input.txt").map((line) => {
  const [ins, a, b] = line.split(" ");
  const castB = Number.isNaN(Number(b)) ? b : Number(b);
  return [ins, a, castB];
});

function validateNumber(num) {
  const input = String(num).split("").reverse().map(Number);
  const mem = { w: 0, x: 0, y: 0, z: 0 };

  for (const [ins, a, rawB] of monad) {
    const b = typeof rawB === "string" ? mem[rawB] : rawB;
    if (ins === "inp") mem[a] = input.pop();
    else if (ins === "add") mem[a] += b;
    else if (ins === "mul") mem[a] *= b;
    else if (ins === "div") mem[a] = (mem[a] / b) | 0;
    else if (ins === "mod") mem[a] %= b;
    else if (ins === "eql") mem[a] = mem[a] === b ? 1 : 0;
    else throw Error("what is this " + ins);
    console.log(ins, a, rawB, b, mem);
  }

  return mem.z;
}

console.log(validateNumber("13579246899999"));

// While writing the above code was fun, of course it's not used to solve the actual problem.
// Today's goal is to reverse engineer the input to figure out what it's doing with the input.
// The notes I wrote when working out were gibberish. A better explanation is here https://github.com/dphilipson/advent-of-code-2021/blob/master/src/days/day24.rs

console.log("part one", 39999698799429);
console.log("part two", 18116121134117);
