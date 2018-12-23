let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let inp = util.splitLines(data).map(row => {
  row = row.trim().split('<');
  let bot = {};
  let pos = row[1].split('>')[0].split(',').map(el => +el);
  bot.x = pos[0];
  bot.y = pos[1];
  bot.z = pos[2];
  bot.r = +row[1].split('r=')[1];
  return bot;
});

let md = function(a, b) {
  if (!b) {
    b = {x: 0, y: 0, z: 0};
  }

  return Math.abs(a.x-b.x) + Math.abs(a.y-b.y) + Math.abs(a.z-b.z);
};

// PART 1
let strongest = _.maxBy(inp, 'r');
let inRange = _.filter(inp, b => {
  return md(strongest, b) <= strongest.r;
});

let part1 = inRange.length;
console.log(`Part 1: ${part1}`);
console.assert(part1 === 341);

// PART 2
let part2 = 0;

let xmax = _.maxBy(inp, 'x').x;
let xmin = _.minBy(inp, 'x').x;
let ymax = _.maxBy(inp, 'y').y;
let ymin = _.minBy(inp, 'y').y;
let zmax = _.maxBy(inp, 'z').z;
let zmin = _.minBy(inp, 'z').z;

let step = _.max([xmax-xmin, ymax-ymin, zmax-zmin]);

do {
  let maxPos;
  let maxDist;
  let maxCnt = 0;
  
  for (let x = xmin; x < xmax; x += step) {
    for (let y = ymin; y < ymax; y += step) {
      for (let z = zmin; z < zmax; z += step) {
        let pos = {x,y,z};
        let posDist = md(pos);

        let inRange = _.filter(inp, bot => {
          return md(bot, pos) - bot.r <= step - 1;
        }).length;

        if (inRange > maxCnt || 
          (inRange === maxCnt && posDist < maxDist)) {
          maxCnt = inRange;
          maxPos = pos;
          maxDist = posDist;
        }
      } 
    }
  }

  part2 = maxDist;

  // stretching search interval around the best position
  xmin = maxPos.x - step;
  ymin = maxPos.y - step;
  zmin = maxPos.z - step;
  xmax = maxPos.x + step;
  ymax = maxPos.y + step;
  zmax = maxPos.z + step;

  // reducing search step
  step = _.floor(step / 2);
} while (step > 0);

console.log(`Part 2: ${part2}`); 
console.assert(part2 === 105191907);
