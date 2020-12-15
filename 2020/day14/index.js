const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const mem = {};
const mem2 = {};
let mask = "";
let andMask = 0n;
let orMask = 0n;

function* genAddresses(rawAddr) {
  const addr = (BigInt(rawAddr) | orMask)
    .toString(2)
    .padStart(36, "0")
    .split("");
  const xIdxs = [];
  for (let i = 0; i < 36; i++) {
    if (mask[i] === "X") xIdxs.push(i);
  }
  const numXs = xIdxs.length;
  const numFloating = 2 ** numXs;

  for (let i = 0; i < numFloating; ++i) {
    const bin = i.toString(2).padStart(numXs, "0").split("");
    for (const idx of xIdxs) {
      addr[idx] = bin.shift();
    }

    yield addr.join("");
  }
}

for (const line of input) {
  if (line.startsWith("mask")) {
    mask = line.slice(7);
    andMask = BigInt("0b" + mask.replace(/X/g, "1"));
    orMask = BigInt("0b" + mask.replace(/X/g, "0"));
  } else {
    const [rawAddr, rawVal] = line.slice(4).split("] = ");
    const val = BigInt(rawVal);
    mem[rawAddr] = (val & andMask) | orMask;

    for (const addr of genAddresses(rawAddr)) {
      mem2[addr] = val;
    }
  }
}

const partOne = lodash.sum(Object.values(mem)).toString();
console.log("part one", partOne); // 16003257187056

const partTwo = lodash.sum(Object.values(mem2)).toString();
console.log("part two", partTwo); // 3219837697833
