const lodash = require("lodash");

const { modExp, modInverse } = require("../../helpers/math");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const deck = lodash.range(10007);

const cmds = {
  "deal into new stack": (deck) => [...deck].reverse(),
  cut: (deck, n) => [...deck.slice(n), ...deck.slice(0, n)],
  "deal with increment": (deck, n) => {
    const result = new Array(deck.length);
    for (let i = 0; i < deck.length; i++) {
      result[(i * n) % deck.length] = deck[i];
    }
    return result;
  },
};

const instructions = input.map((line) => {
  const m = line.match(/^([a-z ]+) ?([\d-]*)$/);
  // console.log(line, m)
  return [m[1].trim(), Number(m[2])];
});

const result = instructions.reduce(
  (acc, [inst, n]) => cmds[inst](acc, n),
  deck
);

const partOne = result.indexOf(2019);
console.log("step one", partOne); // 2519

// const bigDeck = lodash.range(119315717514047)

const cmds2 = {
  "deal into new stack": (idx, length) => length - idx - 1,
  cut: (idx, length, n) => (idx - n + length) % length,
  "deal with increment": (idx, length, n) => (idx * n) % length,
};

const result2 = instructions.reduce(
  (acc, [inst, n]) => cmds2[inst](acc, deck.length, n),
  2019
);

console.log("result 2", result2); // 2519 same yay!

const cmds2rev = {
  "deal into new stack": (idx, length) => length - idx - 1,
  cut: (idx, length, n) => (idx + n + length) % length,
  "deal with increment": (idx, length, n) => {
    let i = 0;
    while (++i) {
      const t = (idx + length * i) / n;
      if (t === (t | 0)) {
        // console.log(idx, length, n, t);
        return t;
      }
    }
    // (2519+(10007*35))/36
    // 9799
    // (6074+(10007*18))/14
    // 13300
    // (6074+(10007*4))/14
    // 3293
    // const r = (idx + (((idx%n)) * length)) / n;
    // console.log(idx, length, n, (idx%n), r);
    // return r
  },
};

const result3 = [...instructions]
  .reverse()
  .reduce((acc, [inst, n]) => cmds2rev[inst](acc, deck.length, n), 2519);

console.log("result 3", result3); // 2019

// this is the point at which I quit trying to figure out the math myself.
// the math of everything below is borrowed from solutions of the Reddit thread.

const getCoefficients = (deckSize, instructions, instructionMap) => {
  let addi = 0n;
  let multi = 1n;

  for (const [cmd, n] of instructions) {
    [addi, multi] = instructionMap[cmd](deckSize, addi, multi, BigInt(n));
    // console.log(cmd, n, multi, addi);
  }

  return [addi, multi];
};

const cmdsRev = {
  "deal into new stack": (deckSize, addi, multi) => [-addi - 1n, -multi],
  cut: (deckSize, addi, multi, n) => [addi + n, multi],
  "deal with increment": (deckSize, addi, multi, n) => {
    const inverse = modInverse(n, deckSize);
    return [addi * inverse, multi * inverse];
  },
};

const run2 = () => {
  const inst = [...instructions].reverse();

  const position = 2020n;
  const numCards = 119315717514047n;
  const numShuffles = 101741582076661n;

  const [addi, multi] = getCoefficients(numCards, inst, cmdsRev);

  const all_multi = modExp(multi, numShuffles, numCards);
  const all_addi = addi * (1n - all_multi) * modInverse(1n - multi, numCards);

  return (position * all_multi + all_addi + numCards) % numCards;
};

const partTwo = run2();
console.log("step two", partTwo); // 58966729050483n
