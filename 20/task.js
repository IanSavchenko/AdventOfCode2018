let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim().split('');

// PART 1
let parens = [];
let map = util.arr2dInit(300, 300, '#');
let start = {r: Math.floor(map.length/2), c: Math.floor(map[0].length/2)};

{
  let {r, c} = start;
  for(let ch of data) {
    map[r][c] = '.';
    switch(ch) {
    case('N'):
      map[--r][c] = '-';
      r--;
      break;
    case('S'):
      map[++r][c] = '-';
      r++;
      break;
    case('W'):
      map[r][--c] = '|';
      c--;
      break;
    case('E'):
      map[r][++c] = '|';
      c++;
      break;
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
  if (map[r - 1][c] === '-' && map[r - 2][c] === '.') {
    map[r - 2][c] = val + 1;
    q.push({r: r - 2, c });
  } 

  if (map[r + 1][c] === '-' && map[r + 2][c] === '.') {
    map[r + 2][c] = val + 1;
    q.push({r: r + 2, c });
  } 

  if (map[r][c - 1] === '|' && map[r][c - 2] === '.') {
    map[r][c - 2] = val + 1;
    q.push({r, c: c - 2 });
  } 
  
  if (map[r][c + 1] === '|' && map[r][c + 2] === '.') {
    map[r][c + 2] = val + 1;
    q.push({r, c: c + 2 });
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