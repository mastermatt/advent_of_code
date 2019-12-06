exports.execute = (memory, input = []) => {
  let p = 0; // instruction pointer
  let inputIndex = 0;
  const output = [];

  while (true) {
    const optCode = memory[p] % 100;
    const modes = [...String((memory[p] / 100) | 0)];
    // console.log(memory, input)
    // console.log(optCode, modes);

    if (optCode === 99) {
      // halt
      return output;
    }

    const read = pos => {
      const mode = modes.pop() || "0";
      if (mode === "0") {
        return memory[memory[pos]];
      }
      if (mode === "1") {
        return memory[pos];
      }
      throw `bad read mode ${mode}`;
    };

    const write = (pos, val) => {
      const mode = modes.pop() || "0";
      if (mode === "0") {
        memory[memory[pos]] = val;
      } else if (mode === "1") {
        memory[pos] = val;
      } else {
        throw `bad write mode ${mode}`;
      }
    };

    const add = () => {
      const a = read(p + 1);
      const b = read(p + 2);
      write(p + 3, a + b);
      p += 4;
    };

    const imul = () => {
      const a = read(p + 1);
      const b = read(p + 2);
      write(p + 3, a * b);
      p += 4;
    };

    // Opcode 3 takes a single integer as input and saves it to the address given by its only parameter.
    // For example, the instruction 3,50 would take an input value and store it at address 50.
    const readIn = () => {
      const a = input[inputIndex++];

      if (a === undefined) {
        throw "missing input";
      }
      if (!Number.isSafeInteger(a)) {
        throw "invalid input: " + a;
      }

      // console.log(`writing input ${a} to ${p + 1}`);
      write(p + 1, a);
      p += 2;
    };

    // Opcode 4 outputs the value of its only parameter.
    // For example, the instruction 4,50 would output the value at address 50.
    const writeOut = () => {
      const a = read(p + 1);
      // console.log("output", a);
      output.push(a);
      p += 2;
    };

    // Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction
    // pointer to the value from the second parameter. Otherwise, it does nothing.
    const jumpIfTrue = () => {
      const a = read(p + 1);
      if (a !== 0) {
        p = read(p + 2);
      } else {
        p += 3;
      }
    };

    // Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction pointer
    // to the value from the second parameter. Otherwise, it does nothing.
    const jumpIfFalse = () => {
      const a = read(p + 1);
      if (a === 0) {
        p = read(p + 2);
      } else {
        p += 3;
      }
    };

    // Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1
    // in the position given by the third parameter. Otherwise, it stores 0.
    const lessThan = () => {
      const a = read(p + 1);
      const b = read(p + 2);
      const val = a < b ? 1 : 0;
      write(p + 3, val);
      p += 4;
    };

    // Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1
    // in the position given by the third parameter. Otherwise, it stores 0.
    const equals = () => {
      const a = read(p + 1);
      const b = read(p + 2);
      const val = a === b ? 1 : 0;
      write(p + 3, val);
      p += 4;
    };

    const badCode = () => {
      throw `bad opt code ${optCode}`;
    };

    const optCodeMap = {
      1: add,
      2: imul,
      3: readIn,
      4: writeOut,
      5: jumpIfTrue,
      6: jumpIfFalse,
      7: lessThan,
      8: equals // CMP
    };

    (optCodeMap[optCode] || badCode)();
  }
};
