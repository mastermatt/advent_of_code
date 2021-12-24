const CoordinateMap = require("../../helpers/coordinateMap");
const PriorityQueue = require("../../helpers/priorityQueue");

// #############
// #...........#
// ###D#A#C#C###
//   #D#A#B#B#
//   #########
const starting = [
  [3, 3],
  [0, 0],
  [1, 2],
  [1, 2],
];

// #############
// #...........#
// ###D#A#C#C###
//   #D#C#B#A#
//   #D#B#A#C#
//   #D#A#B#B#
//   #########
const starting2 = [
  [3, 3, 3, 3],
  [0, 1, 2, 0],
  [1, 0, 1, 2],
  [1, 2, 0, 2],
];

const hallLength = 11;

function* possibleMoves(map, currIdx) {
  const amphipod = map[currIdx];
  const hallIdx = map.length - hallLength;
  const inHall = currIdx >= hallIdx;
  const roomSizes = hallIdx / 4;
  const ownRoomIdx = amphipod * roomSizes;
  let steps = 0;

  if (inHall) {
    // when an amphipod is in the hall, the only valid move it could have would be to go all the way into its own room.
    // if there is another amphipod blocking the route or the wrong type of amphipod in the room still, then no moves are possible.

    // first lets see if we can get to the space immediately outside the room without being blocked and how many steps it takes.
    const dest = hallIdx + amphipod * 2 + 2;
    const dist = dest - currIdx;
    const dir = dist > 0 ? 1 : -1;
    steps += Math.abs(dist);
    for (let i = currIdx + dir; i !== dest; i += dir) {
      if (map[i] !== null) return; // there is another amphipod blocking the route, this amphipod has no move
    }

    // now examine the room. amphipods will always be packed towards the back
    for (let i = 0; i < roomSizes; i++) {
      const atSpot = map[ownRoomIdx + i];
      if (atSpot === amphipod) continue; // a fellow amphipod of the same type is already here.
      if (atSpot !== null) return; // an amphipod of another type is still in the room, we can't move in.

      // we found a valid move
      steps += roomSizes - i;
      yield [ownRoomIdx + i, steps];
      return; // because we know an amphipod in the hall has at most one valid move, skip out
    }
  }

  // when an amphipod is in a room, they can move to any of the valid hall spots they can reach.
  // if they are in their own room _and_ there are no invalid amphipod with them, they should not move.
  const inOwnRoom = currIdx >= ownRoomIdx && currIdx < ownRoomIdx + roomSizes;
  let baddieInRoom = false;
  for (let i = 0; i < roomSizes; i++) {
    const atSpot = map[ownRoomIdx + i];
    if (atSpot !== null && atSpot !== amphipod) baddieInRoom = true;
  }
  if (inOwnRoom && !baddieInRoom) return; // amphipod already at end state
  if (inOwnRoom) debugger;

  // let's see if the amphipod is unblocked to the hallway and how many steps it takes
  const idxInRoom = currIdx % roomSizes;
  steps = roomSizes - idxInRoom;
  if (steps > 1 && map[currIdx + 1] !== null) return; // this amphipod is blocked in the room

  // now that we know we can move to the hallway, we need to look in both directions for all the valid, unblocked spots
  const startIdxInHall = hallIdx + ((currIdx / roomSizes) | 0) * 2 + 2;

  // go left first
  for (let i = 1; i <= startIdxInHall - hallIdx; i++) {
    if (i % 2 === 0 && i !== startIdxInHall - hallIdx) continue; // invalid spot because it's in front of another room
    if (map[startIdxInHall - i] !== null) break; // blocked in this direction
    yield [startIdxInHall - i, steps + i];
  }

  // then go right
  const lastIdx = map.length - 1;
  for (let i = 1; i <= lastIdx - startIdxInHall; i++) {
    if (i % 2 === 0 && i !== lastIdx - startIdxInHall) continue; // invalid spot because it's in front of another room
    if (map[startIdxInHall + i] !== null) break; // blocked in this direction
    yield [startIdxInHall + i, steps + i];
  }
}

function printMap(map) {
  // #############
  // #...........#
  // ###D#A#C#C###
  //   #D#C#B#A#
  //   #D#B#A#C#
  //   #D#A#B#B#
  //   #########

  const chars = ["A", "B", "C", "D"];
  const roomSize = map.length === 19 ? 2 : 4;
  const char = (val) => (val === null ? "." : chars[val]);
  const hall = map.slice(-hallLength).map(char).join("");
  const row = (i) =>
    `#${char(map[i])}#${char(map[roomSize + i])}#${char(
      map[roomSize * 2 + i]
    )}#${char(map[roomSize * 3 + i])}#`;

  if (map.length === 19)
    console.log(`
  #############
  #${hall}#
  ##${row(1)}##
    ${row(0)}
    #########`);
  else
    console.log(`
  #############
  #${hall}#
  ##${row(3)}##
    ${row(2)}
    ${row(1)}
    ${row(0)}
    #########`);
}

function solve(startingRooms) {
  const startingHall = new Array(hallLength).fill(null);
  const startingState = [...startingRooms.flat(), ...startingHall];
  const numPos = startingState.length;
  const stack = new PriorityQueue((a, b) => a[1] < b[1]);
  stack.push([startingState, 0]);
  const seen = new CoordinateMap();

  while (!stack.isEmpty()) {
    const [state, energy] = stack.pop();
    const prev = seen.get(...state) || Infinity;

    if (energy < prev) seen.set(...state, energy);
    else continue;

    for (let i = 0; i < numPos; i++) {
      const amphipod = state[i];
      if (amphipod === null) continue;

      for (const [pos, steps] of possibleMoves(state, i)) {
        const newState = [...state];
        newState[i] = null;
        newState[pos] = amphipod;
        const newEnergy = 10 ** amphipod * steps + energy;
        stack.push([newState, newEnergy]);
      }
    }
  }
  const end = [...startingState].sort();
  return seen.get(...end);
}

console.time("part one");
const partOne = solve(starting);
console.timeEnd("part one");
// console.log("part one", partOne, partOne === 12521); // example
console.log("part one", partOne, partOne === 19046);

console.time("part two");
const partTwo = solve(starting2);
console.timeEnd("part two");
// console.log("part two", partTwo, partTwo === 44169); // example
console.log("part two", partTwo, partTwo === 47484);
