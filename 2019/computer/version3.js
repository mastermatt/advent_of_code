/**
 * Represents the original version after Day 7
 */
class Computer {
  constructor(memory, ...input) {
    this.memory = memory;
    this.inBuf = input;
    this.outBuf = [];
    this.pointer = 0; // instruction pointer
    this.halted = false;
    this.paused = true;
  }

  readNext() {
    // console.log("output buffer", this.outBuf)
    return this.outBuf.shift();
  }

  writeAndExec(...input) {
    // console.log("input buffer", this.inBuf);
    this.inBuf.push(...input);
    this.execute();
  }

  execute() {
    // let pointer = 0; // instruction pointer
    // const output = [];

    if (this.halted) {
      throw "halted";
    }

    // console.log("executing. pointer at", this.pointer);
    this.paused = false;
    const memory = this.memory;

    while (!this.paused) {
      const optCode = memory[this.pointer] % 100;
      const modes = [...String((memory[this.pointer] / 100) | 0)];
      // console.log(memory, input)
      // console.log(memory[this.pointer], optCode, modes);

      if (optCode === 99) {
        // halt
        this.halted = true;
        // console.log("halted");
        return;
      }

      const read = (pos) => {
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
        const a = read(this.pointer + 1);
        const b = read(this.pointer + 2);
        // console.log("adding", a, b, a + b, "to", this.pointer + 3);
        write(this.pointer + 3, a + b);
        this.pointer += 4;
      };

      const imul = () => {
        const a = read(this.pointer + 1);
        const b = read(this.pointer + 2);
        write(this.pointer + 3, a * b);
        this.pointer += 4;
      };

      // Opcode 3 takes a single integer as input and saves it to the address given by its only parameter.
      // For example, the instruction 3,50 would take an input value and store it at address 50.
      const readIn = () => {
        // console.log('reading in', this.inBuf)
        const a = this.inBuf.shift();

        if (a === undefined) {
          // console.log("pausing for input. pointer at", this.pointer);
          this.paused = true;
          return;
        }
        if (!Number.isSafeInteger(a)) {
          throw "invalid input: " + a;
        }

        // console.log(`writing input ${a} to ${p + 1}`);
        write(this.pointer + 1, a);
        this.pointer += 2;
      };

      // Opcode 4 outputs the value of its only parameter.
      // For example, the instruction 4,50 would output the value at address 50.
      const writeOut = () => {
        const a = read(this.pointer + 1);
        // console.log("output", a);
        this.outBuf.push(a);
        this.pointer += 2;
      };

      // Opcode 5 is jump-if-true: if the first parameter is non-zero, it sets the instruction
      // this.pointer to the value from the second parameter. Otherwise, it does nothing.
      const jumpIfTrue = () => {
        const a = read(this.pointer + 1);
        if (a !== 0) {
          this.pointer = read(this.pointer + 2);
        } else {
          this.pointer += 3;
        }
      };

      // Opcode 6 is jump-if-false: if the first parameter is zero, it sets the instruction this.pointer
      // to the value from the second parameter. Otherwise, it does nothing.
      const jumpIfFalse = () => {
        const a = read(this.pointer + 1);
        if (a === 0) {
          this.pointer = read(this.pointer + 2);
        } else {
          this.pointer += 3;
        }
      };

      // Opcode 7 is less than: if the first parameter is less than the second parameter, it stores 1
      // in the position given by the third parameter. Otherwise, it stores 0.
      const lessThan = () => {
        const a = read(this.pointer + 1);
        const b = read(this.pointer + 2);
        const val = a < b ? 1 : 0;
        write(this.pointer + 3, val);
        this.pointer += 4;
      };

      // Opcode 8 is equals: if the first parameter is equal to the second parameter, it stores 1
      // in the position given by the third parameter. Otherwise, it stores 0.
      const equals = () => {
        const a = read(this.pointer + 1);
        const b = read(this.pointer + 2);
        const val = a === b ? 1 : 0;
        write(this.pointer + 3, val);
        this.pointer += 4;
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
        8: equals, // CMP
      };

      const fn = optCodeMap[optCode] || badCode;
      fn();
      // console.log(fn.name, this.pointer);
    }
  }
}

exports.Computer = Computer;

// backwards compat
exports.execute = (memory, input = []) => {
  const c = new Computer(memory, ...input);
  c.execute();
  if (c.halted) {
    throw "missing input";
  }
  return c.outBuf;
};
