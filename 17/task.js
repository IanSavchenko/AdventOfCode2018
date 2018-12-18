let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let map = util.arr2dInit(2000, 2000, '.');
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();

let min = Number.MAX_SAFE_INTEGER;
let max = 0;

util.splitLines(data).map(line => {
  if (line[0] === 'x') {
    let x = +line.split('=')[1].split(',')[0];
    let y = line.split(' ')[1].split('=')[1].split('..').map(v => +v);
    for(let i = y[0]; i <= y[1]; i++) {
      map[i][x] = '#';
      max = Math.max(max, i);
      min = Math.min(min, i);
    }
  } else if (line[0] === 'y') {
    let y = +line.split('=')[1].split(',')[0];
    let x = line.split(' ')[1].split('=')[1].split('..').map(v => +v);

    max = Math.max(max, y);
    min = Math.min(min, y);

    for(let i = x[0]; i <= x[1]; i++) {
      map[y][i] = '#';
    }
  }
});

map[0][500] = '+';

// PART 1
let moveDown = function(x, y) {
  if (map[y + 1][x] === '.') {
    map[y + 1][x] = '|';
    return [{y: y + 1, x}];
  } 

  if (map[y + 1][x] === '#') {
    return moveSides(x, y);
  }

  if (map[y + 1][x] === '~') {
    return moveSides(x, y);
  }

  if (map[y + 1][x] === '|') {
    return [{y: y + 1, x}];
  }

  throw new Error();
};

let moveSides = function(x, y) {
  let xl = x;
  let l = false;
  while (true) {
    xl--;
    if (map[y][xl] === '#') {
      l = true;
      xl++;
      break;
    }

    let below = map[y + 1][xl];
    if (below !== '#' && below !== '~') {
      break;
    }
  }

  let xr = x;
  let r = false;
  while (true) {
    xr++;
    if (map[y][xr] === '#') {
      r = true;
      xr--;
      break;
    }

    let below = map[y + 1][xr];
    if (below !== '#' && below !== '~') {
      break;
    }
  }

  if (l && r) {
    for (let i = xl; i <= xr; i++) {
      map[y][i] = '~';
    }

    let toScan = _.range(xl, xr + 1)
      .filter(x => map[y - 1][x] === '|')
      .map(x => {return {x, y: y - 1};});
    return toScan;
  }

  for (let i = xl; i <= xr; i++) {
    map[y][i] = '|';
  }

  let toScan = [];
  if (!l) {
    toScan.push({x: xl, y});
  }

  if (!r) {
    toScan.push({x: xr, y});
  }

  return toScan;
};

let q = [{x: 500, y: 0}];
while (q.length) {
  let {x, y} = q.shift();
  if (y > max) {
    continue;
  }

  switch(map[y][x]) {
  case('+'):
    q.push(...moveDown(x, y));
    break;
  case('|'):
    q.push(...moveDown(x, y));
    break;
  case('#'):
    q.push(...moveSides(x, y));
    break;
  case ('~'):
    break;
  default: 
    throw new Error();
  }
}

let part1 = 0;

util.arr2dForEach(map, (val, y) => {
  if (y > max || y < min) {
    return;
  }

  if (val === '~' || val === '|') {
    part1++;
  }
});

console.log(`Part 1: ${part1}`);
console.assert(part1 === 34379);

// PART 2
let part2 = 0;

util.arr2dForEach(map, (val, y) => {
  if (y > max || y < min) {
    return;
  }

  if (val === '~') {
    part2++;
  }
});

console.log(`Part 2: ${part2}`);
console.assert(part2 === 28015);
