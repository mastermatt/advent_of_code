const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const deck1 = input.slice(1, 26).map(Number);
const deck2 = input.slice(28).map(Number);

function scoreWinner(a, b) {
  return a
    .concat(b)
    .reverse()
    .map((card, idx) => card * (idx + 1))
    .reduce((a, b) => a + b);
}

const player1 = [...deck1];
const player2 = [...deck2];
while (player1.length && player2.length) {
  const a = player1.shift();
  const b = player2.shift();

  if (a > b) player1.push(a, b);
  else player2.push(b, a);
}

const partOne = scoreWinner(player1, player2);
console.log("part one", partOne); // 32179

// returns true if player one wins
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

const player3 = [...deck1];
const player4 = [...deck2];
recursiveCombat(player3, player4);

const partTwo = scoreWinner(player3, player4);
console.log("part two", partTwo); // 30498
