let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('');

let dirs = {
  N: {r: 1, c: 0, w: '-'},
  S: {r: -1, c: 0, w: '-'},
  E: {r: 0, c: 1, w: '|'},
  W: {r: 0, c: -1, w: '|'},
};

// PART 1
let parens = [];
let map = util.arr2dInit(300, 300, '#');
let start = {r: Math.floor(map.length/2), c: Math.floor(map[0].length/2)};

{
  let {r, c} = start;
  map[start.r][start.c] = 'X';
  for(let ch of data) {
    if (ch in dirs) {
      let d = dirs[ch];
      r += d.r;
      c += d.c;
      map[r][c] = d.w;
      r += d.r;
      c += d.c;
      map[r][c] = '.';
      continue;
    }

    switch(ch) {
    case('('):
      parens.push({r, c});
      break;
    case(')'):
      ({r, c} = parens.pop());
      break;
    case('|'):
      ({r, c} = _.last(parens));
      break;
    }
  }
}

// _.forEach(map, r => console.log(r.join('')));

let part1 = 0;
let part2 = 0;

let q = [];
q.push(start);
map[start.r][start.c] = 0;

while (q.length) {
  const {r, c} = q.shift();
  let val = map[r][c];

  for(let d in dirs) {
    d = dirs[d];
    if (map[r + d.r][c + d.c] === d.w && map[r + 2*d.r][c + 2*d.c] === '.') {
      map[r + 2*d.r][c + 2*d.c] = val + 1;
      q.push({r: r + 2*d.r, c: c + 2*d.c });
    }
  }

  part1 = Math.max(val, part1);
  if (val >= 1000) {
    part2++;
  }
}

console.log(`Part 1: ${part1}`);
console.assert(part1 === 3465);

console.log(`Part 2: ${part2}`);
console.assert(part2 === 7956);