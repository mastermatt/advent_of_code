const readFile = require("../../helpers/readFile");

const input = readFile(__dirname, "./input.txt");

const inputToDisk = (str) => {
  const disk = [];
  let id = 0;

  for (let i = 0; i < str.length; i += 2) {
    const fileLength = Number(str[i]);
    const fileBlocks = new Array(fileLength).fill(id);
    disk.push(...fileBlocks);

    const char = str[i + 1];
    if (!char) continue;
    const freeLength = Number(char);
    const freeBlocks = new Array(freeLength);
    disk.push(...freeBlocks);

    id++;
  }

  return disk;
};

const compactDisk = (inputDisk) => {
  const disk = [...inputDisk];
  let p1 = 0;
  let p2 = inputDisk.length - 1;

  while (true) {
    while (disk[p1] !== undefined) ++p1;
    while (disk[p2] === undefined) --p2;

    if (p1 >= p2) break;
    disk[p1] = disk[p2];
    disk[p2] = undefined;
  }

  disk.length = p2 + 1;

  return disk;
};

const checksumDisk = (disk) => {
  return disk.reduce((sum, fileId, idx) => sum + idx * (fileId ?? 0), 0);
};

const disk = inputToDisk(input[0]);

const partOne = checksumDisk(compactDisk(disk));
console.log("part one", partOne, partOne === 6241633730082);

// I'm not sure if a linked list was the best option here, but I was having fun
// and wanted to mix it up.
const inputToList = (str) => {
  const sizes = str.split("").map(Number);
  const first = { fileId: 0, prev: null };
  let curr = first;

  while (sizes.length) {
    curr.size = sizes.shift();
    curr.free = sizes.shift() ?? 0;
    curr.next = { fileId: curr.fileId + 1, prev: curr };
    curr = curr.next;
  }

  const last = curr.prev;
  last.next = null;

  return { first, last };
};

const defragList = ({ first, last }) => {
  let curr = last;

  while (curr.prev) {
    let check = first;
    const next = curr.prev;

    while (check.fileId !== curr.fileId) {
      if (check.free >= curr.size) {
        curr.prev.free += curr.size + curr.free;
        curr.prev.next = curr.next;
        if (curr.next) curr.next.prev = curr.prev;

        curr.free = check.free - curr.size;
        check.free = 0;

        curr.next = check.next;
        curr.prev = check;

        check.next.prev = curr;
        check.next = curr;

        break;
      }
      check = check.next;
    }

    curr = next;
  }
};

const listToDisk = ({ first, last }) => {
  const disk = [];
  let curr = first;

  while (curr) {
    const fileBlocks = new Array(curr.size).fill(curr.fileId);
    disk.push(...fileBlocks);

    if (curr.free) {
      const freeBlocks = new Array(curr.free);
      disk.push(...freeBlocks);
    }
    curr = curr.next;
  }

  return disk;
};

const list = inputToList(input[0]);
defragList(list);

const partTwo = checksumDisk(listToDisk(list));
console.log("part two", partTwo, partTwo === 6265268809555);
