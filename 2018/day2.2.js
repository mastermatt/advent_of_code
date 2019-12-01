const fs = require("fs");
const lodash = require("lodash")

const input = fs
  .readFileSync("day2_input.txt")
  .toString()
  .split("\n");

  const close = (a, b) => {
      let m = 0
      for (const i in a) {
        if (a[i] === b[i]) {
            continue
        }
        if (m > 0) {
            return false
        }
        m++
      }
      return true
  }

const stack = []

for (const line of input) {
    const prev = stack.find(a => close(a, line))
    if (prev) {
        console.log(prev, line)
        break
    }
    stack.push(line)
}

// hhvsdkatysmiqjxbunezgwcdpr
// hhvsdkatysmiqjxjunezgwcdpr
// hhvsdkatysmiqjxunezgwcdpr
