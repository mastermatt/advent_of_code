const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];
const buf = Buffer.from(input, "hex");
const inputBin = buf.reduce(
  (acc, cur) => acc + cur.toString(2).padStart(8, "0"),
  "",
);

let pointer = 0;
function pullInt(len) {
  return parseInt(inputBin.substring(pointer, (pointer += len)), 2);
}

let versionsSum = 0;
function parsePacket() {
  versionsSum += pullInt(3);
  const typeId = pullInt(3);

  if (typeId === 4) {
    let val = BigInt(0);
    let keepGoing = 1;
    while (keepGoing) {
      keepGoing = pullInt(1);
      val <<= 4n;
      val |= BigInt(pullInt(4));
    }

    return val;
  }

  let vals = [];
  const lengthTypeId = pullInt(1);
  if (lengthTypeId) {
    vals = lodash.times(pullInt(11), parsePacket);
  } else {
    const end = pullInt(15) + pointer;
    while (pointer < end) vals.push(parsePacket());
  }

  switch (typeId) {
    case 0: // sum
      return vals.reduce((acc, curr) => acc + curr);
    case 1: // product
      return vals.reduce((acc, curr) => acc * curr);
    case 2: // minimum
      return vals.reduce((a, b) => (b < a ? b : a));
    case 3: // maximum
      return vals.reduce((a, b) => (b > a ? b : a));
    case 5: // greater than
      return vals[0] > vals[1] ? 1n : 0n;
    case 6: // less than
      return vals[0] < vals[1] ? 1n : 0n;
    case 7: // equal
      return vals[0] === vals[1] ? 1n : 0n;
  }
}

const result = parsePacket();
const partOne = versionsSum;
console.log("part one", partOne, partOne === 949);

const partTwo = result;
console.log("part two", partTwo, partTwo === 1114600142730n);
