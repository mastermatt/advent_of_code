const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const earliestTs = parseInt(input[0]);
const busIds = input[1]
  .split(",")
  .filter((val) => val !== "x")
  .map((val) => parseInt(val));

function one() {
  let time = earliestTs;
  while (++time && time < earliestTs + 10) {
    const found = busIds.find((id) => time % id === 0);

    if (found) {
      const wait = time - earliestTs;
      return found * wait;
    }
  }
}

const partOne = one();
console.log("part one", partOne); // 119

const secondLine = input[1].split(",");
const offsets = busIds.map((id) => secondLine.indexOf(id.toString()));
const zip = lodash.zip(busIds, offsets);
let [inc, ts] = zip.shift();

for (const [busId, offset] of zip) {
  while ((ts + offset) % busId !== 0) ts += inc;
  inc *= busId;
}

const partTwo = ts;
console.log("part two", partTwo); // 1106724616194525
