const fs = require("fs");
const path = require("path");

/**
 *
 * @param pathSegments string[]
 * @returns {string[]}
 */
const readFile = (...pathSegments) => {
  return fs
    .readFileSync(path.resolve(...pathSegments))
    .toString()
    .trim()
    .split("\n");
};

module.exports = readFile;
