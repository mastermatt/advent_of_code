const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("").map(Number);

const repeats = [0, 1, 0, -1];

const phase = (list) => {
  return list.map((_, i) => {
    const rowTotal = list.reduce((acc, val, j) => {
      const mul = repeats[(((j + 1) / (i + 1)) | 0) % 4];
      return acc + val * mul;
    }, 0);

    return Math.abs(rowTotal % 10);
  });
};

let xx = [...input];
for (let i = 0; i < 100; i++) {
  xx = phase(xx);
}

const partOne = xx.slice(0, 8).join("");
console.log("part one", partOne); // 52611030

const offset = Number(input.slice(0, 7).join(""));
// console.log("offset", offset);

const bigInput = [];
for (let i = 0; i < 10000; i++) {
  bigInput.push(...input);
}
// console.log("have big input", bigInput.length);

const phase2 = (list) => {
  let sum = lodash.sum(list);

  return list.map((_, i) => {
    const d = sum % 10;
    sum -= list[i];
    return d;
  });
};

xx = [...bigInput.slice(offset)];
for (let i = 0; i < 100; i++) {
  xx = phase2(xx);
}

const partTwo = xx.slice(0, 8).join("");
console.log("part two", partTwo); // 52541026
