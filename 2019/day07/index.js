const lodash = require("lodash");

const readFile = require("../../helpers/readFile");
const permutations = require("../../helpers/permutations");
const { Computer } = require("../computer");

const input = readFile(__dirname, "./input.txt")[0].split(",").map(Number);

const potentialPhaseSettingSequences = permutations(lodash.range(5));

const runAmplifiers = (phaseSettingSequence) => {
  return phaseSettingSequence.reduce((inputSig, phaseSetting) => {
    const amp = new Computer([...input], phaseSetting, inputSig);
    amp.execute();
    return amp.readNext();
  }, 0);
};

const thrusterSignals = potentialPhaseSettingSequences.map(runAmplifiers);
const partOne = Math.max(...thrusterSignals);
console.log("part one", partOne); // 67023

const potentialSequences2 = permutations(lodash.range(5, 10));

const runAmpsWithFeedback = (phaseSettingSequence) => {
  let passedSignal = 0;
  const amps = phaseSettingSequence.map(
    (setting) => new Computer([...input], setting),
  );

  // we assume all the amps will halt on the same loop, so we only check one of them
  while (!amps[0].halted) {
    amps.forEach((amp) => {
      amp.writeAndExec(passedSignal);
      passedSignal = amp.readNext();
    });
  }

  return passedSignal;
};

const feedbackResults = potentialSequences2.map(runAmpsWithFeedback);
const partTwo = Math.max(...feedbackResults);
console.log("part two", partTwo); // 7818398
