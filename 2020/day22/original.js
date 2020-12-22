const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const player1 = input.slice(1, 26).map(Number);
const player2 = input.slice(28).map(Number);
// console.log(player1)
// console.log(player2)

while (player1.length > 0 && player2.length > 0) {
  const a = player1.shift();
  const b = player2.shift();

  if (a > b) player1.push(a, b);
  else player2.push(b, a);
}

const winner = player1.length ? player1 : player2;
const partOne = winner
  .reverse()
  .map((card, idx) => card * (idx + 1))
  .reduce((a, b) => a + b);
console.log("part one", partOne); // 32179

function recursiveCombat(one, two) {
  const seen = new Set();
  while (one.length && two.length) {
    const key = `${one}:${two}`;
    if (seen.has(key)) {
      return true;
    }

    seen.add(key);
    const a = one.shift();
    const b = two.shift();

    const oneWon =
      one.length >= a && two.length >= b
        ? recursiveCombat(one.slice(0, a), two.slice(0, b))
        : a > b;

    if (oneWon) one.push(a, b);
    else two.push(b, a);
  }

  return !!one.length;
}

const player3 = input.slice(1, 26).map(Number);
const player4 = input.slice(28).map(Number);
recursiveCombat(player3, player4);

const winner2 = player3.length ? player3 : player4;
const partTwo = winner2
  .reverse()
  .map((card, idx) => card * (idx + 1))
  .reduce((a, b) => a + b);
console.log("part two", partTwo); //
