const lodash = require("lodash");

// -- input --
// Hit Points: 71
// Damage: 10

function applyEffects(state) {
  if (state.effects.shield) {
    state.player.armor = 7;
    --state.effects.shield;
  } else {
    state.player.armor = 0;
  }

  if (state.effects.poison) {
    state.boss.hit_points -= 3;
    --state.effects.poison;
  }

  if (state.effects.recharge) {
    state.player.mana += 101;
    --state.effects.recharge;
  }
}

const spells = [
  ["missile", 53, (state) => (state.boss.hit_points -= 4)],
  [
    "drain",
    73,
    (state) => {
      state.boss.hit_points -= 2;
      state.player.hit_points += 2;
    },
  ],
  ["shield", 113, (state) => (state.effects.shield = 6)],
  ["poison", 173, (state) => (state.effects.poison = 6)],
  ["recharge", 229, (state) => (state.effects.recharge = 5)],
];

const initialState = {
  spend: 0,
  player: {
    hit_points: 50,
    armor: 0,
    mana: 500,
  },
  boss: {
    hit_points: 71,
    damage: 10,
  },
  effects: {
    shield: 0,
    poison: 0,
    recharge: 0,
  },
  history: [],
};

function run(playerLoss) {
  const stack = [initialState];
  let minMana = Infinity;
  while (stack.length) {
    const state = stack.pop();

    if (state.boss.hit_points <= 0) {
      // you win!
      // console.log("win", state.spend, minMana, state.history.join(","));
      minMana = Math.min(minMana, state.spend);
      continue;
    }

    if (state.player.hit_points <= 0) {
      // you lose
      // console.log("lose", state.spend, minMana, state.history.join(","));
      continue;
    }

    for (const [name, cost, spellCb] of spells) {
      const newState = lodash.cloneDeep(state);

      // player's turn
      newState.player.hit_points -= playerLoss;
      applyEffects(newState);
      newState.spend += cost;

      if (
        cost > newState.player.mana || // can't afford spell
        newState.effects[name] || // spell is already active
        newState.spend >= minMana // trim branch to optimize
      )
        continue;

      newState.player.mana -= cost;
      spellCb(newState);
      // newState.history.push(name);

      // boss's turn
      applyEffects(newState);
      const damage = newState.boss.damage - newState.player.armor;
      newState.player.hit_points -= damage;
      stack.push(newState);
    }
  }
  return minMana;
}

const partOne = run(0);
console.log("part one", partOne); // 1824

const partTwo = run(1);
console.log("part two", partTwo); // 1937
