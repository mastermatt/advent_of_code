const input = "3113322113";

const iterate = (str) => {
  const result = [];
  let c = 0;
  let l = str[0];

  for (let i = 0; i < str.length; i++) {
    if (str[i] === l) {
      c++;
    } else {
      result.push(c, l);
      l = str[i];
      c = 1;
    }
  }

  result.push(c, l);
  return result.join("");
};

let seq = input;
for (let i = 0; i < 40; i++) {
  seq = iterate(seq);
}

const partOne = seq.length;
console.log("part one", partOne); // 329356

seq = input;
for (let i = 0; i < 50; i++) {
  seq = iterate(seq);
}

const partTwo = seq.length;
console.log("part two", partTwo); // 4666278
