const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");
const initSeq = input[0].split(",");

function hash(str) {
  let currVal = 0;
  for (let i = 0; i < str.length; i++) {
    currVal += str.charCodeAt(i);
    currVal = (currVal * 17) % 256;
  }
  return currVal;
}

const partOne = lodash.sum(initSeq.map(hash));
console.log("part one", partOne, partOne === 507291); // ~1.0ms

const boxes = new Array(256);

function getBox(label) {
  return (boxes[hash(label)] ||= []);
}

for (const step of initSeq) {
  if (step[step.length - 1] === "-") {
    const label = step.slice(0, -1);
    const box = getBox(label);
    const idx = box.findIndex((lens) => lens.label === label);
    if (idx !== -1) box.splice(idx, 1);
  } else {
    const [label, focalLenStr] = step.split("=");
    const focalLen = Number(focalLenStr);
    const box = getBox(label);
    const idx = box.findIndex((lens) => lens.label === label);
    if (idx === -1) box.push({ label, focalLen });
    else box[idx].focalLen = focalLen;
  }
}

let focusingPower = 0;

for (let i = 0; i < boxes.length; i++) {
  const box = boxes[i];
  if (!box) continue;
  for (let j = 0; j < box.length; j++) {
    focusingPower += (i + 1) * (j + 1) * box[j].focalLen;
  }
}

const partTwo = focusingPower;
console.log("part two", partTwo, partTwo === 296921); // ~1.8ms
