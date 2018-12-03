let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let input = util.splitLines(data);
let sqs = input
  .filter(x => x)
  .map(x => /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(x))
  .map(g => ({
    id:+g[1], 
    x:+g[2],
    y:+g[3],
    w:+g[4], 
    h:+g[5]
  }));

// PART 1
let part1 = 0;

let m = util.arr2dInit(1000, 1000, 0);

_.forEach(sqs, (sq) => {
  util.arr2dForEach(m, function (_val, i, j){
    m[i][j]++;
  }, sq.x, sq.y, sq.x + sq.w, sq.y + sq.h);
}); 

util.arr2dForEach(m, val => {
  if (val > 1) {
    part1++;
  }
});

console.log(`Part 1: ${part1}`);

// PART 2
let part2 = 0;

_.forEach(sqs, (sq) => {
  let flag = true;
  util.arr2dForEach(m, function(val) {
    if (val !== 1) {
      flag = false;
    }
  }, sq.x, sq.y, sq.x + sq.w, sq.y + sq.h);

  if (flag) {
    part2 = sq.id;
  }
}); 

console.log(`Part 2: ${part2}`);