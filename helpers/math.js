// Greatest Common Divisor
const baseGcd = (a, b) => (b ? baseGcd(b, a % b) : a);
exports.gcd = (...args) => args.reduce(baseGcd);

// Lowest Common Multiple
const baseLcm = (a, b) => a * (b / baseGcd(a, b));
exports.lcm = (...args) => args.reduce(baseLcm);
