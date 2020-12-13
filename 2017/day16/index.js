const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt")[0].split(",");

const alpha = "abcdefghijklmnop";
const programs = alpha.split("");

// Spin, written sX, makes X programs move from the end to the front,
//    but maintain their order otherwise. (For example, s3 on abcde produces cdeab).
// Exchange, written xA/B, makes the programs at positions A and B swap places.
// Partner, written pA/B, makes the programs named A and B swap places.

function spin(idx) {
  programs.unshift(...programs.splice(-parseInt(idx)));
}

function exchange(a, b) {
  const temp = programs[a];
  programs[a] = programs[b];
  programs[b] = temp;
}

function partner(a, b) {
  exchange(programs.indexOf(a), programs.indexOf(b));
}

const moveMap = { s: spin, x: exchange, p: partner };
const moves = input.map((move) => {
  const match = move.match(/^([sxp])(\w+)\/?(\w+)?$/);
  return [moveMap[match[1]], match[2], match[3]];
});

let rounds = 0;
function round() {
  ++rounds;
  for (const [cb, a, b] of moves) cb(a, b);
}

round();
const partOne = programs.join("");
console.log("part one", partOne); // bkgcdefiholnpmja

while (programs.join("") !== alpha) {
  round();
}

// number of rounds before the programs end up back where they started
const repeatSize = rounds;
for (let i = 0; i < 1_000_000_000 % repeatSize; ++i) {
  round();
}

const partTwo = programs.join("");
console.log("part two", partTwo); // knmdfoijcbpghlea
