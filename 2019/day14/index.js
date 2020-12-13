const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const productionCharts = {};
let bank = {
  ORE: {
    available: Infinity,
    consumed: 0,
  },
};

input.forEach((line) => {
  const [costs, output] = line.split(" => ");
  const eachCost = costs.split(", ");
  const [outputCount, outputKey] = output.split(" ");

  productionCharts[outputKey] = {
    producedQty: Number(outputCount),
    inputs: eachCost.map((c) => {
      const [count, key] = c.split(" ");
      const requiredQty = Number(count);
      return { key, requiredQty };
    }),
  };

  bank[outputKey] = { available: 0, consumed: 0 };
});

const produceFuel = (requiredQty) => {
  const stack = [{ key: "FUEL", requiredQty }];

  while (stack.length) {
    const { key, requiredQty } = stack.pop();

    const chart = productionCharts[key];
    const neededQty = requiredQty - bank[key].available;
    const multiplier = Math.ceil(neededQty / chart.producedQty);

    const inputShorts = chart.inputs.filter(
      ({ key, requiredQty }) => bank[key].available < requiredQty * multiplier
    );

    if (!inputShorts.length) {
      // we have enough, proceed with reaction
      chart.inputs.forEach(({ key, requiredQty }) => {
        bank[key].available -= requiredQty * multiplier;
        bank[key].consumed += requiredQty * multiplier;
      });
      bank[key].available += chart.producedQty * multiplier;
      continue;
    }

    // we don't have enough input material to produce the current node's mineral
    stack.push({ key, requiredQty });
    const childNodes = inputShorts.map(({ key, requiredQty }) => ({
      key,
      requiredQty: requiredQty * multiplier,
    }));
    stack.push(...childNodes);
  }
};

produceFuel(1);
// console.log(productionCharts);
// console.log(bank);

const partOne = bank.ORE.consumed;
console.log("step one", partOne); // 346961

// this magic number came from about a minute of trial and error to find a quantity that would be
// close, but still under the 1 trillion mark. Then I just let it walk up one FUEL at a time until it crossed the limit.
produceFuel(4060000);
// console.log(bank);

while (bank.ORE.consumed < 1000000000000) {
  produceFuel(bank.FUEL.available + 1);
  // console.log(bank.FUEL.available, 1000000000000 - bank.ORE.consumed);
  // console.log(bank);
}

const partTwo = bank.FUEL.available - 1;
console.log("step two", partTwo); // 4065790
