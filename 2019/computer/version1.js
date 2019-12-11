/**
 * Represents state after Day 2
 */
exports.execute = memory => {
  let p = 0;
  while (true) {
    const optCode = memory[p];
    // console.log(memory, optCode)

    if (optCode === 99) {
      // halt
      return;
    }

    if (optCode === 1) {
      // adds
      const a = memory[memory[p + 1]];
      const b = memory[memory[p + 2]];
      memory[memory[p + 3]] = a + b;
      p += 4;
    }

    if (optCode === 2) {
      // multiplies
      const a = memory[memory[p + 1]];
      const b = memory[memory[p + 2]];
      memory[memory[p + 3]] = a * b;
      p += 4;
    }
  }
};
