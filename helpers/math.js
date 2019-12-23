// Greatest Common Divisor
const baseGcd = (a, b) => (b ? baseGcd(b, a % b) : a);
exports.gcd = (...args) => args.reduce(baseGcd);

// Lowest Common Multiple
const baseLcm = (a, b) => a * (b / baseGcd(a, b));
exports.lcm = (...args) => args.reduce(baseLcm);

// Extended Euclidean algorithm
// https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
const gcdExtended = (a, b) => {
  a = BigInt(a);
  b = BigInt(b);
  let x = 0n;
  let y = 1n;
  let u = 1n;
  let v = 0n;
  while (a !== 0n) {
    const q = b / a;
    [x, y, u, v] = [u, v, x - u * q, y - v * q];
    [a, b] = [b % a, a];
  }
  return [b, x, y];
};
exports.gcdExtended = gcdExtended;

// (A * B) mod C = (A mod C * B mod C) mod C
// good for large numbers since multiplying them directly isn't necessary
const modMul = (a, b, c) => ((a % c) * (b % c) + c) % c;
exports.modMul = modMul;

// Modular multiplicative inverse
// https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
const modInverse = (a, m) => {
  const [g, x] = gcdExtended(a, m);
  if (g !== 1n) {
    throw Error("Bad mod inverse");
  }

  return (x + m) % m;
};
exports.modInverse = modInverse;

// Fast modular exponentiation for a ^ b mod n
// https://gist.github.com/krzkaczor/0bdba0ee9555659ae5fe#gistcomment-2944839
const modExp = function(a, b, n) {
  a = BigInt(a % n);
  b = BigInt(b);
  n = BigInt(n);
  let result = 1n;
  let x = BigInt(a);
  while (b > 0) {
    if (b % 2n === 1n) {
      result = modMul(result, x, n);
    }
    b /= 2n;
    x = modMul(x, x, n);
  }
  return result;
};
exports.modExp = modExp;
