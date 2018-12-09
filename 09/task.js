let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let input = data.split(' ');
let players = +input[0];
let last = +input[6];

// PART 1
let part1 = 0;

let calc = function(players, last) {
  let m = 1;
  let score = util.arr1dInit(players, 0);

  let list = new util.CircularList();
  list.insert(0);

  while (m <= last) {
    if (m % 23 !== 0) {
      list.moveRight(1);
      list.insert(m);
    } else {
      score[m % players] += m;
      list.moveLeft(7);
      score[m % players] += list.cur.val;
      list.remove();
    }
  
    m++;
  }

  return _.max(score);
};

part1 = calc(players, last);

console.log(`Part 1: ${part1}`);
console.assert(part1 === 388131);

// PART 2
let part2 = calc(players, last * 100);

console.log(`Part 2: ${part2}`);
console.assert(part2 === 3239376988);