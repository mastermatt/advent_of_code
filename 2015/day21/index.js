const Iter = require("es-iter");

// -- input --
// Hit Points: 104
// Damage: 8
// Armor: 1
const baseBoss = {
  hit_points: 104,
  damage: 8,
  armor: 1,
};

const basePlayer = {
  hit_points: 100,
  damage: 0,
  armor: 0,
};

// Name Cost  Damage  Armor
const shop = {
  weapons: [
    ["Dagger", 8, 4, 0],
    ["Shortsword", 10, 5, 0],
    ["Warhammer", 25, 6, 0],
    ["Longsword", 40, 7, 0],
    ["Greataxe", 74, 8, 0],
  ],
  armor: [
    ["None", 0, 0, 0],
    ["Leather", 13, 0, 1],
    ["Chainmail", 31, 0, 2],
    ["Splintmail", 53, 0, 3],
    ["Bandedmail", 75, 0, 4],
    ["Platemail", 102, 0, 5],
  ],
  rings: [
    ["None 1", 0, 0, 0],
    ["None 2", 0, 0, 0],
    ["Damage +1", 25, 1, 0],
    ["Damage +2", 50, 2, 0],
    ["Damage +3", 100, 3, 0],
    ["Defense +1", 20, 0, 1],
    ["Defense +2", 40, 0, 2],
    ["Defense +3", 80, 0, 3],
  ],
};

function* genInventory() {
  for (const weapon of shop.weapons) {
    for (const armor of shop.armor) {
      const ringIter = new Iter(shop.rings).combinations(2);
      for (const rings of ringIter) {
        yield [weapon, armor, ...rings];
      }
    }
  }
}

// Returns true if the player wins
function battle(player, boss) {
  let playersTurn = true;
  while (true) {
    const [attacker, defender] = playersTurn ? [player, boss] : [boss, player];
    const damage = Math.max(1, attacker.damage - defender.armor);
    defender.hit_points -= damage;
    // console.log(playersTurn, damage, player, boss)

    if (defender.hit_points <= 0) return playersTurn;

    playersTurn = !playersTurn;
  }
}

function buildPlayer(...items) {
  const player = { ...basePlayer };
  let totCost = 0;
  items.map(([_n, cost, damage, armor]) => {
    totCost += cost;
    player.damage += damage;
    player.armor += armor;
  });

  return [player, totCost];
}

let maxLoseGold = 0;
let minWinGold = Infinity;
for (const items of genInventory()) {
  const [player, cost] = buildPlayer(...items);
  if (battle(player, { ...baseBoss })) {
    minWinGold = Math.min(minWinGold, cost);
  } else {
    maxLoseGold = Math.max(maxLoseGold, cost);
  }
}

const partOne = minWinGold;
console.log("part one", partOne); // 78

const partTwo = maxLoseGold;
console.log("part two", partTwo); // 148
