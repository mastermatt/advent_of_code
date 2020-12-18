const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// 9 * 7 + ((6 + 9 * 2 + 6 + 7 + 5) * (5 + 9 + 7) * 6) * (4 + 8) + 5 * 8
const input = readFile(__dirname, "./input.txt");

function reduceBits(arr) {
  let x = parseInt(arr[0]);
  for (let i = 1; i < arr.length; i += 2) {
    const sign = arr[i];
    const val = parseInt(arr[i + 1]);

    if (sign === "+") x += val;
    else x *= val;
  }
  return x;
}

function xxx(line) {
  // console.log(line)
  let a = line.replace(/\s+/g, "").split("");
  while (true) {
    const cIdx = a.indexOf(")");
    if (cIdx === -1) break;

    const oIdx = a.lastIndexOf("(", cIdx);
    const mid = a.slice(oIdx + 1, cIdx);

    a.splice(oIdx, mid.length + 2, reduceBits(mid));
  }
  // console.log(reduceBits(a))
  return reduceBits(a);
}

// xxx(input[0])
const results = input.map(xxx);
// console.log(results)
const partOne = lodash.sum(results);
console.log("part one", partOne); // 510009915468

function reduceBits2(arr) {
  let x = [parseInt(arr[0])];
  for (let i = 1; i < arr.length; i += 2) {
    const sign = arr[i];
    const val = parseInt(arr[i + 1]);

    if (sign === "+") {
      x[x.length - 1] += val;
    } else {
      x.push(val);
    }
  }

  return x.reduce((a, b) => a * b);
}

function yyy(line) {
  // console.log(line)
  let a = line.replace(/\s+/g, "").split("");
  while (true) {
    const cIdx = a.indexOf(")");
    if (cIdx === -1) break;

    const oIdx = a.lastIndexOf("(", cIdx);
    const mid = a.slice(oIdx + 1, cIdx);

    a.splice(oIdx, mid.length + 2, reduceBits2(mid));
  }
  // console.log(reduceBits(a))
  return reduceBits2(a);
}

const results2 = input.map(yyy);
const partTwo = lodash.sum(results2);
console.log("part two", partTwo); //
