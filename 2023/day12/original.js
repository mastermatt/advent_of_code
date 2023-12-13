const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const records = input.map((line) => {
  const [pattern, numsStr] = line.split(" ");
  const nums = numsStr.split(",").map(Number);
  // 1, 1, 3 => ^\.*#{1}\.+#{1}\.+#{3}\.*$
  const regx = new RegExp(`^\\.*#{${nums.join("}\\.+#{")}}\\.*$`);

  return [pattern, regx];
});

function countPossibles([pattern, regx]) {
  let arrangements = 0;
  const unknowns = pattern.replaceAll(/[.#]/g, "").length;
  const max = 1 << unknowns;

  for (let i = 0; i < max; i++) {
    const binStr = i.toString(2).padStart(unknowns, "0");
    let idx = 0;
    const sub = pattern.replaceAll(/\?/g, () =>
      binStr[idx++] === "1" ? "#" : ".",
    );

    if (regx.test(sub)) ++arrangements;
  }

  return arrangements;
}

const partOne = lodash.sum(records.map(countPossibles));
console.log("part one", partOne, partOne === 6958); // ~4.8 sec

const partTwo = null;
console.log("part two", partTwo, partTwo === undefined);
