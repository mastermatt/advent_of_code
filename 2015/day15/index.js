const permutations = require("../../helpers/permutations");

const ingredients = {
  Frosting: { capacity: 4, durability: -2, flavor: 0, texture: 0, calories: 5 },
  Candy: { capacity: 0, durability: 5, flavor: -1, texture: 0, calories: 8 },
  Butterscotch: {
    capacity: -1,
    durability: 0,
    flavor: 5,
    texture: 0,
    calories: 6
  },
  Sugar: { capacity: 0, durability: 0, flavor: -2, texture: 2, calories: 1 }
};

// 5 0 0 0
// 4 1 0 0
// 3 2 0 0
// 2 3 0 0
// 1 4 0 0
// 0 5 0 0
// 4 0 1 0

function* proportions(numIngredients, totalAmount) {
  const arr = new Array(numIngredients);
  arr[0] = totalAmount;

  while (true) {
    yield arr;
  }
}
