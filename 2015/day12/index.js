const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];

function sumDigits(str) {
  const matches = str.match(/(-?\d+)/g) || [];
  const nums = matches.map((digits) => parseInt(digits));
  return lodash.sum(nums);
}

const partOne = sumDigits(input);
console.log("part one", partOne); // 111754

const parsed = JSON.parse(input);

function removeReds(data) {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = removeReds(data[i]);
    }
  } else if (lodash.isPlainObject(data)) {
    if (Object.values(data).includes("red")) {
      return undefined;
    }
    for (const key of Object.keys(data)) {
      data[key] = removeReds(data[key]);
    }
  }

  return data;
}

removeReds(parsed);

const partTwo = sumDigits(JSON.stringify(parsed));
console.log("part two", partTwo); // 65402
