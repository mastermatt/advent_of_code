/**
 * Represents the original version after Day 6
 */
exports.execute = (memory, input = []) => {
  let p = 0;
  while (true) {
    const optCode = memory[p] % 100;
    const modes = [...String((memory[p] / 100) | 0)];
    // console.log(memory, optCode)
    // console.log(optCode, modes);

    const read = pos => {
      const mode = modes.pop() || "0";
      if (mode === "0") {
        return memory[memory[pos]];
      }
      if (mode === "1") {
        return memory[pos];
      }
      throw " bad read mode " + mode;
    };

    const write = (pos, val) => {
      const mode = modes.pop() || "0";
      if (mode === "0") {
        memory[memory[pos]] = val;
      } else if (mode === "1") {
        memory[pos] = parseInt(val);
      } else {
        throw " bad write mode " + mode;
      }
    };

    if (optCode === 99) {
      // halt
      return;
    } else if (optCode === 1) {
      // adds
      const a = read(p + 1);
      const b = read(p + 2);
      write(p + 3, a + b);
      p += 4;
    } else if (optCode === 2) {
      // multiplies
      const a = read(p + 1);
      const b = read(p + 2);
      write(p + 3, a * b);
      p += 4;
    } else if (optCode === 3) {
      // save
      const a = input.pop();

      if (a === undefined) {
        throw "missing input";
      } else {
        console.log("saving", a, "to", p + 1);
      }
      write(p + 1, a);
      p += 2;
    } else if (optCode === 4) {
      // output
      const a = read(p + 1);
      console.log("output", a);
      p += 2;
    } else if (optCode === 5) {
      // jump-if-true
      const a = read(p + 1);
      if (a !== 0) {
        p = read(p + 2);
      } else {
        p += 3;
      }
    } else if (optCode === 6) {
      // jump-if-false
      const a = read(p + 1);
      if (a === 0) {
        p = read(p + 2);
      } else {
        p += 3;
      }
    } else if (optCode === 7) {
      // less than
      const a = read(p + 1);
      const b = read(p + 2);
      const val = a < b ? 1 : 0;
      write(p + 3, val);
      p += 4;
    } else if (optCode === 8) {
      // equals
      const a = read(p + 1);
      const b = read(p + 2);
      const val = a === b ? 1 : 0;
      write(p + 3, val);
      p += 4;
    } else {
      throw "bad opt code " + optCode;
    }
  }
};

// Opcode 3 takes a single integer as input and saves it to the address given by its only parameter. For example, the instruction 3,50 would take an input value and store it at address 50.
// Opcode 4 outputs the value of its only parameter. For example, the instruction 4,50 would output the value at address 50.
// Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
// Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer to the value from the second parameter. Otherwise, it does nothing.
// Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
// Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1 in the position given by the third parameter. Otherwise, it stores 0.
