const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0];
// const input = "{{<ab>},{<ab>},{<ab>},{<ab>}}"; // 9
// const input = '<{o"i!a,<{i<a>'; // garbage count 10

let ignoresTemp = false;
function filterIgnores(char) {
  if (ignoresTemp) {
    ignoresTemp = false;
    return false;
  }

  if (char === "!") {
    ignoresTemp = true;
    return false;
  }

  return true;
}

let garbageTemp = false;
let garbageCount = 0;
function filterGarbage(char) {
  if (garbageTemp) {
    if (char === ">") {
      garbageTemp = false;
    } else {
      ++garbageCount;
    }
    return false;
  }
  if (char === "<") {
    garbageTemp = true;
    return false;
  }
  return true;
}

function filterCommas(char) {
  return char !== ",";
}

const stream = input
  .split("")
  .filter(filterIgnores)
  .filter(filterGarbage)
  .filter(filterCommas);

// console.log(stream);
let score = 0;
let level = 0;

for (const char of stream) {
  if (char === "{") {
    ++level;
    score += level;
  } else if (char === "}") {
    --level;
  } else {
    throw Error("wtf is this " + char);
  }
}

const partOne = score;
console.log("part one", partOne); // 11846

const partTwo = garbageCount;
console.log("part two", partTwo); // 6285
