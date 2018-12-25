let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let pts = util.splitLines(data).map(line => {
  line = line.split(',');
  return line.map(x => +x);
});

let md = function(a, b) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]);
};

// PART 1
let part1 = 0;

let graphs = _.map(pts, p => [p]);
let prev = graphs.length;
while (true) {
  let toMerge = [];
  for (let first of graphs) {
    for (let second of graphs) {
      if (first === second) {
        continue;
      }

      for (let v1 of first) {
        for (let v2 of second) {
          if (md(v1, v2) <= 3) {
            toMerge.push({first, second});
          }
        }
      }
    }
  }

  for(let merge of toMerge) {
    let {first, second} = merge;
    if (graphs.includes(first) && graphs.includes(second)) {
      first.push(...second);
      _.pull(graphs, second);
    }
  }

  if (prev === graphs.length) {
    break;
  }

  prev = graphs.length;
}

part1 = graphs.length;
console.log(`Part 1: ${part1}`);
console.assert(part1 === 359);

// PART 2
console.log('Part 2: No Part 2! Just go trigger the underflow!');