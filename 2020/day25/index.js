const cardPubKey = 12578151;
const doorPubKey = 5051300;

function transformSubjectNum(subjectNum, loopSize) {
  let val = 1;
  for (let i = 0; i < loopSize; ++i) {
    val = (val * subjectNum) % 20201227;
  }
  return val;
}

function findLoopSize(subjectNum, pubKey) {
  let size = 0;
  let val = 1;
  while (val !== pubKey) {
    ++size;
    val = (val * subjectNum) % 20201227;
  }
  return size;
}

const cardLoopSize = findLoopSize(7, cardPubKey);
const partOne = transformSubjectNum(doorPubKey, cardLoopSize);
console.log("part one", partOne); // 296776
