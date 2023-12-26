const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

const workflows = input[0].reduce((acc, line) => {
  const [name, ...rest] = line.split(/[{},]/g);
  rest.pop(); // empty
  const otherwise = rest.pop();
  const conditions = rest.map((chunk) => {
    const key = chunk[0];
    const keyIdx = "xmas".indexOf(key);
    const cmp = chunk[1];
    const [numStr, redirect] = chunk.substring(2).split(":");
    const num = Number(numStr);
    return { key, keyIdx, cmp, num, redirect };
  });

  acc[name] = { conditions, otherwise };
  return acc;
}, {});

const ratings = input[1].map((line) => {
  return line
    .substring(1, line.length - 1)
    .split(",")
    .reduce((acc, curr) => {
      const [k, v] = curr.split("=");
      acc[k] = Number(v);
      return acc;
    }, {});
});

function runWorkflows(rating) {
  {
    let curr = "in";
    while (workflows[curr]) {
      const workflow = workflows[curr];
      const cond = workflow.conditions.find((cond) =>
        cond.cmp === ">"
          ? rating[cond.key] > cond.num
          : rating[cond.key] < cond.num,
      );
      curr = cond?.redirect ?? workflow.otherwise;
    }

    return curr;
  }
}

function sumRating(rating) {
  return lodash.sum(Object.values(rating));
}

const approvedSums = ratings
  .filter((rating) => runWorkflows(rating) === "A")
  .map(sumRating);

const partOne = lodash.sum(approvedSums);
console.log("part one", partOne, partOne === 333263); // ~0.37ms

const stack = [["in", [1, 4000, 1, 4000, 1, 4000, 1, 4000]]];
let totalCombinations = 0;

while (stack.length) {
  const [name, ratings] = stack.pop();

  if (name === "R") continue;
  if (name === "A") {
    totalCombinations +=
      (ratings[1] - ratings[0] + 1) *
      (ratings[3] - ratings[2] + 1) *
      (ratings[5] - ratings[4] + 1) *
      (ratings[7] - ratings[6] + 1);
    continue;
  }

  const workflow = workflows[name];
  for (const cond of workflow.conditions) {
    const nr = [...ratings];
    const minIdx = cond.keyIdx * 2;
    const maxIdx = minIdx + 1;

    if (cond.cmp === "<") {
      ratings[minIdx] = cond.num;
      nr[maxIdx] = cond.num - 1;
    } else {
      ratings[maxIdx] = cond.num;
      nr[minIdx] = cond.num + 1;
    }
    stack.push([cond.redirect, nr]);
  }

  stack.push([workflow.otherwise, ratings]);
}

const partTwo = totalCombinations;
console.log("part two", partTwo, partTwo === 130745440937650); // ~0.84
