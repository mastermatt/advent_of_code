const fs = require("fs");
const path = require("path");

const input = fs
  .readFileSync(path.resolve(__dirname, "./input/day5.txt"))
  .toString()
  .trim()
  .split("\n");

// It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
const blackList = /ab|cd|pq|xy/;

// It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
const vowels = /[^aeiou]/g;

// It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
const pairs = /(.)\1/;

const nice = input
  .filter(str => pairs.test(str))
  .filter(str => !blackList.test(str))
  .filter(str => str.replace(vowels, "").length >= 3);

console.log("part one", nice.length); // 255

// It contains a pair of any two letters that appears at least twice in the string without
// overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
const pairTwins = /(..).*\1/;

// It contains at least one letter which repeats with exactly one letter
// between them, like xyx, abcdefeghi (efe), or even aaa.
const gapedPair = /(.).\1/;

const niceTwo = input
  .filter(str => pairTwins.test(str))
  .filter(str => gapedPair.test(str));

console.log("part two", niceTwo.length); // 55
