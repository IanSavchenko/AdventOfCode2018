let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inp = util.splitLines(data).map(val => val.split(''));

// PART 1
let transform = function() {
  let prev = _.cloneDeep(inp);

  util.arr2dForEach(inp, function(val, x, y) {
    let cnt = {'|': 0, '#': 0, '.': 0};

    util.arr2dForEach(prev, function(val) {
      cnt[val]++;
    }, x - 1, y - 1, x + 2, y + 2);

    cnt[prev[x][y]]--;

    switch(val) {
    case('|'):
      if (cnt['#'] >= 3) {
        inp[x][y] = '#';
      }
      break;
    case('.'): 
      if (cnt['|'] >= 3) {
        inp[x][y] = '|';
      }
      break;
    case('#'):
      if (!(cnt['#'] >= 1 && cnt['|'] >= 1)) {
        inp[x][y] = '.';
      }
      break;
    }
  });
};

let it = [0];
while (it.length <= 1000) {
  transform();

  let cnt = {'|': 0, '#': 0, '.': 0};
  util.arr2dForEach(inp, function(val) {
    cnt[val]++;
  });
  
  let num = cnt['|'] * cnt['#'];
  it.push(num);
}

let part1 = it[10];
console.log(`Part 1: ${part1}`);
console.assert(part1 === 507755);

// PART 2
let cycle = 1; 
while (true) {
  let valid = true;
  for(let i = it.length - cycle; i < it.length; i++) {
    if (it[i] !== it[i - cycle]) {
      valid = false;
      break;
    }
  }

  if (valid) {
    break;
  } 

  cycle++;
}

let base = 500;
let part2 = it[base + (1000000000 - base) % cycle];

console.log(`Part 2: ${part2}`);
console.assert(part2 === 235080);