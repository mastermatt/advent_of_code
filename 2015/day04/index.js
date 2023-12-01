const crypto = require("crypto");

const input = "ckczppom";

let counter = 0;
let hash = "";

while (!hash.startsWith("00000")) {
  hash = crypto.createHash("md5").update(`${input}${++counter}`).digest("hex");
}

console.log("part one", counter); // 117946
console.log("part two", counter); // 3938038
