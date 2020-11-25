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
// https://en.wikipedia.org/wiki/Modular_exponentiation
// O(log(exponent))
const modExp = function(base, exponent, modulus) {
  base = BigInt(base % modulus);
  exponent = BigInt(exponent);
  modulus = BigInt(modulus);
  let result = 1n;
  while (exponent > 0) {
    // noinspection JSBitwiseOperatorUsage
    if (exponent & 1n) {
      // least significant bit is set
      result = modMul(result, base, modulus);
    }
    exponent >>= 1n;
    base = modMul(base, base, modulus);
  }
  return result;
};
exports.modExp = modExp;

// https://stackoverflow.com/a/40200710/823942
const isPrime = num => {
  for (let i = 2, s = Math.sqrt(num); i <= s; ++i) {
    if (num % i === 0) return false;
  }
  return num > 1;
};
exports.isPrime = isPrime;
