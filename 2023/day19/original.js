const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile.doubleSplit(__dirname, "./input.txt");

const workflows = input[0].reduce((acc, line) => {
  const [name, ...rest] = line.split(/[{},]/g);
  rest.pop(); // empty
  const otherwise = rest.pop();
  const conditions = rest.map((chunk) => {
    const key = chunk[0];
    const cmp = chunk[1];
    const [numStr, redirect] = chunk.substring(2).split(":");
    return { key, cmp, num: Number(numStr), redirect };
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

const stack = [
  [
    "in",
    {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
  ],
];
const accepted = [];

while (stack.length) {
  const [name, ratings] = stack.pop();

  if (name === "R") continue;
  if (name === "A") {
    accepted.push(ratings);
    continue;
  }

  const workflow = workflows[name];
  for (const cond of workflow.conditions) {
    const nr = lodash.cloneDeep(ratings);

    if (cond.cmp === "<") {
      ratings[cond.key][0] = cond.num;
      nr[cond.key][1] = cond.num - 1;
      stack.push([cond.redirect, nr]);
    } else {
      ratings[cond.key][1] = cond.num;
      nr[cond.key][0] = cond.num + 1;
      stack.push([cond.redirect, nr]);
    }
  }

  stack.push([workflow.otherwise, ratings]);
}

const partTwo = lodash.sum(
  accepted.map((rating) =>
    Object.values(rating)
      .map(([min, max]) => max - min + 1)
      .reduce((a, b) => a * b),
  ),
);
console.log("part two", partTwo, partTwo === 130745440937650); // ~7.3ms
