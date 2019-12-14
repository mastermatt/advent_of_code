const lodash = require("lodash");
const Iter = require("es-iter");
const inspect = Symbol.for("nodejs.util.inspect.custom");

const readFile = require("../../helpers/readFile");
const { lcm } = require("../../helpers/math");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt");

const partOne = 1;
console.log("step one", partOne); // ..

const partTwo = 2;
console.log("step two", partTwo); // ..
