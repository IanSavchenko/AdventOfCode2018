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

let arr = util.arr2dInit(_.maxBy(input, t => t.x).x + 2, _.maxBy(input, t => t.y).y + 2, 0);

let border = new Set([-1]);
util.arr2dForEach(arr, function(val, x, y) {
  let d = input.map(function({x: gx, y: gy}) {
    return Math.abs(x - gx) + Math.abs(y - gy);
  });

  let {
    value: minDist,
    index: minIndex
  } = util.minAndIndex(d);

  if (_.filter(d, x => x == minDist).length > 1) {
    arr[x][y] = -1;
  } else {
    arr[x][y] = minIndex;
  }

  if (x === 0 || y === 0 || x === arr.length - 1 || y === arr[0].length - 1) {
    border.add(arr[x][y]);
  } 
});

let size = {};
util.arr2dForEach(arr, function(val) {
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

console.log(`Part 1: ${part1}`); // 5532

// PART 2
let part2 = 0;

util.arr2dForEach(arr, function(val, x, y) {
  let total = 0;
  _.forEach(input, function({x: gx, y: gy}) {
    total += Math.abs(x - gx) + Math.abs(y - gy);
  });
  
  if (total < 10000) {
    part2++;
  }
});

console.log(`Part 2: ${part2}`); // 36216