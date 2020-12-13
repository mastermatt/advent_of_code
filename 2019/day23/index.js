const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const NAT_ADDR = 255;

const one = (comps) => {
  const networkQueue = [];
  comps.forEach((comp) => {
    comp.writeAndExec(-1);
    while (comp.hasOutput) {
      networkQueue.push(comp.readChunk(3));
    }
  });

  while (networkQueue.length) {
    const [idx, ...instructions] = networkQueue.shift();
    // console.log(idx, instructions)
    const comp = comps[idx];
    comp.writeAndExec(...instructions);

    while (comp.hasOutput) {
      const [addr, x, y] = comp.readChunk(3);
      networkQueue.push([addr, x, y]);
      if (addr === NAT_ADDR) {
        // console.log("have y", y);
        return y;
      }
    }
  }
};

const comps1 = lodash.range(50).map((idx) => new Computer([...input], idx));
const partOne = one(comps1);
console.log("part one", partOne); // 17541

const two = (comps) => {
  let natX = 0;
  let natY = 0;
  let natLastY = 0;

  comps.forEach((comp) => comp.execute()); // they each need to process their address input first

  while (true) {
    let hadOutput = false;
    for (const comp of comps) {
      if (!comp.inBuf.length) {
        comp.write(-1);
      }
      comp.execute();

      while (comp.hasOutput) {
        hadOutput = true;
        const [addr, x, y] = comp.readChunk(3);
        // console.log(addr, x, y)
        if (addr === NAT_ADDR) {
          [natX, natY] = [x, y];
        } else {
          comps[addr].write(x, y);
        }
      }
    }

    if (!hadOutput) {
      // console.log("system idle, NAT sending", natX, natY);
      if (natY === natLastY) {
        return natY;
      }
      natLastY = natY;
      comps[0].write(natX, natY);
    }
  }
};

const comps2 = lodash.range(50).map((idx) => new Computer([...input], idx));
const partTwo = two(comps2);
console.log("part two", partTwo); // 12415
