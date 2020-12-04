const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const passports = input
  .join("\n")
  .split("\n\n")
  .map(raw => raw.split(/\s/))
  .map(arr => Object.fromEntries(arr.map(data => data.split(":"))));

const req = {
  // byr (Birth Year) - four digits; at least 1920 and at most 2002.
  byr: val => lodash.inRange(val, 1920, 2003),
  // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
  iyr: val => lodash.inRange(val, 2010, 2021),
  // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
  eyr: val => lodash.inRange(val, 2020, 2031),
  // hgt (Height) - a number followed by either cm or in:
  // If cm, the number must be at least 150 and at most 193.
  // If in, the number must be at least 59 and at most 76.
  hgt: val => {
    const [_, units, system] = val.match(/^(\d+)(cm|in)$/) || [];
    if (system === "cm") return lodash.inRange(units, 150, 194);
    if (system === "in") return lodash.inRange(units, 59, 77);
    return false;
  },
  // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
  hcl: val => /^#[0-9a-f]{6}$/.test(val),
  // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
  ecl: val => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val),
  // pid (Passport ID) - a nine-digit number, including leading zeroes.
  pid: val => /^\d{9}$/.test(val)
  // cid (Country ID) - ignored, missing or not.
};

const valid = passports.filter(pp => Object.keys(req).every(key => key in pp));
const partOne = valid.length;
console.log("part one", partOne); // 182

const reallyValid = passports.filter(passport =>
  Object.entries(req).every(([key, fn]) => key in passport && fn(passport[key]))
);

const partTwo = reallyValid.length;
console.log("part two", partTwo); // 109
