const DefaultDict = require("../../helpers/defaultdict");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const regs = new DefaultDict(0);

function doComp(reg, comp, amount) {
  switch (comp) {
    case ">":
      return regs[reg] > parseInt(amount);
    case ">=":
      return regs[reg] >= parseInt(amount);
    case "<":
      return regs[reg] < parseInt(amount);
    case "<=":
      return regs[reg] <= parseInt(amount);
    case "==":
      return regs[reg] === parseInt(amount);
    case "!=":
      return regs[reg] !== parseInt(amount);
    default:
      throw Error("unknown comp " + comp);
  }
}

let highest = 0;

// Each instruction consists of several parts: the register to modify, whether to increase or
// decrease that register's value, the amount by which to increase or decrease it, and a
// condition. If the condition fails, skip the instruction without modifying the register.
// noj dec -566 if hwv <= 911
input.forEach((line) => {
  const [modReg, ins, amount, fi, refReg, comp, refAmount] = line.split(" ");
  if (doComp(refReg, comp, refAmount)) {
    if (ins === "inc") regs[modReg] += parseInt(amount);
    else regs[modReg] -= parseInt(amount);

    highest = Math.max(highest, regs[modReg]);
  }
});

const partOne = Math.max(...Object.values(regs));
console.log("part one", partOne); // 5849

const partTwo = highest;
console.log("part two", partTwo); // 6702
