const lodash = require("lodash");

const readFile = require("../helpers/readFile");
const computer = require("./computer");

const input = readFile(__dirname, "./input/day7.txt")[0]
  .split(",")
  .map(Number);

// const seq = [1,0,4,3,2];
//
//
//   const a = seq.reduce((acc, i) => {
//     const res = computer.execute([...input], [i, acc]);
//     return res[0];
//   }, 0);
//
// console.log("######", a)

// not having `itertools.permutations` really hurt me here
const splitN = xxx => [
  xxx % 5,
  ((xxx / 5) | 0) % 5,
  ((xxx / 5 ** 2) | 0) % 5,
  ((xxx / 5 ** 3) | 0) % 5,
  ((xxx / 5 ** 4) | 0) % 5
];
const splitM = xxx => [
  5 + (xxx % 5),
  5 + (((xxx / 5) | 0) % 5),
  5 + (((xxx / 5 ** 2) | 0) % 5),
  5 + (((xxx / 5 ** 3) | 0) % 5),
  5 + (((xxx / 5 ** 4) | 0) % 5)
];

const removeDups = xxx => {
  return new Set(xxx).size === 5;
};

const a = seq => {
  // console.log(seq)
  return seq.reduce((acc, i) => {
    const res = computer.execute([...input], [i, acc]);
    return res[0];
  }, 0);
};

const results = lodash
  .range(5 ** 5)
  .map(splitN)
  .filter(removeDups)
  .map(a);

const partOne = Math.max(...results);
console.log("part one", partOne); // 406192765! 6483810!  67023

const phaseSettings = lodash
  .range(5 ** 5)
  .map(splitM)
  .filter(removeDups);

// right about here is when I realized my intCode computer had a massive flaw.
// it worked by looping until it hit a halt code then returned the array of outputs it
// had built up. But it needed to output as it went and pause while waiting for inputs.
// So I was forced to "quickly" refactor computer.js from a function to a class.
const trySetting = settings => {
  const t = [
    new computer.Computer([...input], settings.pop()),
    new computer.Computer([...input], settings.pop()),
    new computer.Computer([...input], settings.pop()),
    new computer.Computer([...input], settings.pop()),
    new computer.Computer([...input], settings.pop())
  ];

  // const seq = [9, 8, 7, 6, 5];
  // console.log("#####", seq)
  // let a = seq.reduce((acc, v, i) => {
  //   console.log("next comp", i, v, acc)
  //   t[i].writeAndExec(v, acc);
  //   // const res = computer.execute(tapes[i], [v, acc]);
  //   return t[i].readNext();
  // }, 0);
  // console.log("##### after one loop", a)
  let limit = 1000;
  let a = 0;
  while (--limit) {
    a = t.reduce((acc, comp) => {
      // console.log("next comp", i, acc);
      comp.writeAndExec(acc);
      // console.log("###", comp.memory, comp.inBuf, comp.outBuf);
      return comp.readNext();
      // const res = computer.execute(tapes[i], [v, acc]);
      // return res[0];
    }, a);
    // console.log("after a loop", limit, a);
    if (t[t.length - 1].halted) {
      break;
    }
  }

  return a;
};

// // 3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
// //                 ^                ^            ^                ^
// // 59464400!
// console.log("######", a); // 139629729
//

const feedbackResults = phaseSettings.map(trySetting);

const partTwo = Math.max(...feedbackResults);
console.log("part two", partTwo); // 7818398
