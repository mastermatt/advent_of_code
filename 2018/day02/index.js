const lodash = require("lodash");

const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split("");

let hasTwo = 0;
let hasThree = 0;

input.forEach(line => {
  const map = [...line].reduce((a, e) => {
    a[e] = a[e] ? a[e] + 1 : 1;
    return a;
  }, {});
  const inv = lodash.invert(map);
  if (inv["2"]) {
    hasTwo++;
  }
  if (inv["3"]) {
    hasThree++;
  }
  // console.log(line, map, inv, hasTwo, hasThree)
});

console.log("part one", hasTwo * hasThree); // 8398

const close = (a, b) => {
  let m = -1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      continue;
    }
    if (m !== -1) {
      return false;
    }
    m = i;
  }

  // return `${a.substring(0, m)}{${a[m]}|${b[m]}}${a.substring(m+1)}`;
  return `${a.substring(0, m)}${a.substring(m + 1)}`;
};

const stack = [];

for (const line of input) {
  stack.find(a => {
    const match = close(a, line);
    if (match) {
      console.log("part two", match);
    }
    return !!match;
  });

  stack.push(line);
}

// hhvsdkatysmiqjxbunezgwcdpr
// hhvsdkatysmiqjxjunezgwcdpr
// hhvsdkatysmiqjxunezgwcdpr
