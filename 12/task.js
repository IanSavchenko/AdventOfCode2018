let _ = require('lodash');
let fs = require('fs');
let util = require('../util');

// INPUT PROCESSING
let data = fs.readFileSync(__dirname + '/input.txt', 'utf8').trim();
let lines = util.splitLines(data);

let inp = [...lines[0].substr(15)];
let rules = _.chain(lines).drop(2).map(line => {
  let pattern = [...line.substr(0, 5)];
  let result = line[9];
  return {
    pattern,
    result
  };
}).value();

// PART 1 + 2
let start = 0;
let it = [];
let diffs = [];

for(let i = 0; i < 1000; i++) {
  while (!_.take(inp, 5).every(x => x === '.')) {
    inp.splice(0, 0, '.');
    start--;
  }

  while (!_.takeRight(inp, 5).every(x => x === '.')) {
    inp.push('.');
  }

  inp = _.map(inp, function(_s, j) {
    let sub = _.chain(inp).drop(j - 2).take(5).value();
    let rule = _.find(rules, rule => {
      return _.isEqual(rule.pattern, sub);
    });

    return rule ? rule.result : '.';
  });

  let cnt = _.chain(inp)
    .map((s, n) => s === '#' ? n + start : 0)
    .sum().value();

  it.push(cnt);
  diffs.push(it[i] - it[i - 1]);
  if (_.every(_.takeRight(diffs, 100), d => d === diffs[i])) {
    break;
  }
}

let part1 = it[19];
console.log(`Part 1: ${part1}`);
console.assert(part1 === 1696);

let part2 = _.last(diffs) * (50*1000*1000*1000 - it.length) + _.last(it);
console.log(`Part 2: ${part2}`);
console.assert(part2 === 1799999999458);