let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let input = util.splitLines(data).map(val => {
  val = val.split(',');
  return {
    x: +val[0],
    y: +val[1]
  };
});

// PART 1
let part1 = 0;

let rows =  _.maxBy(input, t => t.x).x + 2;
let cols = _.maxBy(input, 'y').y + 2;
let arr = util.arr2dInit(rows, cols);

let border = new Set([-1]);
util.arr2dForEach(arr, (val, x, y) => {
  let d = input.map(({x: px, y: py}) => {
    return Math.abs(x - px) + Math.abs(y - py);
  });

  let {
    value: minDist,
    index: minIndex
  } = util.minAndIndex(d);

  arr[x][y] = _.filter(d, x => x == minDist).length === 1 ? minIndex : -1;

  if (x === 0 || y === 0 || x === rows - 1 || y === cols - 1) {
    border.add(arr[x][y]);
  } 
});

let size = {};
util.arr2dForEach(arr, (val) => {
  if (border.has(val)) {
    return;
  }

  if (val in size) {
    size[val]++;
  } else {
    size[val] = 1;
  }
  
  if (size[val] > part1) {
    part1 = size[val];
  }
});

console.log(`Part 1: ${part1}`);
console.assert(part1 === 5532);

// PART 2
let part2 = 0;

util.arr2dForEach(arr, (val, x, y) => {
  let total = 0;
  _.forEach(input, ({x: px, y: py}) => {
    total += Math.abs(x - px) + Math.abs(y - py);
  });
  
  if (total < 10000) {
    part2++;
  }
});

console.log(`Part 2: ${part2}`);
console.assert(part2 === 36216);