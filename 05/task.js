let _ = require('lodash');
let fs = require('fs');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('');

// PART 1
let part1 = 0;

let findPrev = function(removals, pos) {
  if (pos === 0) {
    return undefined;
  }

  if (!(pos - 1 in removals)) {
    return pos - 1;
  } else {
    return findPrev(removals, removals[pos - 1]);
  }
};

let remove = function(s) {
  let cur = 0;
  let next = 1;
  let removed = 0;
  let removals = {};
  while(next < s.length) {
    if (s[cur] !== s[next] && _.toLower(s[cur]) === _.toLower(s[next])) {
      removed += 2;   
      removals[next] = cur; 

      let newCur = findPrev(removals, cur);
      if (newCur !== undefined) { 
        // grow wide
        cur = newCur;
        next += 1;
      } else {
        // jump forward on next 2
        cur = next + 1;
        next += 2;
      }
    } else {
      cur = next;
      next++;
    }
  }

  return s.length - removed;
};

part1 = remove(data);

console.log(`Part 1: ${part1}`); // 10972

// PART 2
let part2 = Number.MAX_SAFE_INTEGER;

let a = 'a'.charCodeAt(0);
let z = 'z'.charCodeAt(0);
for (let i = a; i <= z; i++) {
  let d = _.filter(data, c => !(c.charCodeAt(0) === i || _.toLower(c).charCodeAt(0) === i));
  d = remove(d);
  part2 = Math.min(d, part2);
}

console.log(`Part 2: ${part2}`); // 5278