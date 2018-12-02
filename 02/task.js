let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8');
let input = data.split('\n');

// PART 1
let part1 = 0;

let two = 0;
let three = 0;

input.forEach(st => {
  let chars = st.split('');
  let cnt = {};

  chars.forEach(ch => {
    if (!cnt[ch]) {
      cnt[ch] = 1;
      return;
    } 

    cnt[ch]++;
  });

  if (_.some(cnt, val => val === 2)) {
    two++;
  }

  if (_.some(cnt, val => val === 3)) {
    three++;
  }
});

part1 = two*three;

console.log(`Part 1: ${part1}`);

// PART 2
let part2;

let perms = new Set();
input.forEach((st) => {
  for (let pos = 0; pos < st.length; pos++) {
    let s = util.removeChar(st, pos);
    if (perms.has(s + pos)) {
      part2 = s;
      return;
    }

    perms.add(s + pos);
  }
});

console.log(`Part 2: ${part2}`);