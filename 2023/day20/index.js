const readFile = require("../../helpers/readFile");
const { lcm } = require("../../helpers/math");

const input = readFile(__dirname, "./input.txt");

const config = {};
for (const line of input) {
  const [a, b] = line.split(" -> ");
  const name = a === "broadcaster" ? a : a.substring(1);
  const type = a[0];
  const destinations = b.split(", ");
  config[name] = { name, type, destinations };
}

function pushBtn(state) {
  ++state.btnPresses;
  const stack = [["button", "broadcaster", false]];

  while (stack.length) {
    const [transmitter, receiver, isHigh] = stack.shift();

    if (isHigh) ++state.highPulses;
    else ++state.lowPulses;

    // console.log(`${transmitter} -${isHigh? 'high': 'low'}-> ${receiver}`)

    const module = config[receiver];

    if (!module) {
      state[receiver] = isHigh;
      continue;
    }

    if (module.type === "b") {
      for (const dest of module.destinations) {
        stack.push([receiver, dest, isHigh]);
      }
      continue;
    }

    if (module.type === "%") {
      // Flip-flop modules (prefix %) are either on or off; they are initially off.
      // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
      // However, if a flip-flop module receives a low pulse, it flips between on and off.
      // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
      if (isHigh) continue;
      state[receiver] = !state[receiver];
      for (const dest of module.destinations) {
        stack.push([receiver, dest, state[receiver]]);
      }
      continue;
    }

    if (module.type === "&") {
      // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of
      // their connected input modules; they initially default to remembering a low pulse for each input.
      // When a pulse is received, the conjunction module first updates its memory for that input.
      // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
      state[receiver][transmitter] = isHigh;
      const pulse = !Object.values(state[receiver]).every(Boolean);

      if (receiver === "zh" && isHigh && transmitter === "dl")
        console.log("zh", pulse, state.btnPresses, state[receiver]);

      for (const dest of module.destinations) {
        stack.push([receiver, dest, pulse]);
      }
      continue;
    }

    console.error("wtf?", module);
    throw Error("wtf?");
  }
}

function initState() {
  const state = { btnPresses: 0, highPulses: 0, lowPulses: 0 };

  for (const module of Object.values(config)) {
    if (module.type === "%") state[module.name] = false;
    if (module.type === "&") {
      const inputs = Object.values(config)
        .filter((mod) => mod.destinations.includes(module.name))
        .map((mod) => mod.name);
      const m = {};
      state[module.name] = m;
      for (const name of inputs) m[name] = false;
    }
  }
  return state;
}

const s = initState();
while (s.btnPresses < 1000) pushBtn(s);

const partOne = s.highPulses * s.lowPulses;
console.log("part one", partOne, partOne === 839775244);

// const s2 = initState();
// while (s2.rx !== false) pushBtn(s2);
// const partTwo = s2.btnPresses;

// I realized, by looking at the input, that rx if feed by a single conjunction module,
// which is feed by four conjunction modules. I figured I needed to find how often those four
// triggered a high pulse then find the LCM of them. I just logged out which button press
// number caused each of the four to trigger and copied the values here.
// Could this programmatic? Probably.
// vd 3881
// ns 3767
// bh 3761
// dl 3779
const partTwo = lcm(3881, 3767, 3761, 3779);
console.log("part two", partTwo, partTwo === 207787533680413);
