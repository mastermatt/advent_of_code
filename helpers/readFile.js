const fs = require("fs");
const path = require("path");

/**
 *
 * @param pathSegments string[]
 * @returns string[]
 */
const readFile = (...pathSegments) => {
  return fs
    .readFileSync(path.resolve(...pathSegments))
    .toString()
    .trimEnd()
    .split("\n");
};

module.exports = readFile;

/**
 * For when chucks of data are split by double newlines.
 *
 * @param pathSegments string[]
 * @returns string[][]
 */
const doubleSplit = (...pathSegments) => {
  return fs
    .readFileSync(path.resolve(...pathSegments))
    .toString()
    .trimEnd()
    .split("\n\n")
    .map((chunk) => chunk.split("\n"));
};

module.exports.doubleSplit = doubleSplit;
