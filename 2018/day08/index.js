const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split(" ").map(Number);
// const input = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2];

// 2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
// A----------------------------------
//     B----------- C-----------
//                      D-----
function pull(arr) {
  const [child, meta] = arr.splice(0, 2);
  const children = lodash.range(child).map(() => pull(arr));
  const metadata = arr.splice(0, meta);
  return [children, metadata];
}

const tree = pull([...input]);

const partOne = lodash.sum(tree.flat(Infinity));
console.log("part one", partOne); // 36891

function value(arr) {
  const [children, metadata] = arr;

  if (!children.length) return lodash.sum(metadata);

  const values = metadata
    .map((idx) => children[idx - 1])
    .filter(Boolean)
    .map(value);
  return lodash.sum(values);
}

const partTwo = value(tree);
console.log("part two", partTwo); // 20083
