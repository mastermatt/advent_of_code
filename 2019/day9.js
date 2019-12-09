const readFile = require("../helpers/readFile");
const { Computer } = require("./computer");

const input = readFile(__dirname, "./input/day9.txt")[0]
  .split(",")
  .map(Number);

const computerOne = new Computer([...input]);
computerOne.writeAndExec(1);

const partOne = computerOne.readNext();
console.log("part one", partOne); // 2682107844

const computerTwo = new Computer([...input]);
computerTwo.writeAndExec(2);

const partTwo = computerTwo.readNext();
console.log("part two", partTwo); // 34738
