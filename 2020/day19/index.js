const Iter = require("es-iter");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const [inputTop, inputBottom] = input.join("\n").split("\n\n");
const receivedMessages = inputBottom.split("\n");
const rules = [];

inputTop.split("\n").forEach((line) => {
  const [idx, rest] = line.split(": ");
  rules[idx] =
    rest[0] === '"'
      ? [true, rest[1]]
      : rest.split(" | ").map((a) => a.split(" ").map(Number));
});

function* genPatterns(ruleIdx) {
  const rule = rules[ruleIdx];

  if (rule[0] === true) {
    yield rule[1];
    return;
  }

  for (const subRule of rule) {
    const gens = subRule.map(genPatterns);

    // pulling off the first generator is only required to work with a quirk of the es-iter api
    const firstGen = gens.shift();

    if (gens.length === 0) {
      yield* firstGen;
    } else {
      yield* new Iter(firstGen)
        .product(...gens)
        .map((results) => results.join(""));
    }
  }
}

const patterns31 = [...genPatterns(31)];
const patterns42 = [...genPatterns(42)];
const r31 = `(?:${patterns31.join("|")})`;
const r42 = `(?:${patterns42.join("|")})`;

function one() {
  const reg = new RegExp(`^${r42}{2}${r31}$`);
  const valid = receivedMessages.filter((message) => reg.test(message));
  return valid.length;
}

const partOne = one();
console.log("part one", partOne); // 126

function two() {
  const reg = new RegExp(`^(${r42}+)(${r31}+)$`);
  const valid = receivedMessages.filter((message) => {
    const match = message.match(reg);
    return match && match[1].length > match[2].length;
  });
  return valid.length;
}

const partTwo = two();
console.log("part two", partTwo); // 282
