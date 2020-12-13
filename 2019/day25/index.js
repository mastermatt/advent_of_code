const Iter = require("es-iter");

const readFile = require("../../helpers/readFile");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

class Droid {
  constructor(instructions) {
    this.print = true;
    this.comp = new Computer([...instructions]);
    this.comp.execute();
    console.log(this.comp.readASCII());
  }

  cmd(cmd) {
    this.comp.writeASCII(`${cmd}\n`);
    this.comp.execute();
    const output = this.comp.readASCII();
    if (this.print) {
      console.log(cmd, "\n", output);
    }
    return output;
  }

  take(item) {
    this.cmd(`take ${item}`);
  }

  drop(item) {
    this.cmd(`drop ${item}`);
  }

  inventory() {
    return this.cmd("inv")
      .split("\n")
      .filter((line) => line.startsWith("- "))
      .map((line) => line.substring(2));
  }

  north() {
    return this.cmd("north");
  }

  east() {
    return this.cmd("east");
  }

  south() {
    return this.cmd("south");
  }

  west() {
    return this.cmd("west");
  }
}

const droid = new Droid(input);

// can take:
// - wreath                       Hot Chocolate Fountain
// - weather machine              Navigation
// - prime number                 Holodeck
// - astrolabe                    Stables
// - candy cane                   Passages
// - food ration                  Observatory
// - hypercube                    Engineering
// - space law space brochure     Crew Quarters

// Don't take the photons! they kill you
// Don't take the giant electromagnet! it sticks you to the floor
// Don't take the infinite loop! everything just stops
// Don't take the molten lava! you melt
// Don't take the escape pod! you're launched into space

// Since I wasn't in a rush on this one, I had fun and actually played the game longhand in
// a terminal and kept notes on a scratch pad.
droid.north();
droid.east();
droid.east();
droid.east();
droid.take("weather machine");
droid.west();
droid.west();
droid.west();
droid.take("wreath");
droid.south();
droid.south();
droid.south();
droid.take("candy cane");
droid.north();
droid.west();
droid.west();
droid.take("astrolabe");
droid.east();
droid.take("prime number");
droid.east();
droid.north();
droid.east();
droid.take("food ration");
droid.south();
droid.east();
droid.south();
droid.take("hypercube");
droid.east();
droid.take("space law space brochure");
droid.north();
// the droid is now at the security checkpoint, with the pressure-sensitive floor to the west.
const inv = droid.inventory();

// console.log("parsed inventory", inv, inv.length);
// Alert! Droids on this ship are lighter than the detected value!

const tryWeight = (droid, items) => {
  const currentInv = droid.inventory();
  items
    .filter((item) => !currentInv.includes(item))
    .forEach((item) => droid.take(item));
  currentInv
    .filter((item) => !items.includes(item))
    .forEach((item) => droid.drop(item));
  const checkpointResult = droid.west();
  const valid = !checkpointResult.includes(
    "you are ejected back to the checkpoint"
  );
  if (valid) {
    console.log(checkpointResult);
  }
  return valid;
};

const tryAllWeights = () => {
  droid.print = false;
  for (let i = 1; i <= inv.length; i++) {
    for (const items of new Iter(inv).combinations(i)) {
      // console.log(items);
      if (tryWeight(droid, items)) {
        return;
      }
    }
  }
};

tryAllWeights();
// A loud, robotic voice says "Analysis complete! You may proceed." and you enter the cockpit.
// Santa notices your small droid, looks puzzled for a moment, realizes what has happened, and radios your ship directly.
// "Oh, hello! You should be able to get in by typing 2415919488 on the keypad at the main airlock."

// In the end, only needed:
// - candy cane
// - food ration
// - space law space brochure
// - astrolabe
