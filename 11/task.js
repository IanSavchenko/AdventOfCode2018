let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inp = +data;

// PART 1
let part1 = 0;

let w = 300;
let h = 300;

let calcSingle = (x, y) => {
  let rack = x + 10;
  let power = rack * y;
  power += inp;
  power *= rack;
  power = _.floor(power / 100) % 10;
  power -= 5;

  return power;
};

let maxSquare = (size) => {
  let max = {val: 0};
  util.arr2dForEach(arr, (val, x, y) => {
    let sum = 0;
    util.arr2dForEach(arr, (val) => {
      sum += val;
    }, x, y, x + size, y + size);
  
    if (sum > max.val) {
      max = {
        x,
        y,
        size,
        val: sum
      };
    }
  }, 0, 0, w - size, h - size);

  return max;
};

let arr = util.arr2dInit(w, h, 0);
util.arr2dForEach(arr, (_val, x, y) => {
  arr[x][y] = calcSingle(x + 1, y + 1);
});

part1 = maxSquare(3);
part1 = `${part1.x + 1},${part1.y + 1}`;

console.log(`Part 1: ${part1}`);
console.assert(part1 === '235,18');

// PART 2
let part2 = {val: 0};

for (let size = 1; size <= 300; size++) {
  let cur = maxSquare(size);
  if (cur.val > part2.val) {
    part2 = cur;
  }
}

part2 = `${part2.x + 1},${part2.y + 1},${part2.size}`;
console.log(`Part 2: ${part2}`);
console.assert(part2 === '236,227,12');