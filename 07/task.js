let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING

let all = new Set();
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let input = util.splitLines(data).map(l => {
  l = l.split(' ');
  all.add(l[1]);
  all.add(l[7]);
  return { dep: l[1], tgt: l[7]};
});

all = [...all].sort();

// PART 1
let part1;

let getNext = (tgts, resolved) => 
  _.difference(tgts, resolved)
    .filter(tgt => {
      let deps = _.filter(input, {tgt}).map(y => y.dep);
      return _.difference(deps, resolved).length === 0;
    });

let resolved = [];
while (true) {
  let next = getNext(all, resolved);
  if (next.length) {
    resolved.push(next[0]);
    continue;
  }

  break;
}

part1 = resolved.join('');

console.log(`Part 1: ${part1}`);
console.assert(part1 === 'GDHOSUXACIMRTPWNYJLEQFVZBK');

// PART 2
let part2;

let workers = [];
let started = [];
let finished = [];
let t = 0;

while(true) {
  finished.push(..._.remove(workers, x => x.t <= t).map(x => x.tgt));
  
  let toExec = getNext(_.difference(all, started), finished);
  if (!workers.length && finished.length === all.length) {
    break;
  } 

  while (workers.length < 5 && toExec.length > 0) {
    let tgt = toExec.shift();
    workers.push({tgt, t: t + (tgt.charCodeAt(0) - 'A'.charCodeAt(0)) + 61});
    started.push(tgt);
  }

  t++;
}

part2 = t;

console.log(`Part 2: ${part2}`);
console.assert(part2 === 1024);