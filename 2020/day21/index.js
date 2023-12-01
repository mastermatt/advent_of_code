const lodash = require("lodash");
const readFile = require("../../helpers/readFile");

// mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
const input = readFile(__dirname, "./input.txt");
// const input = readFile(__dirname, "./sample.txt");

const parsed = input.map((line) => {
  const [a, b] = line.split(" (contains ");
  const ingredients = a.split(" ");
  const allergens = b.slice(0, -1).split(", ");
  return [ingredients, allergens];
});

const allIngredients = parsed.map(([ingredients]) => ingredients).flat();
const possibles = {};
parsed.forEach(([ingredients, allergens]) => {
  for (const allergen of allergens) {
    if (possibles[allergen]) {
      possibles[allergen] = lodash.intersection(
        possibles[allergen],
        ingredients,
      );
    } else {
      possibles[allergen] = ingredients;
    }
  }
});

const possibleIngredients = Object.values(possibles).flat();
const inertIngredients = lodash.difference(allIngredients, possibleIngredients);

const partOne = inertIngredients.length;
console.log("part one", partOne); // 1882

// borrowed from Day 16
const possibleArrays = lodash.sortBy(Object.values(possibles), "length");
const locked = [];
for (const arr of possibleArrays) {
  const keepIdx = arr.findIndex((val) => !locked.includes(val));
  arr.splice(0, keepIdx); // mutating the array in place so the map prunes down
  arr.splice(1);
  locked.push(arr[0]);
}

const sorted = Object.entries(possibles)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map((arr) => arr[1][0]);

const partTwo = sorted.join(",");
console.log("part two", partTwo); // xgtj,ztdctgq,bdnrnx,cdvjp,jdggtft,mdbq,rmd,lgllb
