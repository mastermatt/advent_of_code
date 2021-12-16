const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];
const buf = Buffer.from(input, "hex");
// const buf = Buffer.from("D2FE28", "hex");

let pointer = 0;
function pullInt(len) {
  const offset = (pointer / 8) | 0;
  const end = offset === buf.length - 1;
  const slice = end ? buf.readUInt8(offset) << 8 : buf.readUInt16BE(offset);
  const shifted = slice >> (16 - (pointer % 8) - len);
  const mask = 65535 >> (16 - len);
  const val = shifted & mask;
  // console.log(val, val.toString(2).padStart(8, "0"), pointer, len);
  pointer += len;
  return val;
}

const versions = [];
function parsePacket() {
  const version = pullInt(3);
  versions.push(version);
  const typeId = pullInt(3);
  // console.log('version', version, 'type', type);

  if (typeId === 4) {
    let val = BigInt(0);
    let keepGoing = 1;
    while (keepGoing) {
      keepGoing = pullInt(1);
      val <<= 4n;
      val |= BigInt(pullInt(4));
      // 2021 011111100101
      // console.log(val, val.toString(2).padStart(8, "0"));
    }

    // console.log("literal value", val);
    return val;
  }

  // If the length type ID is 0, then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
  // If the length type ID is 1, then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.

  const lengthTypeId = pullInt(1);
  let vals;
  if (lengthTypeId) {
    const num = (pullInt(8) << 3) | pullInt(3);
    // console.log('num', num);
    vals = lodash.times(num, parsePacket);
  } else {
    const num = (pullInt(8) << 7) | pullInt(7);
    const end = pointer + num - 8;
    vals = [];
    while (pointer < end) vals.push(parsePacket());
  }

  switch (typeId) {
    // Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
    case 0:
      return lodash.sum(vals);
    // Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
    case 1:
      return vals.reduce((acc, curr) => acc * curr);
    // Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
    case 2:
      return vals.reduce((m, e) => (e < m ? e : m));
    // Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
    case 3:
      return vals.reduce((m, e) => (e > m ? e : m));
    // Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    case 5:
      return vals[0] > vals[1] ? 1n : 0n;
    // Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    case 6:
      return vals[0] < vals[1] ? 1n : 0n;
    // Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
    case 7:
      return vals[0] === vals[1] ? 1n : 0n;
  }
}

const result = parsePacket();
const partOne = lodash.sum(versions);
console.log("part one", partOne, partOne === 949);

const partTwo = result;
console.log("part two", partTwo, partTwo === 1114600142730n);
