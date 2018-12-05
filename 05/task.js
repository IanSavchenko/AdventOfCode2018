let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('');

// PART 1
let part1 = 0;

let remove = function(s) {
  s = s.slice();
  for (let i = 0; i < s.length - 1;) {
    if (s[i] !== s[i + 1] && _.toLower(s[i]) === _.toLower(s[i + 1])) {
      s.splice(i, 2);
      i = i - 1;
    } else {
      i++;
    }
  }

  return s;
};

part1 = remove(data).length;

console.log(`Part 1: ${part1}`); // 10972

// PART 2
let part2 = Number.MAX_SAFE_INTEGER;

let a = 'a'.charCodeAt(0);
let z = 'z'.charCodeAt(0);
for (let i = a; i <= z; i++) {
  let d = _.filter(data, c => !(c.charCodeAt(0) === i || _.toLower(c).charCodeAt(0) === i));
  d = remove(d);
  part2 = Math.min(d.length, part2);
}

console.log(`Part 2: ${part2}`); // 5278