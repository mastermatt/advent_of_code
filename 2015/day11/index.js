/**
 * - Passwords must include one increasing straight of at least three letters,
 *   like abc, bcd, cde, and so on, up to xyz. They cannot skip letters; abd doesn't count.
 * - Passwords may not contain the letters i, o, or l, as these letters can be mistaken for
 *   other characters and are therefore confusing.
 * - Passwords must contain at least two different, non-overlapping pairs of letters, like aa, bb, or zz.
 */
const originalPassword = "cqjxjnds";

const doublePairRe = /([a-z])\1.*([a-z])\2/;
const tripleSeqRe =
  /(abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/;
const nextChar = {
  a: "b",
  b: "c",
  c: "d",
  d: "e",
  e: "f",
  f: "g",
  g: "h",
  h: "j",
  j: "k",
  k: "m",
  m: "n",
  n: "p",
  p: "q",
  q: "r",
  r: "s",
  s: "t",
  t: "u",
  u: "v",
  v: "w",
  w: "x",
  x: "y",
  y: "z",
  z: "a",
};

const nextPassword = (current) => {
  const result = current.split("");

  let i = current.length - 1;
  let currentChar = "";

  do {
    currentChar = current[i];
    result[i] = nextChar[currentChar];
    i--;
  } while (currentChar === "z");

  return result.join("");
};

const isValid = (str) => doublePairRe.test(str) && tripleSeqRe.test(str);

let password = originalPassword;
do {
  password = nextPassword(password);
} while (!isValid(password));

console.log("part one", password); // cqjxxyzz

do {
  password = nextPassword(password);
} while (!isValid(password));

console.log("part two", password); // cqkaabcc
