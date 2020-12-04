const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt").join("\n");
const passports = input.split("\n\n").map(data => {
  return Object.fromEntries(data.split(/\s/).map(x => x.split(":")));
});

// byr (Birth Year) - four digits; at least 1920 and at most 2002.
// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
// hgt (Height) - a number followed by either cm or in:
// If cm, the number must be at least 150 and at most 193.
// If in, the number must be at least 59 and at most 76.
// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
// pid (Passport ID) - a nine-digit number, including leading zeroes.
// cid (Country ID) - ignored, missing or not.
const req = {
  byr: val => {
    const num = parseInt(val);
    return num >= 1920 && num <= 2002;
  },
  iyr: val => {
    const num = parseInt(val);
    return num >= 2010 && num <= 2020;
  },
  eyr: val => {
    const num = parseInt(val);
    return num >= 2020 && num <= 2030;
  },
  hgt: val => {
    const match = val.match(/^(\d+)(cm|in)$/);
    if (!match) return false;
    const num = parseInt(match[1]);
    if (match[2] === "cm") return num >= 150 && num <= 193;
    if (match[2] === "in") return num >= 59 && num <= 76;
    throw val;
  },
  hcl: val => {
    return !!val.match(/^#[0-9a-f]{6}$/);
  },
  ecl: val => {
    return ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(val);
  },
  pid: val => {
    return !!val.match(/^\d{9}$/);
  }
};

const valid = passports.filter(passport => {
  return (
    lodash.difference(Object.keys(req), Object.keys(passport)).length === 0
  );
});

const partOne = valid.length;
console.log("part one", partOne); // 182

const reallyValid = passports.filter(passport => {
  for (const [key, fn] of Object.entries(req)) {
    if (!passport[key]) return false;
    // console.log(key, passport[key], fn(passport[key]))
    if (!fn(passport[key])) return false;
  }

  return true;
});

const partTwo = reallyValid.length;
console.log("part two", partTwo); // 109
